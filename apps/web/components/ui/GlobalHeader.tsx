"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useI18n } from "@/components/providers/I18nProvider";
import { useChatHeader } from "@/components/chat/ChatHeaderContext";
import { Logo } from "@/components/ui/Logo";

// Google "G" logo SVG
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GlobalHeader() {
  const { t, locale, setLocale } = useI18n();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";
  const isChatPage = pathname === "/chat";
  const chatHeader = useChatHeader();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm w-full border-b border-outline-variant/30">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-[1140px] mx-auto">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo variant="header" />
        </Link>

        {/* Center: chat controls on /chat */}
        {isChatPage && chatHeader && (
          <div className="flex items-center gap-2">
            <button
              onClick={chatHeader.onToggleHistory}
              className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2 p-2"
              aria-label="History"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline font-label-md text-label-md">{t("history.title")}</span>
            </button>

            <button
              onClick={chatHeader.onNewConversation}
              className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2 p-2"
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:inline font-label-md text-label-md">{t("history.new_conversation")}</span>
            </button>
          </div>
        )}

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {/* Sign-in button or User menu */}
          {isAuthenticated ? (
            /* Logged in: user pill with dropdown */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors pl-1 pr-3 py-1"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-on-primary font-label-sm text-sm">
                      {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="font-label-md text-label-md text-on-surface max-w-[120px] truncate hidden sm:inline">
                  {session?.user?.name || session?.user?.email?.split("@")[0] || "User"}
                </span>
                <svg
                  className={`w-4 h-4 text-on-surface-variant transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-surface-container border border-outline-variant shadow-ambient py-2 z-50">
                  <Link
                    href="/journal"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-body-md text-body-md text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>

                  <div className="border-t border-outline-variant/30 my-1" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 font-body-md text-body-md text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in: Google Sign In pill button */
            <button
              onClick={() => signIn("google", { callbackUrl: "/chat" })}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 hover:from-amber-400 hover:via-orange-400 hover:to-orange-500 transition-all px-4 py-2 shadow-sm hover:shadow-md"
            >
              <GoogleIcon className="w-4 h-4" />
              <span className="font-label-md text-label-md text-gray-900 font-medium">
                SIGN IN
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
