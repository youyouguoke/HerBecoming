import { UnderstandingResult, RetrievedKnowledge, Memory } from "@/lib/mentor/types";

interface ReasoningPlanPromptInput {
  userMessage: string;
  understanding: UnderstandingResult;
  knowledgeNodes: RetrievedKnowledge[];
  memories: Memory[];
}

export function buildReasoningPlanPrompt(input: ReasoningPlanPromptInput): string {
  const { userMessage, understanding, knowledgeNodes, memories } = input;
  const isZh = understanding.language === "zh";

  const knowledgeBlock =
    knowledgeNodes
      .map((k, i) => {
        const counterpoints =
          k.counterpoints && k.counterpoints.length > 0
            ? `\nCounterpoints: ${k.counterpoints.join("; ")}`
            : "";
        return `${i + 1}. Title: ${k.title}\nCore idea: ${k.coreIdea}${counterpoints}`;
      })
      .join("\n\n") || (isZh ? "无" : "None");

  const memoriesBlock =
    memories.map((m, i) => `${i + 1}. ${m.content}`).join("\n") ||
    (isZh ? "无" : "None");

  const userContext = isZh
    ? `用户信息：
- 用户消息：${userMessage}
- 语言：zh
- 意图：${understanding.intent}
- 主要领域：${understanding.primaryDomain}
- 次要领域：${understanding.secondaryDomains.join(", ") || "无"}
- 情绪状态：${understanding.emotionalState}
- 决策阶段：${understanding.decisionStage}
- 理解摘要：${understanding.summary}`
    : `User information:
- User message: ${userMessage}
- Language: en
- Intent: ${understanding.intent}
- Primary domain: ${understanding.primaryDomain}
- Secondary domains: ${understanding.secondaryDomains.join(", ") || "none"}
- Emotional state: ${understanding.emotionalState}
- Decision stage: ${understanding.decisionStage}
- Understanding summary: ${understanding.summary}`;

  const instructions = isZh
    ? `你是一位为女性用户提供成长支持的 AI Mentor。请根据上面的用户消息、理解结果、检索到的知识节点和相关记忆，生成一份结构化的 ReasoningPlan（推理计划），帮助后续回复更好地理解用户处境。

请返回严格符合以下 JSON 格式的对象，不要添加任何额外说明：

{
  "whatIsHappening": "string",
  "whatUserMayBeFeeling": "string",
  "relevantPrinciples": ["string"],
  "conflictingConsiderations": ["string"],
  "whatIsUnknown": ["string"],
  "safestInterpretation": "string",
  "usefulNextStep": "string",
  "questionToContinue": "string"
}

要求：
1. 使用中文回答。
2. 内容应体现对用户处境的深入理解，而不是简单复述输入。
3. relevantPrinciples 应从提供的知识节点中提取关键原则、框架或核心观点。
4. conflictingConsiderations 应识别当前情境中的张力、矛盾或需要权衡的因素。
5. whatIsUnknown 应列出为了更好帮助用户还需要了解的信息。
6. safestInterpretation 应给出对用户处境最稳妥、最有帮助的理解。
7. usefulNextStep 应建议一个具体、温和的下一步。
8. questionToContinue 应提出一个开放式问题，引导用户继续表达。`
    : `You are an AI Mentor supporting women in personal growth. Based on the user message, understanding result, retrieved knowledge nodes, and relevant memories above, generate a structured ReasoningPlan to help the subsequent response better understand the user's situation.

Return strictly a JSON object matching this shape, with no additional explanation:

{
  "whatIsHappening": "string",
  "whatUserMayBeFeeling": "string",
  "relevantPrinciples": ["string"],
  "conflictingConsiderations": ["string"],
  "whatIsUnknown": ["string"],
  "safestInterpretation": "string",
  "usefulNextStep": "string",
  "questionToContinue": "string"
}

Requirements:
1. Respond in English.
2. Demonstrate deep understanding rather than simply repeating the input.
3. relevantPrinciples should extract key principles, frameworks, or core ideas from the provided knowledge nodes.
4. conflictingConsiderations should identify tensions, contradictions, or trade-offs in the current situation.
5. whatIsUnknown should list information still needed to better help the user.
6. safestInterpretation should provide the most helpful and cautious interpretation of the user's situation.
7. usefulNextStep should suggest a concrete, gentle next step.
8. questionToContinue should ask an open-ended question to invite the user to share more.`;

  return `${userContext}

${isZh ? "检索到的知识节点：" : "Retrieved knowledge nodes:"}
${knowledgeBlock}

${isZh ? "相关记忆：" : "Relevant memories:"}
${memoriesBlock}

${instructions}`;
}
