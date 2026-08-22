import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders(req.headers.get("origin")) });
    }

    const body = await req.json();
    const { messageId, helpful, comment } = body;

    if (!messageId || typeof messageId !== "string") {
      return NextResponse.json({ error: "Missing messageId" }, { status: 400, headers: corsHeaders(req.headers.get("origin")) });
    }

    // Verify the message exists and the user owns its conversation
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404, headers: corsHeaders(req.headers.get("origin")) });
    }

    if (message.conversation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: corsHeaders(req.headers.get("origin")) });
    }

    const feedback = await prisma.feedback.upsert({
      where: { messageId },
      create: {
        userId: session.user.id,
        messageId,
        conversationId: message.conversationId,
        helpful: typeof helpful === "boolean" ? helpful : null,
        comment: comment || null,
      },
      update: {
        helpful: typeof helpful === "boolean" ? helpful : undefined,
        comment: comment || null,
      },
    });

    return NextResponse.json({ feedback }, { status: 201, headers: corsHeaders(req.headers.get("origin")) });
  } catch (error) {
    console.error("[chat/feedback POST] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders(req.headers.get("origin")) });
  }
}
