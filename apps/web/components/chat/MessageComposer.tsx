"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ChatStatus, UsageState } from "@/lib/chat/types";
import { LoginWall } from "./LoginWall";

interface MessageComposerProps {
  onSend: (content: string) => void;
  status: ChatStatus;
  usage: UsageState;
  isRateLimited: boolean;
  onNewConversation: () => void;
}

export function MessageComposer({
  onSend,
  status,
  usage,
  isRateLimited,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!text.trim() || status === "sending" || status === "streaming" || isRateLimited || isSubmitting) return;
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-12 pb-6 md:pb-6 pb-16 z-40">
        <div className="hidden md:block max-w-3xl mx-auto flex flex-col gap-2 relative">
          {usage.used > 0 && usage.used < usage.limit && (
            <div className="text-center mb-1">
              <span className="font-label-sm text-label-sm text-tertiary">
                {usage.remaining} free question{usage.remaining === 1 ? "" : "s"} remaining today
              </span>
            </div>
          )}
          <div className="relative w-full bg-surface-container rounded-2xl border border-outline-variant focus-within:border-primary transition-colors shadow-ambient">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Share your thoughts"
              placeholder="Share your thoughts..."
              disabled={isRateLimited}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-4 pl-5 pr-14 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 min-h-[60px] max-h-[128px] disabled:opacity-60"
              style={{ overflow: "hidden" }}
            />
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || status === "sending" || isRateLimited || isSubmitting}
              className="absolute right-3 bottom-3 p-2 bg-primary text-on-primary rounded-xl hover:bg-secondary transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              {status === "sending" || isSubmitting ? (
                <svg className="w-5 h-5" style={{ animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 7v-5h-.581m0 7a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="font-label-sm text-label-sm text-outline/60">
              HerBecoming may provide thoughtful but imperfect perspectives.
            </span>
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 w-full bg-background/90 backdrop-blur-md z-40 pb-6 pt-4 px-margin-mobile border-t border-surface-variant/30">
          <div className="max-w-[1140px] mx-auto flex items-end gap-sm bg-surface-container rounded-2xl border border-outline-variant focus-within:border-primary transition-colors p-2 pl-4">
            <button aria-label="Add attachment" className="text-on-surface-variant p-2 hover:text-primary transition-colors mb-0.5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Share your thoughts"
              placeholder="Share your thoughts..."
              disabled={isRateLimited}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none font-body-md text-on-surface placeholder:text-outline-variant py-3 max-h-32 min-h-[44px]"
              style={{ overflow: "hidden" }}
            />
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || status === "sending" || isRateLimited || isSubmitting}
              className="bg-primary text-on-primary p-3 rounded-full hover:bg-on-primary-container transition-colors mb-0.5 flex-shrink-0 shadow-sm disabled:opacity-60"
              aria-label="Send message"
            >
              {status === "sending" || isSubmitting ? (
                <svg className="w-5 h-5" style={{ animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 7v-5h-.581m0 7a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </footer>

      {isRateLimited && <LoginWall />}
    </>
  );
}
