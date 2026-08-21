import { MentorContext, ChatResponse, ReasoningPlan } from "@/lib/mentor/types";
import fs from "fs";

export interface LLMProvider {
  generateMentorResponse(ctx: MentorContext): Promise<string>;
}

function loadMimoConfig(): { baseUrl: string; apiKey: string; model: string } | null {
  try {
    const raw = fs.readFileSync("/root/.openclaw/openclaw.json", "utf8");
    const config = JSON.parse(raw);
    const mimo = config.models?.providers?.mimo;
    if (mimo?.baseUrl && mimo?.apiKey && mimo?.models?.length) {
      return {
        baseUrl: mimo.baseUrl,
        apiKey: mimo.apiKey,
        model: mimo.models[0].id,
      };
    }
  } catch (err) {
    console.warn("Failed to load MiMo config from openclaw.json:", err);
  }
  return null;
}

class MimoProvider implements LLMProvider {
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
          max_tokens: 1024,
          temperature: 0.7,
          system: messages[0].content,
          messages: messages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`MiMo API error: ${res.status} ${text}`);
      }

      const data = (await res.json()) as { content: { type: string; text: string }[] };
      return data.content.map((c) => c.text).join("");
    } catch (err) {
      console.warn("MiMo API call failed, falling back to mock provider:", err);
      return new MockLLMProvider().generateMentorResponse(ctx);
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
  const mimo = loadMimoConfig();
  if (mimo) {
    return new MimoProvider(mimo.baseUrl, mimo.apiKey, process.env.MIMO_MODEL || mimo.model);
  }
  return new MockLLMProvider();
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
