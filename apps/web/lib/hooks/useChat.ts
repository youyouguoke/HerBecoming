"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
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

interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
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

function apiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "";
}

async function fetchHistory(sessionId: string, conversationId: string): Promise<ChatMessage[]> {
  try {
    const base = apiUrl();
    const endpoint = base
      ? `${base}/api/chat/history?type=messages&sessionId=${encodeURIComponent(sessionId)}&conversationId=${encodeURIComponent(conversationId)}`
      : `/api/chat/history?type=messages&sessionId=${encodeURIComponent(sessionId)}&conversationId=${encodeURIComponent(conversationId)}`;
    const res = await fetch(endpoint);
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}

async function fetchConversations(): Promise<ConversationSummary[]> {
  try {
    const base = apiUrl();
    const endpoint = base ? `${base}/api/chat/history?type=conversations` : "/api/chat/history?type=conversations";
    const res = await fetch(endpoint);
    if (!res.ok) return [];
    const data = await res.json();
    return data.conversations || [];
  } catch {
    return [];
  }
}

export function useChat() {
  const { status: authStatus, data: authData } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [usedCount, setUsedCount] = useState(0);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  const isAuthenticated = authStatus === "authenticated";

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId("");
    setStatus("idle");
    setError(null);
    const newSessionId = sessionId || nanoid();
    setSessionId(newSessionId);
    saveGuestContext({ sessionId: newSessionId, usedCount });
    if (typeof window !== "undefined") {
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
  }, [usedCount, sessionId]);

  const loadConversation = useCallback(async (id: string) => {
    if (!id) return;
    setStatus("idle");
    setError(null);

    if (!isAuthenticated) {
      // Anonymous: load from local storage only
      const local = loadLocalMessages();
      if (local && local.length > 0 && local[0]?.conversationId === id) {
        setMessages(local);
        setConversationId(id);
      }
      return;
    }

    // Authenticated: fetch from server
    try {
      const base = apiUrl();
      const endpoint = base
        ? `${base}/api/chat/history?type=messages&conversationId=${encodeURIComponent(id)}`
        : `/api/chat/history?type=messages&conversationId=${encodeURIComponent(id)}`;
      const res = await fetch(endpoint);
      if (!res.ok) return;
      const data = await res.json();
      const loaded: ChatMessage[] = (data.messages || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        intent: m.intent || undefined,
        conversationId: id,
        messageId: m.id,
        createdAt: m.createdAt,
      }));
      setMessages(loaded);
      setConversationId(id);
      saveLocalMessages(loaded);
    } catch (err) {
      console.error("[useChat] loadConversation failed:", err);
    }
  }, [isAuthenticated]);

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) {
      const local = loadLocalMessages();
      if (local && local.length > 0 && local[0]?.conversationId) {
        setConversations([
          {
            id: local[0].conversationId,
            title: null,
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
      return;
    }
    const list = await fetchConversations();
    setConversations(list);
  }, [isAuthenticated]);

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

  // Load conversation list when auth state becomes known
  useEffect(() => {
    if (authStatus === "authenticated") {
      loadConversations();
    }
  }, [authStatus, loadConversations]);

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
        const base = apiUrl();
        const endpoint = base ? `${base}/api/chat` : "/api/chat";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messageId: conversationId || undefined,
            content: userMessage.content,
            anonymous: !isAuthenticated,
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
          messageId: data.assistantMessageId || nanoid(),
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

        // Refresh conversation list for logged-in users
        if (isAuthenticated) {
          loadConversations();
        }

        setStatus("idle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    },
    [sessionId, conversationId, isAuthenticated, loadConversations]
  );

  const retry = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const submitFeedback = useCallback(
    async (messageId: string, helpful: boolean) => {
      if (!isAuthenticated || !messageId) return false;
      try {
        const base = apiUrl();
        const endpoint = base ? `${base}/api/chat/feedback` : "/api/chat/feedback";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId, helpful }),
        });
        if (!res.ok) return false;
        setMessages((prev) =>
          prev.map((m) =>
            m.messageId === messageId || m.id === messageId
              ? { ...m, feedback: { ...(m.feedback || {}), helpful } }
              : m
          )
        );
        return true;
      } catch (err) {
        console.error("[useChat] submitFeedback failed:", err);
        return false;
      }
    },
    [isAuthenticated]
  );

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
    loadConversation,
    loadConversations,
    submitFeedback,
    conversations,
    sessionId,
    conversationId,
    isAuthenticated,
  };
}
