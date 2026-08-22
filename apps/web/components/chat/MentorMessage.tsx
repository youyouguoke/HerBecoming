"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { useI18n } from "@/components/providers/I18nProvider";

interface MentorMessageProps {
  content: string;
  messageId?: string;
  conversationId?: string;
  feedback?: {
    helpful?: boolean | null;
  };
  onFeedback?: (messageId: string, helpful: boolean) => Promise<boolean>;
}

export function MentorMessage({ content, messageId, conversationId, feedback, onFeedback }: MentorMessageProps) {
  const { t } = useI18n();
  const { status: authStatus } = useSession();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const isAuthenticated = authStatus === "authenticated";
  const existingFeedback = feedback?.helpful;

  const handleSaveDecision = async () => {
    if (!isAuthenticated) {
      setSaveStatus("error");
      setErrorText(t("journal.login_required"));
      return;
    }

    setSaveStatus("saving");
    setErrorText(null);

    try {
      // Use the first line as title, or a fallback
      const title = content.split(/\n|\./)[0].slice(0, 80) || "Decision from HerBecoming";
      const res = await fetch("/api/journal/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          currentThinking: content.slice(0, 2000),
          conversationId,
          messageId,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSaveStatus("saved");
    } catch (err) {
      console.error("[MentorMessage] Save decision failed:", err);
      setSaveStatus("error");
      setErrorText(t("journal.save_error"));
    }
  };

  return (
    <div className="w-full flex flex-col gap-unit items-start">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-headline-md text-headline-md text-primary">HerBecoming</span>
        <span className="font-label-sm text-label-sm text-outline">Mentor</span>
      </div>
      <div className="pl-4 border-l-2 border-primary-container max-w-[95%] md:max-w-[80%]">
        <div className="font-body-lg text-body-lg text-on-surface prose prose-sm max-w-none prose-headings:font-headline-md prose-headings:text-on-surface prose-p:mb-4 prose-ul:pl-5 prose-li:marker:text-on-surface-variant">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="mt-sm flex flex-wrap items-center gap-sm">
          <button
            onClick={handleSaveDecision}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors font-label-sm text-label-sm text-on-surface-variant disabled:opacity-60"
          >
            {saveStatus === "saving" ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 7v-5h-.581m0 7a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{t("journal.save")}</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t("journal.saved")}</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{t("journal.save")}</span>
              </>
            )}
          </button>

          {isAuthenticated && messageId && onFeedback && (
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => onFeedback(messageId, true)}
                disabled={existingFeedback === true}
                aria-label={t("chat.feedback_helpful")}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors font-label-sm ${
                  existingFeedback === true
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high hover:bg-surface-variant text-on-surface-variant"
                } disabled:opacity-60`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <button
                onClick={() => onFeedback(messageId, false)}
                disabled={existingFeedback === false}
                aria-label={t("chat.feedback_not_helpful")}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors font-label-sm ${
                  existingFeedback === false
                    ? "bg-error text-on-error"
                    : "bg-surface-container-high hover:bg-surface-variant text-on-surface-variant"
                } disabled:opacity-60`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
            </div>
          )}

          {errorText && <span className="font-label-sm text-label-sm text-error">{errorText}</span>}
        </div>
      </div>
    </div>
  );
}
