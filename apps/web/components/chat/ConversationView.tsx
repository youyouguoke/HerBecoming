"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, ChatStatus } from "@/lib/chat/types";
import { UserMessage } from "./UserMessage";
import { MentorMessage } from "./MentorMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorState } from "./ErrorState";

interface ConversationViewProps {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  onRetry: () => void;
}

export function ConversationView({ messages, status, error, onRetry }: ConversationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const showTyping = status === "sending" || status === "streaming";

  return (
    <div ref={scrollRef} className="w-full max-w-3xl flex flex-col gap-xl pt-8 pb-4 overflow-y-auto">
      {messages.map((msg) =>
        msg.role === "user" ? (
          <UserMessage key={msg.id} content={msg.content} />
        ) : (
          <MentorMessage key={msg.id} content={msg.content} />
        )
      )}
      {showTyping && <TypingIndicator />}
      {status === "error" && error && <ErrorState message={error} onRetry={onRetry} />}
    </div>
  );
}
