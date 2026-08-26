"use client";

import { useState } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { ChatHeaderProvider } from "./ChatHeaderContext";
import { WelcomeState } from "./WelcomeState";
import { ConversationView } from "./ConversationView";
import { MessageComposer } from "./MessageComposer";
import { MobileNavBar } from "./MobileNavBar";
import { LoginWall } from "./LoginWall";
import { CrisisPanel } from "./CrisisPanel";
import { ConversationListPanel } from "./ConversationListPanel";

export function ChatShell() {
  const {
    messages,
    status,
    error,
    usage,
    isRateLimited,
    sendMessage,
    retry,
    startNewConversation,
    loadConversation,
    submitFeedback,
    conversations,
    sessionId,
    showLoginWall,
    closeLoginWall,
  } = useChat();

  const [listOpen, setListOpen] = useState(false);
  const isEmpty = messages.length === 0;

  if (status === "crisis") {
    return <CrisisPanel />;
  }

  return (
    <ChatHeaderProvider
      onNewConversation={startNewConversation}
      onToggleHistory={() => setListOpen((v) => !v)}
    >
      <div className="relative flex flex-col flex-1 min-h-0 bg-background text-on-background">
        {showLoginWall && <LoginWall anonymousSessionId={sessionId} onClose={closeLoginWall} />}
        <main className="flex-1 flex flex-col items-center w-full px-margin-mobile md:px-margin-desktop min-h-0 overflow-hidden">
          <ConversationListPanel
            open={listOpen}
            onClose={() => setListOpen(false)}
            conversations={conversations}
            activeId={messages[0]?.conversationId || ""}
            onSelect={(id) => {
              setListOpen(false);
              loadConversation(id);
            }}
            onNewConversation={startNewConversation}
          />
          {isEmpty ? (
            <WelcomeState onSend={sendMessage} status={status} />
          ) : (
            <ConversationView
              messages={messages}
              status={status}
              error={error}
              onRetry={retry}
              onFeedback={submitFeedback}
            />
          )}
        </main>
        {!isEmpty && (
          <MessageComposer
            onSend={sendMessage}
            status={status}
            usage={usage}
            isRateLimited={isRateLimited}
            onNewConversation={startNewConversation}
          />
        )}
        {isEmpty && <MobileNavBar />}
      </div>
    </ChatHeaderProvider>
  );
}
