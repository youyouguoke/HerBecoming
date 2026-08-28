import { MentorContext, ChatResponse, ReasoningPlan } from "@/lib/mentor/types";
import * as fs from "fs";

export interface LLMProvider {
  generateMentorResponse(ctx: MentorContext): Promise<string>;
  generateRawText(prompt: string, maxTokens?: number): Promise<string>;
}

export function loadKimiConfig(): { baseUrl: string; apiKey: string; model: string } | null {
  try {
    const raw = fs.readFileSync("/root/.openclaw/openclaw.json", "utf8");
    const config = JSON.parse(raw);
    const kimi = config.models?.providers?.kimicode;
    if (kimi?.baseUrl && kimi?.apiKey && kimi?.models?.length) {
      return {
        baseUrl: kimi.baseUrl,
        apiKey: kimi.apiKey,
        model: process.env.KIMI_MODEL || kimi.models[0].id,
      };
    }
  } catch (err) {
    console.warn("Failed to load Kimi config from openclaw.json:", err);
  }
  return null;
}

// Kept for backward compatibility; points to Kimi now.
export function loadMimoConfig(): { baseUrl: string; apiKey: string; model: string } | null {
  return loadKimiConfig();
}

class KimiProvider implements LLMProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor(baseUrl: string, apiKey: string, model: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateMentorResponse(ctx: MentorContext): Promise<string> {
    const messages = buildOpenAIMessages(ctx);
    return this.callMessages(messages, 1024, "");
  }

  async generateRawText(prompt: string, maxTokens = 1024): Promise<string> {
    return this.callMessages(
      [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      maxTokens,
      prompt
    );
  }

  private async callMessages(
    messages: { role: "system" | "user"; content: string }[],
    maxTokens: number,
    fallbackPrompt: string
  ): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          temperature: 0.7,
          system: messages[0].content,
          messages: messages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Kimi API error: ${res.status} ${text}`);
      }

      const data = (await res.json()) as { content: { type: string; text: string }[] };
      const text = extractTextFromKimiResponse(data);
      return text;
    } catch (err) {
      console.warn("Kimi API call failed, falling back to mock provider:", err);
      return new MockLLMProvider().generateRawText(fallbackPrompt || "Language: en\n", maxTokens);
    }
  }
}

export class MockLLMProvider implements LLMProvider {
  async generateMentorResponse(ctx: MentorContext): Promise<string> {
    const { userMessage, understanding, memories, knowledgeNodes, reasoningPlan } = ctx;
    const isZh = understanding.language === "zh";

    const principles = knowledgeNodes
      .filter((k) => k.safetyClass !== "DO_NOT_GENERATE")
      .slice(0, 4)
      .map((k) => `${k.title}: ${k.coreIdea}`);

    const memoryNotes = memories.slice(0, 2).map((m) => m.content);

    const opening = isZh
      ? `你提到"${userMessage.slice(0, 20)}"，我想先理解一下：${reasoningPlan.whatIsHappening}`
      : `You mentioned "${userMessage.slice(0, 30)}". I want to first understand: ${reasoningPlan.whatIsHappening}`;

    const perspective = isZh
      ? `\n\n这里有几个角度可能值得考虑：\n${principles.map((p, i) => `${i + 1}. ${p}`).join("\n")}`
      : `\n\nHere are a few perspectives worth considering:\n${principles.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;

    const memorySection =
      memoryNotes.length > 0
        ? isZh
          ? `\n\n我记得你之前说过：${memoryNotes.join("；")}`
          : `\n\nI remember you mentioned before: ${memoryNotes.join("; ")}`
        : "";

    const nextStep = isZh
      ? `\n\n下一步，${reasoningPlan.usefulNextStep}\n\n${reasoningPlan.questionToContinue}`
      : `\n\nA useful next step: ${reasoningPlan.usefulNextStep}\n\n${reasoningPlan.questionToContinue}`;

    return `${opening}${perspective}${memorySection}${nextStep}`;
  }

  async generateRawText(prompt: string, maxTokens = 1024): Promise<string> {
    // Detect language from the prompt content for deterministic placeholder JSON.
    const isZh = /[\u4e00-\u9fa5]/.test(prompt) || /语言：\s*zh/i.test(prompt);
    if (isZh) {
      return JSON.stringify({
        whatIsHappening: "用户正在描述自己的处境。",
        whatUserMayBeFeeling: "可能有复杂情绪，需要更多了解。",
        relevantPrinciples: ["先理解，再给建议"],
        conflictingConsiderations: ["信息尚不完整"],
        whatIsUnknown: ["用户的真实需求和限制"],
        safestInterpretation: "用户希望被理解，而不是立即获得答案。",
        usefulNextStep: "继续倾听并澄清关键信息。",
        questionToContinue: "能多告诉我一些吗？",
      });
    }
    return JSON.stringify({
      whatIsHappening: "The user is describing their situation.",
      whatUserMayBeFeeling: "Likely experiencing mixed feelings; more context needed.",
      relevantPrinciples: ["Understand first, advise second"],
      conflictingConsiderations: ["Information is still incomplete"],
      whatIsUnknown: ["The user's real needs and constraints"],
      safestInterpretation: "The user wants to be understood, not given an immediate answer.",
      usefulNextStep: "Continue listening and clarify key information.",
      questionToContinue: "Can you tell me more?",
    });
  }
}

function buildOpenAIMessages(ctx: MentorContext): { role: "system" | "user"; content: string }[] {
  const systemPrompt = buildSystemPrompt();
  const contextBlock = buildContextBlock(ctx);

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: contextBlock },
  ];
}

