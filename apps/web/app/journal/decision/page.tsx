"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/providers/I18nProvider";

interface Decision {
  id: string;
  title: string;
  topic: string | null;
  context: string | null;
  whatIWant: string | null;
  whatIFear: string | null;
  options: { text: string; pros: string; cons: string }[] | null;
  tradeoffs: string | null;
  currentThinking: string | null;
  nextAction: string | null;
  reviewDate: string | null;
  outcome: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function DecisionContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No decision ID provided");
      setLoading(false);
      return;
    }
    fetch(`/api/journal/decisions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setDecision)
      .catch(() => setError("Decision not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-background text-on-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-on-surface-variant">Loading...</div>
        </main>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="flex flex-col flex-1 bg-background text-on-background">
        <main className="flex-1 flex flex-col items-center justify-center gap-md">
          <p className="text-on-surface-variant">{error || "Decision not found"}</p>
          <Link href="/journal" className="text-primary underline">Back to Journal</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <div className="mb-lg">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant capitalize">
            {decision.status}
          </span>
          {decision.topic && (
            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 font-label-sm text-label-sm text-primary capitalize">
              {decision.topic}
            </span>
          )}
        </div>

        <h1 className="font-display text-display text-primary mb-lg">{decision.title}</h1>

        {decision.context && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Context</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.context}</p>
          </section>
        )}

        {decision.whatIWant && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">What I Want</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.whatIWant}</p>
          </section>
        )}

        {decision.whatIFear && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">What I Fear</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.whatIFear}</p>
          </section>
        )}

        {decision.options && decision.options.length > 0 && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Options</h2>
            <div className="space-y-md">
              {decision.options.map((opt, i) => (
                <div key={i} className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
                  <p className="font-body-md text-body-md text-on-surface font-medium mb-sm">{opt.text}</p>
                  {opt.pros && <p className="font-body-sm text-body-sm text-on-surface-variant"><span className="text-green-600">+</span> {opt.pros}</p>}
                  {opt.cons && <p className="font-body-sm text-body-sm text-on-surface-variant"><span className="text-red-600">-</span> {opt.cons}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {decision.tradeoffs && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Tradeoffs</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.tradeoffs}</p>
          </section>
        )}

        {decision.currentThinking && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Current Thinking</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.currentThinking}</p>
          </section>
        )}

        {decision.nextAction && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Next Action</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.nextAction}</p>
          </section>
        )}

        {decision.outcome && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Outcome</h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{decision.outcome}</p>
          </section>
        )}

        {decision.reviewDate && (
          <section className="mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-sm">Review Date</h2>
            <p className="font-body-md text-body-md text-on-surface">{new Date(decision.reviewDate).toLocaleDateString()}</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default function DecisionDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1 bg-background text-on-background items-center justify-center min-h-screen">
          <div className="animate-pulse text-on-surface-variant">Loading...</div>
        </div>
      }
    >
      <DecisionContent />
    </Suspense>
  );
}
