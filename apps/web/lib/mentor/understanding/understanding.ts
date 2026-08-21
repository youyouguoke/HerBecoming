import { UnderstandingResult } from "@/lib/mentor/types";

// Minimal deterministic understanding for v0.1.
// In production this should be an LLM call with structured output.
export async function understandInput(
  message: string,
  _history: { role: "user" | "assistant"; content: string }[]
): Promise<UnderstandingResult> {
  const hasZh = /[\u4e00-\u9fa5]/.test(message);
  const lang: "zh" | "en" = hasZh ? "zh" : "en";
  const lower = message.toLowerCase();

  // --- Intent ---
  let intent = "general_conversation";
  if (/(?:要不要|是否|应该|该|选|决定|抉择|辞职|分手|结婚|搬家|换工作)/.test(message) ||
      /(?:should\s+i|whether|decide|choose|quit|break\s+up|move|marry|job\s+offer)/i.test(message)) {
    intent = "decision";
  } else if (/(?:害怕|担心|焦虑|迷茫|不确定|压力|崩溃|难过|委屈)/.test(message) ||
             /(?:scared|worried|anxious|lost|uncertain|stressed|sad|overwhelmed)/i.test(lower)) {
    intent = "emotional_support";
  } else if (/(?:想明白|反思|为什么我总|发现自己|意识到|顿悟)/.test(message) ||
             /(?:reflect|realize|understand\s+myself|why\s+do\s+i)/i.test(lower)) {
    intent = "reflection";
  } else if (/(?:想实现|目标|计划|成为|提升|学习|成长)/.test(message) ||
             /(?:goal|plan|want\s+to\s+become|grow|improve)/i.test(lower)) {
    intent = "goal";
  }

  // --- Domains ---
  const domains: { primary: string; secondary: string[] } = { primary: "LIFE_DECISIONS", secondary: [] };

  const relationshipSignals = /(?:男朋友|女朋友|伴侣|老公|老婆|分手|结婚|恋爱|关系|他|她)/.test(message) ||
                              /(?:boyfriend|girlfriend|partner|husband|wife|breakup|marriage|relationship|him|her)/i.test(lower);
  const careerSignals = /(?:工作|职业|辞职|升职|老板|公司|事业|赚钱|同事|面试|offer)/.test(message) ||
                        /(?:job|career|quit|promotion|boss|company|work|salary|interview|offer)/i.test(lower);
  const selfSignals = /(?:自我|自信|价值|情绪|内耗|焦虑|迷茫|害怕|讨好)/.test(message) ||
                      /(?:self.?worth|confidence|emotion|anxiety|lost|people.?pleasing)/i.test(lower);

  if (relationshipSignals && careerSignals && selfSignals) {
    domains.primary = "RELATIONSHIPS";
    domains.secondary = ["CAREER", "SELF", "LIFE_DECISIONS"];
  } else if (relationshipSignals && careerSignals) {
    domains.primary = "RELATIONSHIPS";
    domains.secondary = ["CAREER", "LIFE_DECISIONS"];
  } else if (relationshipSignals && selfSignals) {
    domains.primary = "RELATIONSHIPS";
    domains.secondary = ["SELF", "LIFE_DECISIONS"];
  } else if (careerSignals && selfSignals) {
    domains.primary = "CAREER";
    domains.secondary = ["SELF", "LIFE_DECISIONS"];
  } else if (relationshipSignals) {
    domains.primary = "RELATIONSHIPS";
    domains.secondary = ["SELF", "LIFE_DECISIONS"];
  } else if (careerSignals) {
    domains.primary = "CAREER";
    domains.secondary = ["LIFE_DECISIONS", "SELF"];
  } else if (selfSignals) {
    domains.primary = "SELF";
    domains.secondary = ["LIFE_DECISIONS"];
  }

  // --- Emotional state ---
  let emotionalState = "neutral";
  if (/(?:害怕|担心|焦虑|迷茫|不确定)/.test(message) || /(?:anxious|worried|scared|uncertain|lost)/i.test(lower)) {
    emotionalState = "anxious_uncertain";
  } else if (/(?:难过|委屈|痛苦|失望|伤心|孤独)/.test(message) || /(?:sad|hurt|disappointed|lonely)/i.test(lower)) {
    emotionalState = "sad_hurt";
  } else if (/(?:生气|愤怒|不爽|烦)/.test(message) || /(?:angry|frustrated|annoyed)/i.test(lower)) {
    emotionalState = "frustrated";
  }

  // --- Decision stage ---
  let decisionStage = "not_decision";
  if (intent === "decision") {
    if (/(?:要不要|是否|该|应该|怎么选)/.test(message) || /(?:should\s+i|which\s+one|how\s+to\s+choose)/i.test(lower)) {
      decisionStage = "pre_decision";
    } else {
      decisionStage = "weighing_options";
    }
  } else if (intent === "reflection") {
    decisionStage = "reflection";
  }

  // --- Summary ---
  const summary = lang === "zh"
    ? `用户在${domains.primary === "RELATIONSHIPS" ? "关系" : domains.primary === "CAREER" ? "职业" : "自我与人生"}领域表达了${intent === "decision" ? "决策困境" : intent === "emotional_support" ? "情绪压力" : "探索性思考"}。`
    : `The user is expressing a ${intent === "decision" ? "decision dilemma" : intent === "emotional_support" ? "emotional stress" : "exploratory thought"} in the ${domains.primary.toLowerCase()} domain.`;

  return {
    language: lang,
    intent,
    primaryDomain: domains.primary,
    secondaryDomains: domains.secondary,
    emotionalState,
    decisionStage,
    summary,
  };
}
