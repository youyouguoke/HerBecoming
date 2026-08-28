"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { TextToSpeech, isSpeechSynthesisSupported, getTTSLanguage } from "@/lib/voice/text-to-speech";

interface VoiceOutputButtonProps {
  text: string;
  locale?: string;
}

export function VoiceOutputButton({ text, locale }: VoiceOutputButtonProps) {
  const { t } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [tts, setTts] = useState<TextToSpeech | null>(null);

  useEffect(() => {
    setIsSupported(isSpeechSynthesisSupported());
  }, []);

  useEffect(() => {
    if (isSupported) {
      setTts(new TextToSpeech());
    }
  }, [isSupported]);

  const handleSpeak = useCallback(() => {
    if (!tts || !text) return;

    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
    } else {
      const language = getTTSLanguage(locale);
      tts.speak(text, {
        language,
        rate: 0.9,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  }, [tts, text, isSpeaking, locale]);

  useEffect(() => {
    return () => {
      if (tts) {
        tts.stop();
      }
    };
  }, [tts]);

  if (!isSupported || !text) {
    return null;
  }

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
        isSpeaking
          ? "bg-primary text-on-primary"
          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
      }`}
      aria-label={isSpeaking ? t("voice.stop_speaking") : t("voice.speak")}
    >
      {isSpeaking ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
}
