"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";

interface Decision {
  id: string;
  title: string;
  topic: string | null;
  currentThinking: string | null;
  nextAction: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function JournalPage() {
  const { t } = useI18n();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journal/decisions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load decisions");
        return res.json();
      })
      .then((data) => {
        setDecisions(data.decisions || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="sticky top-0 z-50 bg-background border-b border-surface-variant/30">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-[1140px] mx-auto">
          <Link href="/" className="font-headline-md text-headline-md text-primary tracking-tight">
            HerBecoming
          </Link>
          <Link href="/chat" className="text-primary font-label-md text-label-md hover:opacity-80 transition-opacity">
            {t("nav.start_conversation")}
          </Link>
        </div>
      </header>

      <main className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flex items-center justify-between mb-lg">
          <h1 className="font-display text-display-sm text-on-surface">{t("journal.title")}</h1>
        </div>

        {loading && (
          <div className="text-center py-2xl">
            <span className="font-body-md text-on-surface-variant">Loading...</span>
          </div>
        )}

        {!loading && decisions.length === 0 && (
          <div className="text-center py-2xl bg-surface-container rounded-3xl border border-outline-variant/50">
            <p className="font-body-lg text-on-surface-variant">{t("journal.empty")}</p>
            <Link
              href="/chat"
              className="inline-block mt-md px-6 py-3 bg-primary text-on-primary rounded-full font-label-md hover:bg-secondary transition-colors"
            >
              {t("nav.start_conversation")}
            </Link>
          </div>
        )}

        <div className="grid gap-md">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="p-md md:p-lg bg-surface-container rounded-2xl border border-outline-variant/50 hover:border-outline transition-colors"
            >
              <div className="flex items-start justify-between gap-md mb-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">{decision.title}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant capitalize">
                  {decision.status.toLowerCase()}
                </span>
              </div>
              {decision.topic && (
                <p className="font-label-sm text-label-sm text-tertiary mb-sm">{decision.topic}</p>
              )}
              {decision.currentThinking && (
                <p className="font-body-md text-on-surface-variant line-clamp-3 mb-sm">{decision.currentThinking}</p>
              )}
              {decision.nextAction && (
                <p className="font-body-sm text-on-surface-variant/80">
                  <span className="font-label-sm text-label-sm text-on-surface">Next action: </span>
                  {decision.nextAction}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
