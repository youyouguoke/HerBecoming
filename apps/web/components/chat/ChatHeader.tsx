"use client";

import Link from "next/link";

interface ChatHeaderProps {
  onNewConversation: () => void;
}

export function ChatHeader({ onNewConversation }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background w-full border-b-0">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-[1140px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline-md text-headline-md text-primary tracking-tight">
            HerBecoming
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={onNewConversation}
            className="text-primary font-label-md text-label-md hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            <span className="hidden md:inline">New conversation</span>
          </button>
          <button className="text-primary hover:opacity-80 transition-opacity rounded-full bg-surface-container p-2 flex items-center justify-center">
            <span className="sr-only">Account</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
