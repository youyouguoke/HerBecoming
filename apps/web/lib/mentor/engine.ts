import { prisma } from "@/lib/db/prisma";
import { detectSafety } from "@/lib/mentor/safety/safety";
import { understandInput } from "@/lib/mentor/understanding/understanding";
import { retrieveKnowledge } from "@/lib/mentor/knowledge/knowledge";
import { retrieveMemories, extractMemoryCandidate } from "@/lib/mentor/memory/memory";
import { buildReasoningPlan } from "@/lib/mentor/reasoning/reasoning";
import { getLLMProvider } from "@/lib/mentor/llm/provider";
import {
  MentorContext,
  ChatResponse,
  ChatRequest,
  SafetyResult,
  UnderstandingResult,
  ReasoningPlan,
  RetrievedKnowledge,
} from "@/lib/mentor/types";

const llm = getLLMProvider();

export interface ChatEngineInput {
  conversationId: string;
  userId?: string | null;
  anonymousSessionId?: string | null;
  userMessage: string;
}

export async function runMentorEngine(input: ChatEngineInput): Promise<{
  response: ChatResponse;
  mentorContext: MentorContext;
}> {
  const { conversationId, userId, anonymousSessionId, userMessage } = input;

  // 1. Load recent conversation history
  const recentMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const history = recentMessages.map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  // 2. Safety Detection
  const safety = await detectSafety(
    userMessage,
    history.slice(-3).map((h) => h.content).join("\n"),
    { anonymousSessionId, conversationId }
  );

  if (safety.action === "crisis") {
    const crisisResponse = safety.crisisResponse ??
      "I'm really sorry you're feeling this way. Please reach out to someone you trust or a local crisis resource right now.";
    const response: ChatResponse = {
      answer: crisisResponse,
      knowledgeNodesUsed: [],
      memoriesUsed: [],
      intent: "crisis",
      safetyStatus: "crisis",
      suggestedAction: null,
      assistantMessageId: "",
    };
    return {
      response,
      mentorContext: buildContext(
        input,
        safety,
        {} as UnderstandingResult,
        [],
        [],
        {} as ReasoningPlan,
        history
      ),
    };
  }

  // 3. Understanding Layer
  const understanding = await understandInput(userMessage, history);

  // 4. Memory Retrieval
  const memories = await retrieveMemories({
    userId,
    anonymousSessionId,
    userMessage,
    primaryDomain: understanding.primaryDomain,
  });

  // 5. Knowledge Retrieval + Graph
  const knowledgeNodes = await retrieveKnowledge({
    userMessage,
    primaryDomain: understanding.primaryDomain,
    secondaryDomains: understanding.secondaryDomains,
  });

  // 6. Reasoning Engine
  const reasoningPlan = await buildReasoningPlan({
    userMessage,
    understanding,
    knowledgeNodes,
    memories,
  });

  // 7. Build Mentor Context
  const mentorContext = buildContext(
    input,
    safety,
    understanding,
    memories,
    knowledgeNodes,
    reasoningPlan,
    history
  );

  // 8. LLM Generation
  let answer: string;
  try {
    answer = await llm.generateMentorResponse(mentorContext);
  } catch (err) {
    console.error("LLM generation failed:", err);
    // Fallback to mock provider if MiMo fails
    answer = await new (await import("@/lib/mentor/llm/provider")).MockLLMProvider().generateMentorResponse(mentorContext);
  }

  // 9. Output Safety (lightweight MVP check)
  const outputSafety = await detectSafety(
    answer,
    userMessage,
    { anonymousSessionId, conversationId }
  );
  if (outputSafety.action === "crisis") {
    answer = "I want to make sure you're safe. If you're in immediate danger, please contact local emergency services or a trusted person near you.";
  }

  // 10. Async memory extraction candidate (not persisted yet in v0.1 unless high confidence)
  const memoryCandidate = extractMemoryCandidate(userMessage, answer);

  const response: ChatResponse = {
    answer,
    knowledgeNodesUsed: knowledgeNodes.map((k) => k.id),
    memoriesUsed: memories.map((m) => m.id),
    intent: understanding.intent,
    safetyStatus: safety.riskLevel,
    suggestedAction:
      understanding.intent === "decision" && understanding.decisionStage === "pre_decision"
        ? "save_decision"
        : null,
    assistantMessageId: "", // filled by caller after DB save
  };

  return { response, mentorContext };
}

function buildContext(
  input: ChatEngineInput,
  safety: SafetyResult,
  understanding: UnderstandingResult,
  memories: { id: string; content: string }[],
  knowledgeNodes: RetrievedKnowledge[],
  reasoningPlan: ReasoningPlan,
  history: { role: "user" | "assistant"; content: string }[]
): MentorContext {
  return {
    userId: input.userId,
    anonymousSessionId: input.anonymousSessionId,
    conversationId: input.conversationId,
    messageId: "",
    userMessage: input.userMessage,
    conversationHistory: history,
    understanding,
    safety,
    memories: memories as any,
    knowledgeNodes,
    reasoningPlan,
  };
}
