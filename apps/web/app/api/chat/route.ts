import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { runMentorEngine } from "@/lib/mentor/engine";
import { extractMemoryWithLLM } from "@/lib/mentor/memory/extract";
import { persistMemory } from "@/lib/mentor/memory/memory";
import { corsHeaders } from "@/lib/cors";
import { nanoid } from "nanoid";

// Guest daily quota
const DAILY_FREE_LIMIT = 3;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, messageId, content, anonymous = true } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Missing content" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    // Authenticated users can send with userId derived from session.
    const authSession = await auth();
    const isAuthenticated = !!authSession?.user?.id;
    const userId = isAuthenticated ? authSession.user.id : undefined;

    if (!anonymous && !userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401, headers: corsHeaders(req.headers.get("origin")) });
    }

    // 1. Get or create anonymous session
    let session = await prisma.anonymousSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      session = await prisma.anonymousSession.findUnique({
        where: { fingerprintId: sessionId },
      });
    }

    if (!session) {
      session = await prisma.anonymousSession.create({
        data: {
          fingerprintId: sessionId,
          dailyQuotaReset: new Date(),
        },
      });
    }

    // 2. Quota check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usage = await prisma.usageRecord.findUnique({
      where: {
        anonymousSessionId_date: {
          anonymousSessionId: session.id,
          date: today,
        },
      },
    });

    if (usage && usage.usedCount >= DAILY_FREE_LIMIT) {
      return NextResponse.json(
        {
          error: "DAILY_LIMIT_REACHED",
          message: "You've used your 3 free questions for today. Sign in to continue.",
        },
        { status: 429, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    // 3. Get or create conversation
    let conversationId = messageId;
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          anonymousSessionId: session.id,
          title: content.slice(0, 80),
        },
      });
      conversationId = conversation.id;
    }

    // 4. Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content,
      },
    });

    // 5. Run Mentor Engine
    const { response, mentorContext } = await runMentorEngine({
      conversationId: conversation.id,
      anonymousSessionId: session.id,
      userMessage: content,
    });

    // 6. Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: response.answer,
        intent: response.intent,
        primaryDomain: mentorContext.understanding?.primaryDomain || null,
        domains: mentorContext.understanding?.secondaryDomains || [],
        riskLevel: response.safetyStatus,
        retrievedKnowledgeIds: response.knowledgeNodesUsed,
        memoryIds: response.memoriesUsed,
        metadata: {
          reasoningPlan: mentorContext.reasoningPlan as any,
        },
      },
    });

    // 6.1 Return assistant message id for feedback linking
    response.assistantMessageId = assistantMessage.id;

    // 6.5. Async memory extraction (only for logged-in users)
    if (userId && mentorContext.understanding) {
      extractMemoryWithLLM({
        userMessage: content,
        assistantMessage: response.answer,
        understanding: mentorContext.understanding,
      }).then((memory) => {
        if (memory && memory.shouldSave) {
          persistMemory({
            userId,
            content: memory.content,
            type: memory.type,
            sourceMessageId: assistantMessage.id,
            sourceConversationId: conversation.id,
          }).catch((err) => console.error("[chat] Memory persistence failed:", err));
        }
      }).catch((err) => console.error("[chat] Memory extraction failed:", err));
    }

    // 7. Update usage (not counted for crisis responses)
    if (response.safetyStatus !== "crisis") {
      await prisma.usageRecord.upsert({
        where: {
          anonymousSessionId_date: {
            anonymousSessionId: session.id,
            date: today,
          },
        },
        update: {
          usedCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
        create: {
          anonymousSessionId: session.id,
          date: today,
          usedCount: 1,
          lastUsedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        ...response,
        conversationId: conversation.id,
        sessionId: session.id,
      },
      { headers: corsHeaders(req.headers.get("origin")) }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500, headers: corsHeaders(req.headers.get("origin")) }
    );
  }
}
