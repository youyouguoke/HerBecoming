"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/components/providers/I18nProvider";

interface SatisfactionSurveyProps {
  conversationId: string;
  lastAssistantMessageId?: string;
  onComplete?: () => void;
}

export function SatisfactionSurvey({ conversationId, lastAssistantMessageId, onComplete }: SatisfactionSurveyProps) {
  const { t } = useI18n();
  const { status: authStatus } = useSession();
  const [step, setStep] = useState<"initial" | "questions" | "done">("initial");
  const [helpedSeeDifferently, setHelpedSeeDifferently] = useState<string | null>(null);
  const [wouldReturn, setWouldReturn] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isAuthenticated = authStatus === "authenticated";

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async () => {
    if (!lastAssistantMessageId || !helpedSeeDifferently || !wouldReturn) return;

    setSubmitting(true);
    try {
      await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: lastAssistantMessageId,
          helpedSeeDifferently,
          wouldReturn,
        }),
      });
      setStep("done");
      onComplete?.();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "done") {
    return (
      <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50 text-center">
        <p className="font-body-md text-on-surface-variant">Thank you for your feedback!</p>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50 space-y-md">
        <p className="font-headline-sm text-headline-sm text-on-surface">
          Quick feedback (optional)
        </p>

        {/* Question 1: Did this conversation help you see your situation differently? */}
        <div>
          <p className="font-body-md text-on-surface-variant mb-2">
            Did this conversation help you see your situation differently?
          </p>
          <div className="flex flex-wrap gap-2">
            {["not_really", "a_little", "yes", "definitely"].map((option) => (
              <button
                key={option}
                onClick={() => setHelpedSeeDifferently(option)}
                className={`px-4 py-2 rounded-full font-label-sm transition-colors ${
                  helpedSeeDifferently === option
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {option.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Would you come back to talk through another decision? */}
        <div>
          <p className="font-body-md text-on-surface-variant mb-2">
            Would you come back to talk through another decision?
          </p>
          <div className="flex flex-wrap gap-2">
            {["no", "maybe", "yes", "definitely"].map((option) => (
              <button
                key={option}
                onClick={() => setWouldReturn(option)}
                className={`px-4 py-2 rounded-full font-label-sm transition-colors ${
                  wouldReturn === option
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!helpedSeeDifferently || !wouldReturn || submitting}
            className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-sm hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit feedback"}
          </button>
          <button
            onClick={() => onComplete?.()}
            className="px-6 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-label-sm hover:bg-surface-variant transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  // Initial state: show a subtle prompt
  return (
    <div className="p-md bg-surface-container rounded-2xl border border-outline-variant/50">
      <button
        onClick={() => setStep("questions")}
        className="w-full text-left font-body-md text-on-surface-variant hover:text-primary transition-colors"
      >
        Was this conversation helpful? Give feedback →
      </button>
    </div>
  );
}
