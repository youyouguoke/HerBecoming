"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { ChatMessage, ChatResponse, ChatStatus, UsageState } from "@/lib/chat/types";

const DAILY_FREE_LIMIT = 3;
const STORAGE_KEY = "herbecoming:guest";
const MESSAGES_STORAGE_KEY = "herbecoming:messages";

interface GuestContext {
  sessionId: string;
  conversationId?: string;
  usedCount: number;
}

function loadGuestContext(): GuestContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestContext;
  } catch {
    return null;
  }
}

function saveGuestContext(ctx: GuestContext) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
}

function loadLocalMessages(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return null;
  }
}

function saveLocalMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

async function fetchHistory(sessionId: string, conversationId: string): Promise<ChatMessage[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const endpoint = apiUrl
      ? `${apiUrl}/api/chat/history?sessionId=${encodeURIComponent(sessionId)}&conversationId=${encodeURIComponent(conversationId)}`
      : `/api/chat/history?sessionId=${encodeURIComponent(sessionId)}&conversationId=${encodeURIComponent(conversationId)}`;
    const res = await fetch(endpoint);
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [usedCount, setUsedCount] = useState(0);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId("");
    setStatus("idle");
    setError(null);
    const newSessionId = nanoid();
    setSessionId(newSessionId);
    saveGuestContext({ sessionId: newSessionId, usedCount });
    if (typeof window !== "undefined") {
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
  }, [usedCount]);

  useEffect(() => {
    const ctx = loadGuestContext();
    if (ctx) {
      setSessionId(ctx.sessionId);
      if (ctx.conversationId) setConversationId(ctx.conversationId);
      setUsedCount(ctx.usedCount || 0);
      if (ctx.conversationId && ctx.sessionId) {
        fetchHistory(ctx.sessionId, ctx.conversationId).then((serverMessages) => {
          if (serverMessages && serverMessages.length > 0) {
            setMessages(serverMessages);
            saveLocalMessages(serverMessages);
          } else {
            const local = loadLocalMessages();
            if (local && local.length > 0) {
              setMessages(local);
            }
          }
        });
      }
    } else {
      const newSessionId = nanoid();
      setSessionId(newSessionId);
      saveGuestContext({ sessionId: newSessionId, usedCount: 0 });
    }
  }, []);

  const usage: UsageState = useMemo(
    () => ({
      used: usedCount,
      remaining: Math.max(0, DAILY_FREE_LIMIT - usedCount),
      limit: DAILY_FREE_LIMIT,
    }),
    [usedCount]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || !content.trim()) return;

      const userMessage: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus("sending");
      setError(null);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const endpoint = apiUrl ? `${apiUrl}/api/chat` : "/api/chat";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messageId: conversationId || undefined,
            content: userMessage.content,
            anonymous: true,
          }),
        });

        if (res.status === 429) {
          setStatus("rate_limited");
          setUsedCount(DAILY_FREE_LIMIT);
          saveGuestContext({
            sessionId,
            conversationId,
            usedCount: DAILY_FREE_LIMIT,
          });
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Something went wrong.");
        }

        const data: ChatResponse = await res.json();

        if (data.safetyStatus === "crisis") {
          setStatus("crisis");
          return;
        }

        const assistantMessage: ChatMessage = {
          id: nanoid(),
          role: "assistant",
          content: data.answer,
          intent: data.intent,
          retrievedKnowledgeIds: data.knowledgeNodesUsed,
          memoryIds: data.memoriesUsed,
          conversationId: data.conversationId,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setConversationId(data.conversationId);
        setSessionId(data.sessionId);
        setUsedCount((prev) => {
          const next = prev + 1;
          saveGuestContext({
            sessionId: data.sessionId,
            conversationId: data.conversationId,
            usedCount: next,
          });
          return next;
        });
        setStatus("idle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    },
    [sessionId, conversationId]
  );

  const retry = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (messages.length > 0) {
      saveLocalMessages(messages);
    }
  }, [messages]);

  const isRateLimited = usedCount >= DAILY_FREE_LIMIT;

  return {
    messages,
    status,
    error,
    usage,
    isRateLimited,
    sendMessage,
    retry,
    startNewConversation,
    sessionId,
    conversationId,
  };
}
