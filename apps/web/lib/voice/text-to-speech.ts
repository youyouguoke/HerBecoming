/**
 * Text-to-Speech utility using Web Speech API
 * Supports Chinese and English
 */

export interface TextToSpeechOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export class TextToSpeech {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, options: TextToSpeechOptions = {}) {
    // Cancel any ongoing speech
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = options.language || "zh-CN";
    this.utterance.rate = options.rate || 1;
    this.utterance.pitch = options.pitch || 1;
    this.utterance.volume = options.volume || 1;

    this.utterance.onend = () => {
      this.isSpeaking = false;
      options.onEnd?.();
    };

    this.utterance.onerror = (event) => {
      console.error("TTS error:", event.error);
      this.isSpeaking = false;
      options.onError?.(event.error as string);
    };

    this.synth.speak(this.utterance);
    this.isSpeaking = true;
  }

  stop() {
    this.synth.cancel();
    this.isSpeaking = false;
  }

  pause() {
    this.synth.pause();
  }

  resume() {
    this.synth.resume();
  }

  getIsSpeaking() {
    return this.isSpeaking;
  }

  /**
   * Get available voices for a language
   */
  getVoices(language?: string): SpeechSynthesisVoice[] {
    const voices = this.synth.getVoices();
    if (!language) return voices;
    return voices.filter((v) => v.lang.startsWith(language));
  }
}

/**
 * Detect if browser supports speech synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return "speechSynthesis" in window;
}

/**
 * Get appropriate language code based on user preference or browser language
 */
export function getTTSLanguage(locale?: string): string {
  if (locale === "zh") return "zh-CN";
  if (locale === "en") return "en-US";
  const browserLang = navigator.language || "zh-CN";
  return browserLang.startsWith("zh") ? "zh-CN" : "en-US";
}
