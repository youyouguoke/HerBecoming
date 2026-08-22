import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(req.headers.get("origin")) });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const decisions = await prisma.decision.findMany({
      where: {
        userId: session.user.id,
        status: status as any,
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ decisions }, { headers: corsHeaders(req.headers.get("origin")) });
  } catch (error) {
    console.error("[journal/decisions GET] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders(req.headers.get("origin")) });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(req.headers.get("origin")) });
    }

    const body = await req.json();
    const {
      title,
      topic,
      context,
      whatIWant,
      whatIFear,
      options,
      tradeoffs,
      currentThinking,
      nextAction,
      reviewDate,
      conversationId,
      messageId,
    } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Missing title" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    const decision = await prisma.decision.create({
      data: {
        userId: session.user.id,
        title,
        topic: topic || null,
        context: context || null,
        whatIWant: whatIWant || null,
        whatIFear: whatIFear || null,
        options: options || null,
        tradeoffs: tradeoffs || null,
        currentThinking: currentThinking || null,
        nextAction: nextAction || null,
        reviewDate: reviewDate ? new Date(reviewDate) : null,
        conversationId: conversationId || null,
        messageId: messageId || null,
      },
    });

    return NextResponse.json({ decision }, { status: 201, headers: corsHeaders(req.headers.get("origin")) });
  } catch (error) {
    console.error("[journal/decisions POST] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders(req.headers.get("origin")) });
  }
}
