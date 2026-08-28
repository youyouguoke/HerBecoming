"use client";

import { createContext, useContext, ReactNode } from "react";

interface ChatHeaderContextValue {
  onNewConversation: () => void;
  onToggleHistory: () => void;
}

const ChatHeaderContext = createContext<ChatHeaderContextValue | null>(null);

export function ChatHeaderProvider({
  children,
  onNewConversation,
  onToggleHistory,
}: {
  children: ReactNode;
  onNewConversation: () => void;
  onToggleHistory: () => void;
}) {
  return (
    <ChatHeaderContext.Provider value={{ onNewConversation, onToggleHistory }}>
      {children}
    </ChatHeaderContext.Provider>
  );
}

export function useChatHeader() {
  return useContext(ChatHeaderContext);
}
