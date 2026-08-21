import { UnderstandingResult } from "@/lib/mentor/types";
import { getLLMProvider } from "@/lib/mentor/llm/provider";

export interface MemoryExtractionInput {
  userMessage: string;
  assistantMessage: string;
  understanding: UnderstandingResult;
}

export interface MemoryExtractionOutput {
  shouldSave: boolean;
  type: "TOPIC" | "GOAL" | "DECISION" | "INSIGHT" | "VALUE" | "PATTERN" | "PREFERENCE";
  content: string;
  confidence: number;
}

const OPT_OUT_PATTERNS = [
  /不要记住/,
  /别记住/,
  /forget\s+this/i,
  /don't\s+remember\s+this/i,
  /do\s+not\s+save\s+this/i,
];

export function userRequestedOptOut(userMessage: string): boolean {
  return OPT_OUT_PATTERNS.some((p) => p.test(userMessage));
}

function buildMemoryExtractionPrompt(input: MemoryExtractionInput): string {
  const { userMessage, assistantMessage, understanding } = input;
  const isZh = understanding.language === "zh";

  const userContext = isZh
    ? `用户信息：
- 用户消息：${userMessage}
-  assistant回复：${assistantMessage}
- 语言：zh
- 意图：${understanding.intent}
- 主要领域：${understanding.primaryDomain}
- 情绪状态：${understanding.emotionalState}`
    : `User context:
- User message: ${userMessage}
- Assistant response: ${assistantMessage}
- Language: en
- Intent: ${understanding.intent}
- Primary domain: ${understanding.primaryDomain}
- Emotional state: ${understanding.emotionalState}`;

  const instructions = isZh
    ? `你是一位 AI 记忆筛选器。请判断：上面这段对话中，是否包含用户明确表达的、对未来交流有长期价值的稳定信息。

只保存以下类型的信息：
- VALUE：用户明确表达的核心价值观（如"我更看重自主性"）
- GOAL：用户表达的长期目标（如"我想转行做产品"）
- DECISION：用户做出的重要决定（如"我决定先不辞职"）
- INSIGHT：用户对自我的重要发现（如"我发现自己很害怕让别人失望"）
- PATTERN：用户注意到的重复行为模式（如"我总是先答应别人，再后悔"）
- PREFERENCE：用户明确的偏好（如"我更喜欢一对一深入交流"）

规则：
1. 如果只是短暂情绪或一次性抱怨，不要保存。
2. 如果用户说"不要记住"、"forget this"，则 shouldSave 为 false。
3. content 必须是用户亲口表达或明确认同的内容，不要编造。
4. content 用用户的主要语言，简洁（1-2句话）。

请返回严格 JSON：
{
  "shouldSave": boolean,
  "type": "VALUE | GOAL | DECISION | INSIGHT | PATTERN | PREFERENCE",
  "content": "string",
  "confidence": 0.0-1.0
}`
    : `You are a memory filter for an AI mentor. Decide whether the conversation contains an explicit, stable, long-term-relevant piece of information about the user.

Only save these types:
- VALUE: core values the user expresses (e.g. "I value autonomy most")
- GOAL: long-term goals (e.g. "I want to switch to product management")
- DECISION: important decisions made (e.g. "I decided not to quit yet")
- INSIGHT: important self-discoveries (e.g. "I realize I'm afraid of disappointing people")
- PATTERN: recurring behavior patterns (e.g. "I always say yes first and regret it later")
- PREFERENCE: clear preferences (e.g. "I prefer one-on-one deep conversations")

Rules:
1. Do not save transient emotions or one-off complaints.
2. If the user says "forget this" or "don't remember this", set shouldSave to false.
3. content must be something the user explicitly said or clearly agreed with. Do not invent.
4. content should be in the user's main language, concise (1-2 sentences).

Return strictly JSON:
{
  "shouldSave": boolean,
  "type": "VALUE | GOAL | DECISION | INSIGHT | PATTERN | PREFERENCE",
  "content": "string",
  "confidence": 0.0-1.0
}`;

  return `${userContext}\n\n${instructions}`;
}

function parseMemoryExtractionOutput(raw: string): MemoryExtractionOutput | null {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    const validTypes = ["TOPIC", "GOAL", "DECISION", "INSIGHT", "VALUE", "PATTERN", "PREFERENCE"];
    const type = String(parsed.type || "").toUpperCase();

    if (!validTypes.includes(type)) {
      return null;
    }

    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0;
    const shouldSave = Boolean(parsed.shouldSave) && confidence >= 0.7;

    return {
      shouldSave,
      type: type as MemoryExtractionOutput["type"],
      content: String(parsed.content || "").trim(),
      confidence,
    };
  } catch {
    return null;
  }
}

export async function extractMemoryWithLLM(
  input: MemoryExtractionInput
): Promise<MemoryExtractionOutput | null> {
  if (userRequestedOptOut(input.userMessage)) {
    return null;
  }

  try {
    const provider = getLLMProvider();
    const prompt = buildMemoryExtractionPrompt(input);
    const raw = await provider.generateRawText(prompt, 512);
    const parsed = parseMemoryExtractionOutput(raw);

    if (!parsed || !parsed.shouldSave || parsed.content.length < 5) {
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn("[MemoryExtraction] LLM extraction failed:", err);
    return null;
  }
}
