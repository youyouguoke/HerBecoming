/**
 * Speech-to-Text utility using Web Speech API
 * Supports Chinese and English
 */

export interface SpeechRecognitionOptions {
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognizer {
  private recognition: any;
  private isListening = false;

  constructor(options: SpeechRecognitionOptions = {}) {
    // Check browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error("Speech recognition is not supported in this browser");
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = options.language || "zh-CN";

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      options.onResult?.(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      options.onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd?.();
    };
  }

  start() {
    if (this.isListening) return;
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  }

  stop() {
    if (!this.isListening) return;
    this.recognition.stop();
    this.isListening = false;
  }

  abort() {
    this.recognition.abort();
    this.isListening = false;
  }

  getIsListening() {
    return this.isListening;
  }
}

/**
 * Detect if browser supports speech recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

/**
 * Get appropriate language code based on user preference or browser language
 */
export function getSpeechLanguage(locale?: string): string {
  if (locale === "zh") return "zh-CN";
  if (locale === "en") return "en-US";
  // Default to browser language or Chinese
  const browserLang = navigator.language || "zh-CN";
  return browserLang.startsWith("zh") ? "zh-CN" : "en-US";
}
