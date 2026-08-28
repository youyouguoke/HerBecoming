"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { SpeechRecognizer, isSpeechRecognitionSupported, getSpeechLanguage } from "@/lib/voice/speech-to-text";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  locale?: string;
}

export function VoiceInputButton({ onTranscript, disabled = false, locale }: VoiceInputButtonProps) {
  const { t } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recognizer, setRecognizer] = useState<SpeechRecognizer | null>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const startListening = useCallback(() => {
    if (disabled || !isSupported) return;

    setError(null);
    const language = getSpeechLanguage(locale);

    const newRecognizer = new SpeechRecognizer({
      language,
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          onTranscript(transcript);
          setIsListening(false);
        }
      },
      onError: (err) => {
        console.error("Speech recognition error:", err);
        setError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    setRecognizer(newRecognizer);
    newRecognizer.start();
    setIsListening(true);
  }, [disabled, isSupported, locale, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognizer) {
      recognizer.stop();
      setIsListening(false);
    }
  }, [recognizer]);

  useEffect(() => {
    return () => {
      if (recognizer) {
        recognizer.abort();
      }
    };
  }, [recognizer]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          isListening
            ? "bg-error text-on-error animate-pulse"
            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
        } disabled:opacity-60`}
        aria-label={isListening ? t("voice.stop_listening") : t("voice.start_listening")}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {isListening && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-surface-container rounded-lg shadow-lg whitespace-nowrap">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {t("voice.listening")}
          </span>
        </div>
      )}

      {error && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-error rounded-lg shadow-lg whitespace-nowrap">
          <span className="font-label-sm text-label-sm text-on-error">
            {t("voice.error")}
          </span>
        </div>
      )}
    </div>
  );
}
