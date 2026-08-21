import { prisma } from "@/lib/db/prisma";
import { KnowledgeNode, RetrievedKnowledge } from "@/lib/mentor/types";

export interface KnowledgeRetrievalInput {
  userMessage: string;
  primaryDomain: string;
  secondaryDomains: string[];
  topK?: number;
}

/**
 * MVP knowledge retrieval.
 *
 * 1. Filter by domain/topic metadata.
 * 2. Expand via knowledge_relations (graph neighbors up to depth 2).
 * 3. Exclude DO_NOT_GENERATE nodes from generation context (they can still be
 *    used for risk recognition).
 * 4. Return ranked list with relation depth.
 */
export async function retrieveKnowledge(
  input: KnowledgeRetrievalInput
): Promise<RetrievedKnowledge[]> {
  const { userMessage, primaryDomain, secondaryDomains, topK = 8 } = input;
  const domains = [primaryDomain, ...secondaryDomains];

  // 1. Direct domain match
  const directNodes = await prisma.knowledgeNode.findMany({
    where: {
      domain: { in: domains as any },
      safetyClass: { not: "DO_NOT_GENERATE" },
    },
    orderBy: { retrievalCount: "desc" },
    take: 40,
  });

  // 2. Simple keyword boost (MVP fallback for hybrid search)
  const keywords = extractKeywords(userMessage);
  const scoredDirect = directNodes.map((node) => {
    const keywordScore = keywords.some((kw) =>
      `${node.title} ${node.coreIdea} ${node.category}`.toLowerCase().includes(kw)
    )
      ? 0.3
      : 0;
    const domainScore = node.domain === primaryDomain ? 0.5 : 0.2;
    return { node, score: domainScore + keywordScore, depth: 0 };
  });

  // 3. Graph expansion
  const directIds = new Set(scoredDirect.map((s) => s.node.id));
  const expanded = await expandGraph([...directIds]);

  // 4. Merge and rerank
  const map = new Map<string, RetrievedKnowledge>();
  for (const { node, score, depth } of scoredDirect) {
    map.set(node.id, { ...node, score, relationDepth: depth });
  }
  for (const item of expanded) {
    const existing = map.get(item.id);
    if (existing) {
      existing.score += item.score * 0.25; // small boost for graph relation
      existing.relationDepth = Math.min(existing.relationDepth, item.relationDepth);
    } else if (!map.has(item.id) && map.size < topK + 6) {
      map.set(item.id, item);
    }
  }

  const result = Array.from(map.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Update retrieval stats
  if (result.length > 0) {
    await prisma.knowledgeNode.updateMany({
      where: { id: { in: result.map((r) => r.id) } },
      data: {
        retrievalCount: { increment: 1 },
        lastRetrievedAt: new Date(),
      },
    });
  }

  return result;
}

async function expandGraph(
  sourceIds: string[],
  depth = 1,
  maxDepth = 2
): Promise<RetrievedKnowledge[]> {
  if (depth > maxDepth || sourceIds.length === 0) return [];

  const relations = await prisma.knowledgeRelation.findMany({
    where: {
      sourceNodeId: { in: sourceIds },
      relationType: { in: ["SUPPORTS", "RELATED", "APPLIES_TO", "REFRAMES", "CONTRASTS"] },
    },
    include: { targetNode: true },
    take: 60,
  });

  const targetIds = relations.map((r) => r.targetNodeId);
  const nextExpanded = await expandGraph(targetIds, depth + 1, maxDepth);

  const result: RetrievedKnowledge[] = relations
    .filter((r) => r.targetNode.safetyClass !== "DO_NOT_GENERATE")
    .map((r) => ({
      ...r.targetNode,
      score: r.relationType === "CONTRASTS" ? 0.4 : 0.5,
      relationDepth: depth,
    }));

  return [...result, ...nextExpanded];
}

function extractKeywords(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 || /[\u4e00-\u9fa5]{2,}/.test(w));

  // Add compound Chinese keywords
  const compounds: string[] = [];
  for (let i = 0; i < normalized.length - 1; i++) {
    const char = normalized[i];
    if (/[\u4e00-\u9fa5]/.test(char)) {
      compounds.push(char + normalized[i + 1]);
    }
  }

  return [...new Set([...normalized, ...compounds])];
}
