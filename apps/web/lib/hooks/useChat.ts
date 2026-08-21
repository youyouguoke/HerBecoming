"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { ChatMessage, ChatResponse, ChatStatus, UsageState } from "@/lib/chat/types";

const DAILY_FREE_LIMIT = 3;
const STORAGE_KEY = "herbecoming:guest";

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

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [usedCount, setUsedCount] = useState(0);

  useEffect(() => {
    const ctx = loadGuestContext();
    if (ctx) {
      setSessionId(ctx.sessionId);
      if (ctx.conversationId) setConversationId(ctx.conversationId);
      setUsedCount(ctx.usedCount || 0);
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
        const res = await fetch("/api/chat", {
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

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId("");
    setStatus("idle");
    setError(null);
    const newSessionId = nanoid();
    setSessionId(newSessionId);
    saveGuestContext({ sessionId: newSessionId, usedCount });
  }, [usedCount]);

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