function buildContextBlock(ctx: MentorContext): string {
  const { userMessage, conversationHistory, understanding, memories, knowledgeNodes, reasoningPlan } = ctx;

  const history = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Mentor"}: ${m.content}`)
    .join("\n");

  const knowledge = knowledgeNodes
    .filter((k) => k.safetyClass !== "DO_NOT_GENERATE")
    .map((k) => `- ${k.title}: ${k.coreIdea}`)
    .join("\n");

  const memoryBlock = memories.map((m) => `- ${m.content}`).join("\n") || "None";

  return `USER MESSAGE:
${userMessage}

UNDERSTANDING:
- Language: ${understanding.language}
- Intent: ${understanding.intent}
- Domains: ${understanding.primaryDomain}${understanding.secondaryDomains.length ? ", " + understanding.secondaryDomains.join(", ") : ""}
- Emotional state: ${understanding.emotionalState}
- Decision stage: ${understanding.decisionStage}
- Summary: ${understanding.summary}

RETRIEVED KNOWLEDGE:
${knowledge}

RELEVANT MEMORIES:
${memoryBlock}

REASONING PLAN:
- What is happening: ${reasoningPlan.whatIsHappening}
- What user may be feeling: ${reasoningPlan.whatUserMayBeFeeling}
- Relevant principles: ${reasoningPlan.relevantPrinciples.join(", ")}
- Conflicting considerations: ${reasoningPlan.conflictingConsiderations.join(", ")}
- Unknown: ${reasoningPlan.whatIsUnknown.join(", ")}
- Safest interpretation: ${reasoningPlan.safestInterpretation}
- Useful next step: ${reasoningPlan.usefulNextStep}
- Question to continue: ${reasoningPlan.questionToContinue}

CONVERSATION HISTORY:
${history}

Please generate the final Mentor response in ${understanding.language === "zh" ? "Chinese" : "English"}.`;
}

export function getLLMProvider(): LLMProvider {
  const kimi = loadKimiConfig();
  if (kimi) {
    return new KimiProvider(kimi.baseUrl, kimi.apiKey, process.env.KIMI_MODEL || kimi.model);
  }
  return new MockLLMProvider();
}

function extractTextFromKimiResponse(data: { content: { type: string; text: string }[] }): string {
  // Some Kimi responses include `thinking` blocks before text blocks; skip them.
  // Also strip markdown fences (```json ... ```) if the model wraps JSON.
  const text = data.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("")
    .trim();

  const fencedMatch = text.match(/```(?:\w+)?\n?([\s\S]+?)```/);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }
  return text;
}

function buildSystemPrompt(): string {
  return `You are the HerBecoming Mentor, an original AI mentor for women navigating work, relationships, self-discovery, and life decisions.

You have learned from the HerBecoming Knowledge Base. Your role is not to retrieve and repeat knowledge, but to reason through the user's situation using the principles, frameworks, observations, and perspectives it contains.

Rules:
1. Understand the user's actual situation first.
2. Automatically identify primary and secondary domains.
3. Retrieve multiple related knowledge units when appropriate.
4. Do not mention internal knowledge IDs.
5. Do not mechanically quote the knowledge base.
6. Do not invent principles that contradict the knowledge base.
7. You may disagree with the user respectfully.
8. Never make major life decisions on behalf of the user.
9. Responses must be constructive, respectful, and forward-looking.
10. Never encourage manipulation, coercion, revenge, or harmful behavior.
11. When source knowledge contains manipulative strategies, reinterpret the underlying observation in a healthy way.
12. When the knowledge base does not provide sufficient basis, explicitly acknowledge the limitation.
13. Respond in the same language as the user's main input.`;
}
