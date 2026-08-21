import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const conversationId = searchParams.get("conversationId");

    if (!sessionId || !conversationId) {
      return NextResponse.json(
        { error: "Missing sessionId or conversationId" },
        { status: 400, headers: corsHeaders(req.headers.get("origin")) }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        content: true,
        intent: true,
        primaryDomain: true,
        domains: true,
        riskLevel: true,
        retrievedKnowledgeIds: true,
        memoryIds: true,
        createdAt: true,
      },
    });

    const formatted = messages.map((m) => ({
      id: m.id,
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
      intent: m.intent || undefined,
      primaryDomain: m.primaryDomain || null,
      domains: m.domains || [],
      riskLevel: m.riskLevel || undefined,
      retrievedKnowledgeIds: m.retrievedKnowledgeIds || [],
      memoryIds: m.memoryIds || [],
      createdAt: m.createdAt ? m.createdAt.toISOString() : undefined,
    }));

    return NextResponse.json(
      { messages: formatted },
      { headers: corsHeaders(req.headers.get("origin")) }
    );
  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500, headers: corsHeaders(req.headers.get("origin")) }
    );
  }
}
