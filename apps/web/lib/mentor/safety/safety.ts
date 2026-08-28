import { SafetyResult } from "@/lib/mentor/types";
import { prisma } from "@/lib/db/prisma";
import { loadMimoConfig } from "@/lib/mentor/llm/provider";
import { SAFETY_CLASSIFICATION_SYSTEM_PROMPT } from "@/lib/mentor/safety/prompt";

const VALID_RISK_LEVELS = ["normal", "elevated", "crisis"] as const;
type ValidRiskLevel = (typeof VALID_RISK_LEVELS)[number];
const VALID_CATEGORIES = [
  "self_harm",
  "violence",
  "manipulation",
  "emotional_distress",
  "dependency",
  "normal",
] as const;
type ValidCategory = (typeof VALID_CATEGORIES)[number];

// Crisis keywords are intentionally conservative; this rule-based layer is a hard
// fallback when the LLM classifier is unavailable or fails to return valid JSON.
const SELF_HARM_PATTERNS: RegExp[] = [
  /想\s*(?:自杀|自残|自我了断)/,
  /(?:想|要|准备).{0,6}(?:结束|终结|了结)\s*(?:自己\s*)?\s*(?:生命|生命|性命|一生)/,
  /(?:结束|了结|终结)\s*(?:自己\s*)?\s*(?:生命|性命|一生)/,
  /不想\s*(?:再?活|继续\s*活|活\s*下去)/,
  /活着\s*(?:没|没有)\s*(?:意义|意思|价值)/,
  /(?:活着|活)\s*好累\s*(?:不想活|想死|不想活)/,
  /想\s*(?:死|死掉|死去)/,
  /(?:kill|hurt)\s+(?:myself|me)/i,
  /(?:suicide|self.?harm|end\s+my\s+life)/i,
  /(?:don't\s+want\s+to\s+live|no\s+reason\s+to\s+live|better\s+off\s+dead)/i,
];

const VIOLENCE_PATTERNS: RegExp[] = [
  /想\s*(?:杀人|伤害别人|报复|弄死)/,
  /(?:kill|hurt|attack)\s+(?:someone|him|her|them)/i,
];

const MANIPULATION_PATTERNS: RegExp[] = [
  /(?:怎么|如何).{0,5}(?:让|使|逼).{0,10}(?:离不开我|听我的|对我好|加大投资|绑定)/,
  /how\s+(?:can\s+i|to)\s+(?:make|get)\s+.*(?:obsessed|invested|bound|controlled)/i,
];

const ELEVATED_PATTERNS: RegExp[] = [
  /(?:非常|特别|一直|真的).{0,3}(?:痛苦|绝望|崩溃|压抑|窒息|无助|孤单|孤独)/,
  /(?:can't\s+go\s+on|no\s+hope|everything\s+is\s+pointless)/i,
];

export interface SafetyCheckContext {
  userId?: string | null;
  anonymousSessionId?: string | null;
  conversationId?: string | null;
  messageId?: string | null;
}

interface ClassifierOutput {
  riskLevel: string;
  riskCategory: string;
  confidence: number;
  recommendedAction: string;
  crisisResponse?: string | null;
}

async function classifyWithLLM(message: string): Promise<ClassifierOutput | null> {
  const config = loadMimoConfig();
  if (!config) {
    return null;
  }

  const baseUrl = config.baseUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 512,
        temperature: 0.0,
        system: SAFETY_CLASSIFICATION_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Classify the following user message and return only JSON.\n\nUser message: "${message}"`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.warn("Kimi API error:", res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as { content: { type: string; text: string }[] };
    const text = data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("")
      .trim();
    const parsed = parseClassifierResponse(text);
    if (parsed && isValidClassifierOutput(parsed)) {
      return parsed;
    }
    console.warn("Safety classifier returned invalid output:", text);
    return null;
  } catch (err) {
    console.warn("Safety classifier LLM call failed:", err);
    return null;
  }
}

function parseClassifierResponse(text: string): ClassifierOutput | null {
  // Some models wrap JSON in markdown code fences; strip them.
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      riskLevel: String(parsed.riskLevel || "").toLowerCase(),
      riskCategory: String(parsed.riskCategory || "").toLowerCase(),
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      recommendedAction: String(parsed.recommendedAction || "").toLowerCase(),
      crisisResponse:
        parsed.crisisResponse === null || parsed.crisisResponse === undefined
          ? null
          : String(parsed.crisisResponse),
    };
  } catch {
    return null;
  }
}

function isValidClassifierOutput(output: ClassifierOutput): boolean {
  return (
    VALID_RISK_LEVELS.includes(output.riskLevel as ValidRiskLevel) &&
    VALID_CATEGORIES.includes(output.riskCategory as ValidCategory) &&
    output.confidence >= 0 &&
    output.confidence <= 1
  );
}

function runKeywordFallback(message: string): SafetyResult {
  const lower = message.toLowerCase();

  for (const pattern of SELF_HARM_PATTERNS) {
    if (pattern.test(message) || pattern.test(lower)) {
      return {
        riskLevel: "crisis",
        riskCategory: "self_harm",
        confidence: 0.9,
        action: "crisis",
        crisisResponse: getFallbackCrisisResponse("self_harm"),
      };
    }
  }

  for (const pattern of VIOLENCE_PATTERNS) {
    if (pattern.test(message) || pattern.test(lower)) {
      return {
        riskLevel: "crisis",
        riskCategory: "violence",
        confidence: 0.9,
        action: "crisis",
        crisisResponse: getFallbackCrisisResponse("violence"),
      };
    }
  }

  for (const pattern of MANIPULATION_PATTERNS) {
    if (pattern.test(message) || pattern.test(lower)) {
      return {
        riskLevel: "elevated",
        riskCategory: "manipulation",
        confidence: 0.6,
        action: "elevated",
      };
    }
  }

  for (const pattern of ELEVATED_PATTERNS) {
    if (pattern.test(message) || pattern.test(lower)) {
      return {
        riskLevel: "elevated",
        riskCategory: "emotional_distress",
        confidence: 0.6,
        action: "elevated",
      };
    }
  }

  return {
    riskLevel: "normal",
    action: "normal",
  };
}

function getFallbackCrisisResponse(category: string): string {
  switch (category) {
    case "self_harm":
      return "I hear that you're going through something very painful right now. Your safety matters more than anything we're discussing. Please reach out to someone who can be with you right now — a trusted friend, family member, or local emergency service.";
    case "violence":
      return "I'm not able to help with plans to harm someone else. If you're feeling overwhelmed, talking to a trusted person or professional can help.";
    default:
      return "I want to make sure you're safe. If you're in immediate danger, please contact local emergency services or a trusted person near you.";
  }
}

function buildSafetyResult(classification: ClassifierOutput): SafetyResult {
  const riskLevel = classification.riskLevel as "normal" | "elevated" | "crisis";

  if (riskLevel === "crisis" && classification.confidence >= 0.8) {
    return {
      riskLevel: "crisis",
      riskCategory: classification.riskCategory,
      confidence: classification.confidence,
      action: "crisis",
      crisisResponse: classification.crisisResponse || getFallbackCrisisResponse(classification.riskCategory),
    };
  }

  if (riskLevel === "elevated" && classification.confidence >= 0.6) {
    return {
      riskLevel: "elevated",
      riskCategory: classification.riskCategory,
      confidence: classification.confidence,
      action: "elevated",
    };
  }

  return {
    riskLevel: "normal",
    riskCategory: classification.riskCategory === "normal" ? null : classification.riskCategory,
    confidence: classification.confidence,
    action: "normal",
  };
}

export async function detectSafety(
  message: string,
  _context: string,
  context?: SafetyCheckContext
): Promise<SafetyResult> {
  // 1. Fast keyword-first detection (synchronous, deterministic).
  const keywordResult = runKeywordFallback(message);

  // 2. Optional async LLM confirmation for analytics/logging.
  // We do NOT block the response on the LLM classifier in MVP because MiMo
  // sometimes returns truncated JSON and the extra latency hurts UX.
  if (keywordResult.action !== "crisis" && context) {
    classifyWithLLM(message)
      .then((classification) => {
        const llmResult = classification ? buildSafetyResult(classification) : null;
        const result = pickMostRestrictive(llmResult, keywordResult);
        logSafetyCheck({
          userId: context.userId,
          anonymousSessionId: context.anonymousSessionId,
          conversationId: context.conversationId,
          messageId: context.messageId,
          userMessage: message,
          result,
          llmUsed: llmResult !== null,
        }).catch(() => {});
      })
      .catch(() => {});
  }

  // 3. Synchronous logging for crisis/elevated keyword hits.
  const ctx = context || {};
  logSafetyCheck({
    userId: ctx.userId,
    anonymousSessionId: ctx.anonymousSessionId,
    conversationId: ctx.conversationId,
    messageId: ctx.messageId,
    userMessage: message,
    result: keywordResult,
    llmUsed: false,
  }).catch((err) => {
    console.error("Failed to log safety check:", err);
  });

  return keywordResult;
}

function severityRank(riskLevel: string): number {
  if (riskLevel === "crisis") return 2;
  if (riskLevel === "elevated") return 1;
  return 0;
}

function pickMostRestrictive(
  llmResult: SafetyResult | null,
  keywordResult: SafetyResult
): SafetyResult {
  if (!llmResult) return keywordResult;
  if (severityRank(llmResult.riskLevel) >= severityRank(keywordResult.riskLevel)) {
    return llmResult;
  }
  return keywordResult;
}

interface SafetyLogInput {
  userId?: string | null;
  anonymousSessionId?: string | null;
  conversationId?: string | null;
  messageId?: string | null;
  userMessage: string;
  result: SafetyResult;
  llmUsed: boolean;
}

async function logSafetyCheck(input: SafetyLogInput): Promise<void> {
  await prisma.safetyLog.create({
    data: {
      userId: input.userId || null,
      anonymousSessionId: input.anonymousSessionId || null,
      conversationId: input.conversationId || null,
      messageId: input.messageId || null,
      riskLevel: input.result.riskLevel,
      riskCategory: input.result.riskCategory || null,
      confidence: input.result.confidence ?? null,
      userMessage: input.userMessage,
      recommendedAction: input.result.action,
      responseGiven: input.result.crisisResponse || null,
      resources: input.llmUsed ? { classifier: "llm" } : { classifier: "keyword_fallback" },
    },
  });
}
