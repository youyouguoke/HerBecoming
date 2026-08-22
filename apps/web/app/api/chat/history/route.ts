import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

/**
 * GET /api/chat/history?type=messages|conversations
 *
 * For anonymous users:
 *   ?sessionId=...&conversationId=...&type=messages
 *
 * For logged-in users:
 *   (auth session) ?type=conversations — list user's conversations
 *   (auth session) ?conversationId=...&type=messages — messages for a conversation
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "messages";
    const sessionId = searchParams.get("sessionId");
    const conversationId = searchParams.get("conversationId");

    const authSession = await auth();
    const userId = authSession?.user?.id;

    if (type === "conversations") {
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(req.headers.get("origin")) });
      }

      const conversations = await prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 50,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({ conversations }, { headers: corsHeaders(req.headers.get("origin")) });
    }

    // type === "messages"
    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ messages: [] }, { headers: corsHeaders(req.headers.get("origin")) });
    }

    // Authorization
    if (conversation.userId) {
      if (conversation.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: corsHeaders(req.headers.get("origin")) });
      }
    } else if (conversation.anonymousSessionId) {
      if (!sessionId) {
        return NextResponse.json({ error: "Missing sessionId" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
      }
      const anonSession = await prisma.anonymousSession.findUnique({
        where: { fingerprintId: sessionId },
      });
      if (!anonSession || anonSession.id !== conversation.anonymousSessionId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: corsHeaders(req.headers.get("origin")) });
      }
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        content: true,
        intent: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ messages }, { headers: corsHeaders(req.headers.get("origin")) });
  } catch (error) {
    console.error("[chat/history GET] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders(req.headers.get("origin")) });
  }
}
