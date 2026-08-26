"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, ChatStatus } from "@/lib/chat/types";
import { UserMessage } from "./UserMessage";
import { MentorMessage } from "./MentorMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorState } from "./ErrorState";
import { SatisfactionSurvey } from "./SatisfactionSurvey";

interface ConversationViewProps {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  onRetry: () => void;
  onFeedback?: (messageId: string, helpful: boolean) => Promise<boolean>;
  conversationId?: string;
  showSatisfactionSurvey?: boolean;
  onSatisfactionComplete?: () => void;
}

export function ConversationView({
  messages,
  status,
  error,
  onRetry,
  onFeedback,
  conversationId,
  showSatisfactionSurvey = false,
  onSatisfactionComplete,
}: ConversationViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const showTyping = status === "sending" || status === "streaming";

  // Find the last assistant message
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div ref={scrollRef} className="w-full max-w-3xl flex-1 flex flex-col gap-xl pt-8 pb-4 overflow-y-auto">
      {messages.map((msg) =>
        msg.role === "user" ? (
          <UserMessage key={msg.id} content={msg.content} />
        ) : (
          <MentorMessage
            key={msg.id}
            content={msg.content}
            messageId={msg.messageId || msg.id}
            conversationId={msg.conversationId}
            feedback={msg.feedback}
            onFeedback={onFeedback}
          />
        )
      )}
      {showTyping && <TypingIndicator />}
      {status === "error" && error && <ErrorState message={error} onRetry={onRetry} />}

      {/* Satisfaction Survey */}
      {showSatisfactionSurvey && conversationId && lastAssistantMessage && (
        <SatisfactionSurvey
          conversationId={conversationId}
          lastAssistantMessageId={lastAssistantMessage.messageId || lastAssistantMessage.id}
          onComplete={onSatisfactionComplete}
        />
      )}
    </div>
  );
}
