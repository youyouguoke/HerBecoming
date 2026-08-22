"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useI18n } from "@/components/providers/I18nProvider";

interface ChatHeaderProps {
  onNewConversation: () => void;
}

export function ChatHeader({ onNewConversation }: ChatHeaderProps) {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";

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
            <span className="hidden md:inline">{t("nav.start_conversation")}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-primary hover:opacity-80 transition-opacity rounded-full bg-surface-container p-2 flex items-center justify-center"
            >
              <span className="sr-only">Account</span>
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-surface-container border border-outline-variant shadow-ambient py-2 z-50">
                <Link
                  href="/journal"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 font-body-md text-on-surface hover:bg-surface-variant transition-colors"
                >
                  {t("header.decisions")}
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/chat" });
                    }}
                    className="w-full text-left px-4 py-3 font-body-md text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    {t("header.sign_out")}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signIn("google", { callbackUrl: "/chat" });
                    }}
                    className="w-full text-left px-4 py-3 font-body-md text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    {t("header.sign_in")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
