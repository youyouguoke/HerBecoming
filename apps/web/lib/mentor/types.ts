import { KnowledgeNode, Memory, Message } from "@prisma/client";

export type { KnowledgeNode, Memory, Message } from "@prisma/client";

export type RiskLevel = "normal" | "elevated" | "crisis";

export interface SafetyResult {
  riskLevel: RiskLevel;
  riskCategory?: string | null;
  confidence?: number;
  action: "normal" | "elevated" | "crisis";
  crisisResponse?: string | null;
}

export interface UnderstandingResult {
  language: "zh" | "en";
  intent: string;
  primaryDomain: string;
  secondaryDomains: string[];
  emotionalState: string;
  decisionStage: string;
  summary: string;
}

export interface RetrievedKnowledge extends KnowledgeNode {
  score: number;
  relationDepth: number;
}

export interface ReasoningPlan {
  whatIsHappening: string;
  whatUserMayBeFeeling: string;
  relevantPrinciples: string[];
  conflictingConsiderations: string[];
  whatIsUnknown: string[];
  safestInterpretation: string;
  usefulNextStep: string;
  questionToContinue: string;
}

export interface MentorContext {
  userId?: string | null;
  anonymousSessionId?: string | null;
  conversationId: string;
  messageId: string;
  userMessage: string;
  conversationHistory: { role: "user" | "assistant"; content: string }[];
  understanding: UnderstandingResult;
  safety: SafetyResult;
  memories: Memory[];
  knowledgeNodes: RetrievedKnowledge[];
  reasoningPlan: ReasoningPlan;
}

export interface ChatRequest {
  sessionId: string;
  messageId?: string | null;
  content: string;
  anonymous?: boolean;
}

export interface ChatResponse {
  answer: string;
  knowledgeNodesUsed: string[];
  memoriesUsed: string[];
  intent: string;
  safetyStatus: RiskLevel;
  suggestedAction?: "save_decision" | "save_reflection" | null;
  assistantMessageId?: string;
}
