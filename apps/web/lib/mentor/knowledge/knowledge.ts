import { prisma } from "@/lib/db/prisma";
import { KnowledgeNode, RetrievedKnowledge } from "@/lib/mentor/types";
import {
  EmbeddingProvider,
  getEmbeddingProvider,
} from "@/lib/mentor/llm/embeddings";

export interface KnowledgeRetrievalInput {
  userMessage: string;
  primaryDomain: string;
  secondaryDomains: string[];
  topK?: number;
}

export interface VectorRetrievalInput {
  userMessage: string;
  domains: string[];
  topK?: number;
  provider?: EmbeddingProvider;
}

/**
 * MVP knowledge retrieval.
 *
 * 1. Try vector search via pgvector when a non-fallback embedding provider is
 *    available and the table already has vectors.
 * 2. Fall back to keyword/graph retrieval when no vector provider is healthy.
 * 3. Expand via knowledge_relations (graph neighbors up to depth 2).
 * 4. Exclude DO_NOT_GENERATE nodes from generation context (they can still be
 *    used for risk recognition).
 * 5. Return ranked list with relation depth.
 */
export async function retrieveKnowledge(
  input: KnowledgeRetrievalInput
): Promise<RetrievedKnowledge[]> {
  const { userMessage, primaryDomain, secondaryDomains, topK = 8 } = input;
  const domains = [primaryDomain, ...secondaryDomains];

  const provider = getEmbeddingProvider();
  const useVectorSearch = provider.name !== "keyword-fallback";

  if (useVectorSearch) {
    try {
      return await retrieveKnowledgeByVector(userMessage, domains, topK, provider);
    } catch (err) {
      console.warn(
        "[retrieveKnowledge] Vector retrieval failed, falling back to keyword retrieval:",
        err
      );
    }
  }

  return retrieveKnowledgeByKeyword(userMessage, domains, topK, primaryDomain);
}

/**
 * Keyword + graph fallback retrieval.
 */
export async function retrieveKnowledgeByKeyword(
  userMessage: string,
  domains: string[],
  topK: number,
  primaryDomain?: string
): Promise<RetrievedKnowledge[]> {
  // 1. Direct domain match
  const directNodes = await prisma.knowledgeNode.findMany({
    where: {
      domain: { in: domains as any },
      safetyClass: { not: "DO_NOT_GENERATE" },
    },
    orderBy: { retrievalCount: "desc" },
    take: 40,
  });

  // 2. Simple keyword boost
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
  const directIds = scoredDirect.map((s) => s.node.id);
  const expanded = await expandGraph(directIds);

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
  await bumpRetrievalStats(result);

  return result;
}

/**
 * Vector retrieval using raw pgvector SQL.
 *
 * Converts the user message to an embedding, then queries the
 * knowledge_embeddings table for nearest neighbours restricted to the
 * requested domains. Results are merged with graph expansion and reranked.
 */
export async function retrieveKnowledgeByVector(
  userMessage: string,
  domains: string[],
  topK = 8,
  provider: EmbeddingProvider = getEmbeddingProvider()
): Promise<RetrievedKnowledge[]> {
  const embedding = await provider.embed(userMessage);
  const vectorLiteral = `[${embedding.join(", ")}]`;

  // Use L2 distance via pgvector. Filter by domain and exclude blocked nodes.
  const rawNodes = await prisma.$queryRawUnsafe<
    Array<{
      id: string;
      domain: string;
      category: string;
      title: string;
      title_en: string | null;
      core_idea: string;
      core_idea_en: string | null;
      mentor_interpretation: string | null;
      mentor_interpretation_en: string | null;
      counterpoints: string[];
      application_contexts: string[];
      reflection_questions: string[];
      examples: string[];
      knowledge_type: string;
      safety_class: string;
      evidence_level: string;
      source_reference: string | null;
      source_type: string | null;
      retrieval_count: number;
      last_retrieved_at: Date | null;
      created_at: Date;
      updated_at: Date;
      distance: number;
    }>
  >(
    `
    SELECT
      kn.id,
      kn.domain,
      kn.category,
      kn.title,
      kn.title_en,
      kn.core_idea,
      kn.core_idea_en,
      kn.mentor_interpretation,
      kn.mentor_interpretation_en,
      kn.counterpoints,
      kn.application_contexts,
      kn.reflection_questions,
      kn.examples,
      kn.knowledge_type,
      kn.safety_class,
      kn.evidence_level,
      kn.source_reference,
      kn.source_type,
      kn.retrieval_count,
      kn.last_retrieved_at,
      kn.created_at,
      kn.updated_at,
      ke.embedding <-> $1::vector AS distance
    FROM knowledge_embeddings ke
    JOIN knowledge_nodes kn ON kn.id = ke.knowledge_node_id
    WHERE kn.domain::text = ANY($2::text[])
      AND kn.safety_class <> 'DO_NOT_GENERATE'
    ORDER BY distance ASC
    LIMIT $3
    `,
    vectorLiteral,
    domains,
    topK * 2
  );

  const vectorResults: RetrievedKnowledge[] = rawNodes.map((n) => ({
    id: n.id,
    domain: n.domain as any,
    category: n.category,
    title: n.title,
    titleEn: n.title_en,
    coreIdea: n.core_idea,
    coreIdeaEn: n.core_idea_en,
    mentorInterpretation: n.mentor_interpretation,
    mentorInterpretationEn: n.mentor_interpretation_en,
    counterpoints: n.counterpoints,
    applicationContexts: n.application_contexts,
    reflectionQuestions: n.reflection_questions,
    examples: n.examples,
    knowledgeType: n.knowledge_type as any,
    safetyClass: n.safety_class as any,
    evidenceLevel: n.evidence_level as any,
    sourceReference: n.source_reference,
    sourceType: n.source_type,
    retrievalCount: n.retrieval_count,
    lastRetrievedAt: n.last_retrieved_at,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
    score: 1 - Math.min(n.distance, 1), // convert L2 distance to a [0, 1] score
    relationDepth: 0,
  }));

  // Graph expansion starting from vector results
  const sourceIds = vectorResults.map((r) => r.id);
  const expanded = await expandGraph(sourceIds);

  const map = new Map<string, RetrievedKnowledge>();
  for (const item of vectorResults) {
    map.set(item.id, item);
  }
  for (const item of expanded) {
    const existing = map.get(item.id);
    if (existing) {
      existing.score += item.score * 0.25;
      existing.relationDepth = Math.min(existing.relationDepth, item.relationDepth);
    } else if (!map.has(item.id) && map.size < topK + 6) {
      map.set(item.id, item);
    }
  }

  const result = Array.from(map.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  await bumpRetrievalStats(result);

  return result;
}

async function bumpRetrievalStats(result: RetrievedKnowledge[]): Promise<void> {
  if (result.length === 0) return;

  await prisma.knowledgeNode.updateMany({
    where: { id: { in: result.map((r) => r.id) } },
    data: {
      retrievalCount: { increment: 1 },
      lastRetrievedAt: new Date(),
    },
  });
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

  const unique = new Set<string>([...normalized, ...compounds]);
  return Array.from(unique);
}
