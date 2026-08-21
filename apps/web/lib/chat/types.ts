export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  primaryDomain?: string | null;
  domains?: string[];
  riskLevel?: string;
  retrievedKnowledgeIds?: string[];
  memoryIds?: string[];
  createdAt?: string;
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
}

export interface UsageState {
  used: number;
  remaining: number;
  limit: number;
}

export type ChatStatus = "idle" | "sending" | "streaming" | "error" | "rate_limited" | "crisis";
