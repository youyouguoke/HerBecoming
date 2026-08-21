import { ReasoningPlan, UnderstandingResult, RetrievedKnowledge, Memory } from "@/lib/mentor/types";
import { getLLMProvider } from "@/lib/mentor/llm/provider";
import { buildReasoningPlanPrompt } from "@/lib/mentor/reasoning/prompt";

export interface BuildReasoningInput {
  userMessage: string;
  understanding: UnderstandingResult;
  knowledgeNodes: RetrievedKnowledge[];
  memories: Memory[];
}

/**
 * Build a reasoning plan for v0.1.
 * First attempts to generate it via LLM with structured JSON output.
 * Falls back to a deterministic template if the LLM call fails or returns invalid JSON.
 */
export async function buildReasoningPlan(
  input: BuildReasoningInput
): Promise<ReasoningPlan> {
  // MVP latency optimization: skip the separate LLM reasoning-plan call.
  // MiMo often returns truncated JSON for structured outputs, and the extra
  // call adds ~10-20s of latency. The final mentor LLM still receives
  // understanding, knowledge nodes, and memories, so it can reason inline.
  // To re-enable LLM-generated plans later, restore the block below behind a
  // feature flag or switch to a model with reliable JSON mode.
  return buildDeterministicReasoningPlan(input);
}

function parseReasoningPlanJson(raw: string): ReasoningPlan | null {
  // Extract JSON from potential markdown code fences.
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = jsonMatch ? jsonMatch[1].trim() : raw.trim();

  try {
    const parsed = JSON.parse(candidate);

    const requiredKeys: (keyof ReasoningPlan)[] = [
      "whatIsHappening",
      "whatUserMayBeFeeling",
      "relevantPrinciples",
      "conflictingConsiderations",
      "whatIsUnknown",
      "safestInterpretation",
      "usefulNextStep",
      "questionToContinue",
    ];

    for (const key of requiredKeys) {
      if (!(key in parsed)) {
        return null;
      }
    }

    const stringArrayKeys: (keyof ReasoningPlan)[] = [
      "relevantPrinciples",
      "conflictingConsiderations",
      "whatIsUnknown",
    ];
    for (const key of stringArrayKeys) {
      if (!Array.isArray(parsed[key]) || !parsed[key].every((v: unknown) => typeof v === "string")) {
        return null;
      }
    }

    return parsed as ReasoningPlan;
  } catch {
    return null;
  }
}

function buildDeterministicReasoningPlan(input: BuildReasoningInput): ReasoningPlan {
  const { userMessage, understanding, knowledgeNodes } = input;
  const isZh = understanding.language === "zh";

  // Identify conflict/tension
  const conflicts: string[] = [];
  const lower = userMessage.toLowerCase();
  if (/(?:但|但是|可是|不过|却)/.test(userMessage) || /(?:but|however|yet)/i.test(lower)) {
    conflicts.push(isZh ? "存在内在张力或矛盾" : "internal tension or conflict");
  }
  if (understanding.intent === "decision") {
    conflicts.push(isZh ? "需要权衡不同选择的代价" : "need to weigh costs of different choices");
  }
  if (understanding.emotionalState !== "neutral") {
    conflicts.push(
      isZh
        ? `情绪状态（${understanding.emotionalState}）可能影响判断`
        : `emotional state (${understanding.emotionalState}) may affect judgment`
    );
  }

  // Extract principle IDs as reasoning anchors
  const principles = knowledgeNodes
    .filter((k) => k.knowledgeType === "principle" || k.knowledgeType === "framework")
    .slice(0, 3)
    .map((k) => k.title);

  // Unknowns
  const unknowns: string[] = [];
  if (understanding.intent === "decision") {
    unknowns.push(isZh ? "用户最看重什么价值" : "what the user values most");
    unknowns.push(isZh ? "各选项的真实代价" : "the real costs of each option");
  }
  if (understanding.emotionalState !== "neutral") {
    unknowns.push(isZh ? "情绪背后的事实是什么" : "what facts are behind the emotion");
  }

  const safestInterpretation = isZh
    ? `用户当前不是在寻找一个标准答案，而是需要更清楚地理解${understanding.primaryDomain === "RELATIONSHIPS" ? "关系中的真实张力" : understanding.primaryDomain === "CAREER" ? "职业选择背后的价值排序" : "自己内心的需求与限制"}。`
    : `The user is not looking for a single correct answer right now, but needs to understand ${understanding.primaryDomain === "RELATIONSHIPS" ? "the real tension in the relationship" : understanding.primaryDomain === "CAREER" ? "the values behind the career choice" : "her own needs and constraints"} more clearly.`;

  const usefulNextStep = isZh
    ? "先不急于做决定，而是把问题拆成事实、感受、选择三个部分，再分别看哪些部分可控。"
    : "Don't rush to a decision. Separate facts, feelings, and choices, then see which parts you can actually influence.";

  const questionToContinue = isZh
    ? "如果暂时不考虑别人的期待，你自己真正想要的结果是什么？"
    : "If you set aside other people's expectations for a moment, what result do you actually want?";

  return {
    whatIsHappening: understanding.summary,
    whatUserMayBeFeeling:
      understanding.emotionalState === "neutral"
        ? isZh
          ? "情绪相对稳定，可能更关注判断和选择。"
          : "Emotionally stable; focused more on judgment and choice."
        : isZh
        ? `用户可能感到${understanding.emotionalState}。`
        : `The user may be feeling ${understanding.emotionalState}.`,
    relevantPrinciples: principles,
    conflictingConsiderations: conflicts,
    whatIsUnknown: unknowns,
    safestInterpretation,
    usefulNextStep,
    questionToContinue,
  };
}
