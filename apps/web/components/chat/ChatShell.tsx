"use client";

import { useChat } from "@/lib/hooks/useChat";
import { Footer } from "@/components/ui/Footer";
import { ChatHeader } from "./ChatHeader";
import { WelcomeState } from "./WelcomeState";
import { ConversationView } from "./ConversationView";
import { MessageComposer } from "./MessageComposer";
import { MobileNavBar } from "./MobileNavBar";
import { LoginWall } from "./LoginWall";
import { CrisisPanel } from "./CrisisPanel";

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
  } = useChat();

  const isEmpty = messages.length === 0;

  if (status === "crisis") {
    return <CrisisPanel />;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background text-on-background pb-28 md:pb-24">
      <ChatHeader onNewConversation={startNewConversation} />
      <main className="flex-1 flex flex-col items-center w-full px-margin-mobile md:px-margin-desktop min-h-0 overflow-hidden">
        {isEmpty ? (
          <WelcomeState onSend={sendMessage} status={status} />
        ) : (
          <ConversationView messages={messages} status={status} error={error} onRetry={retry} />
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
      <MobileNavBar />
    </div>
  );
}
