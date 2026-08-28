"use client";

import { useI18n } from "@/components/providers/I18nProvider";

interface ChatHeaderProps {
  onNewConversation: () => void;
  onToggleHistory?: () => void;
}

export function ChatHeader({ onNewConversation, onToggleHistory }: ChatHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggleHistory}
        className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
        aria-label="History"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <button
        onClick={onNewConversation}
        className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
      >
        <span className="text-lg">+</span>
        <span className="hidden md:inline font-label-md text-label-md">{t("nav.start_conversation")}</span>
      </button>
    </div>
  );
}
