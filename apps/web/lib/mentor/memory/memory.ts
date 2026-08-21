import { prisma } from "@/lib/db/prisma";
import { Memory } from "@prisma/client";

export interface MemoryRetrievalInput {
  userId?: string | null;
  anonymousSessionId?: string | null;
  userMessage: string;
  primaryDomain: string;
  topK?: number;
}

/**
 * MVP memory retrieval.
 * In production this should use vector similarity on memory embeddings.
 * v0.1 uses keyword + domain + recency heuristics.
 */
export async function retrieveMemories(
  input: MemoryRetrievalInput
): Promise<Memory[]> {
  const { userId, userMessage, primaryDomain, topK = 3 } = input;

  // MVP: memories are only persisted for logged-in users.
  if (!userId) {
    return [];
  }

  const keywords = userMessage
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 || /[\u4e00-\u9fa5]{2,}/.test(w));

  const memories = await prisma.memory.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  const scored = memories
    .map((memory) => {
      const content = memory.content.toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (content.includes(kw)) score += 1;
        if (memory.type.toLowerCase().includes(kw)) score += 0.5;
      }
      if (content.includes(primaryDomain.toLowerCase())) score += 0.5;
      const daysAgo =
        (Date.now() - new Date(memory.updatedAt || memory.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      score += Math.max(0, 1 - daysAgo / 30);
      return { memory, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.memory);

  return scored;
}

/**
 * Async memory extraction candidate.
 * Returns a candidate memory string or null.
 */
export function extractMemoryCandidate(
  userMessage: string,
  assistantMessage: string
): string | null {
  const combined = `${userMessage} ${assistantMessage}`.toLowerCase();

  const stableSignals = [
    /我.{0,5}(?:其实|真正|一直|更|最).{0,10}(?:想要|看重|重视|在意|希望|觉得|认为)/,
    /(?:发现自己|意识到自己|认识到|我明白).{0,15}(?:很|非常|更|最|其实)/,
    /(?:我.{0,5}决定|我选择|我打算|我想.{0,5}做)/,
    /i\s+(?:realize|want|value|care|prefer|decide|choose|plan).{0,30}(?:most|really|actually|more)/i,
    /(?:i\s+want|i\s+value|i\s+decided|i\s+realized)/i,
  ];

  for (const pattern of stableSignals) {
    if (pattern.test(combined)) {
      const match = userMessage.match(
        /(?:我.{0,8}(?:其实|真正|一直|更|最).{0,20}(?:想要|看重|重视|在意|希望|觉得|认为).{0,40})/
      );
      return match ? match[0].trim() : userMessage.slice(0, 80);
    }
  }

  return null;
}
