"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ChatStatus } from "@/lib/chat/types";
import { useI18n } from "@/components/providers/I18nProvider";

interface WelcomeStateProps {
  onSend: (content: string) => void;
  status: ChatStatus;
}

export function WelcomeState({ onSend, status }: WelcomeStateProps) {
  const { t, locale } = useI18n();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!text.trim() || status === "sending" || status === "streaming" || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSend(text);
    } finally {
      setIsSubmitting(false);
    }
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="w-full max-w-[760px] flex flex-col items-center justify-center flex-1 text-center pt-16 md:pt-24">
      <div className="space-y-lg mb-xl animate-slide-up">
        <h1 className="font-display text-display text-primary">HerBecoming</h1>
        <div className="space-y-sm">
          <p className="font-headline-md text-headline-md text-on-surface">
            {t("hero.subtitle")}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[540px] mx-auto leading-relaxed">
            {t("hero.free")}
          </p>
        </div>
      </div>

      <div className="w-full mt-xl animate-slide-up delay-300">
        <div className="relative w-full rounded-2xl bg-surface-container-lowest border border-outline-variant hover:border-outline shadow-sm overflow-hidden flex flex-col focus-within:border-primary transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label={t("hero.title")}
            placeholder={t("chat.placeholder")}
            className="w-full bg-transparent border-none focus:ring-0 resize-none p-md font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/50 min-h-[80px]"
            style={{ overflow: "hidden" }}
          />
          <div className="flex items-center justify-between px-md py-sm border-t border-surface-container">
            <div className="flex items-center gap-sm text-on-surface-variant">
              <button aria-label="Voice note" className="p-2 rounded-full hover:bg-surface-variant transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || status === "sending" || isSubmitting}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-all flex items-center gap-2 disabled:opacity-60 min-w-[130px] justify-center"
            >
              {status === "sending" || isSubmitting ? (
                <>
                  <svg className="w-4 h-4" style={{ animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 7v-5h-.581m0 7a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{locale === "zh" ? "思考中" : "Reflecting"}</span>
                </>
              ) : (
                <>
                  <span>{locale === "zh" ? "反思" : "Reflect"}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-sm font-label-sm text-label-sm text-on-surface-variant/60 text-center animate-fade-in delay-500">
          {t("chat.privacy_notice")}
        </p>
      </div>
    </div>
  );
}
