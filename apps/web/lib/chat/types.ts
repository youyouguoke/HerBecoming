export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "safety";
  content: string;
  intent?: string;
  primaryDomain?: string | null;
  domains?: string[];
  riskLevel?: string;
  retrievedKnowledgeIds?: string[];
  memoryIds?: string[];
  messageId?: string;
  conversationId?: string;
  createdAt?: string;
  feedback?: {
    helpful?: boolean | null;
  };
}

export interface ChatResponse {
  answer: string;
  knowledgeNodesUsed: string[];
  memoriesUsed: string[];
  intent: string;
  safetyStatus: "normal" | "crisis" | string;
  suggestedAction: string | null;
  conversationId: string;
  sessionId: string;
  assistantMessageId?: string;
}

export interface UsageState {
  used: number;
  remaining: number;
  limit: number;
}

export type ChatStatus = "idle" | "sending" | "streaming" | "error" | "rate_limited" | "crisis";
