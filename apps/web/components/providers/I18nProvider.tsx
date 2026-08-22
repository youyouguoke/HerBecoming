"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Locale = "en" | "zh";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "herbecoming:locale";

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || (navigator as any).userLanguage || "en";
  return lang.toLowerCase().startsWith("zh") ? "zh" : "en";
}

const messages: Record<Locale, Record<string, string>> = {
  en: {
    "nav.start_conversation": "Start a Conversation",
    "hero.title": "What's on your mind?",
    "hero.subtitle":
      "A thoughtful AI mentor to help you navigate work, relationships, self-discovery, and life's biggest decisions.",
    "hero.cta": "Start Talking",
    "hero.free": "3 free questions every day. No sign-up required.",
    "chat.placeholder": "Tell me what's on your mind...",
    "chat.send": "Send",
    "chat.free_remaining": "{remaining} free question{plural} remaining today",
    "chat.limit_reached_title": "Continue your conversation",
    "chat.limit_reached_body":
      "You have used your 3 free questions today. Sign in to keep exploring your thoughts with HerBecoming.",
    "chat.continue_google": "Continue with Google",
    "chat.privacy_notice": "HerBecoming may provide thoughtful but imperfect perspectives.",
    "chat.feedback_helpful": "Helpful",
    "chat.feedback_not_helpful": "Not helpful",
    "chat.feedback_thanks": "Thanks for your feedback",
    "history.title": "Conversations",
    "history.new_conversation": "New conversation",
    "history.empty": "No conversations yet.",
    "history.untitled": "New conversation",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "journal.title": "Decision Journal",
    "journal.empty": "No decisions saved yet.",
    "journal.save": "Save as decision",
    "journal.saved": "Saved to Decision Journal",
    "journal.login_required": "Sign in to save this decision.",
    "journal.save_error": "Failed to save decision.",
    "header.decisions": "Decisions",
    "header.sign_in": "Sign in",
    "header.sign_out": "Sign out",
  },
  zh: {
    "nav.start_conversation": "开始对话",
    "hero.title": "你想聊点什么？",
    "hero.subtitle":
      "一位有思想的 AI 导师，陪你梳理工作、关系、自我探索，以及人生中那些重大决定。",
    "hero.cta": "开始对话",
    "hero.free": "每天 3 个免费问题，无需注册。",
    "chat.placeholder": "告诉我，你在想什么……",
    "chat.send": "发送",
    "chat.free_remaining": "今天还剩余 {remaining} 个免费问题",
    "chat.limit_reached_title": "继续对话",
    "chat.limit_reached_body": "你今天已经用完了 3 个免费问题。登录后继续与 HerBecoming 交流。",
    "chat.continue_google": "使用 Google 登录",
    "chat.privacy_notice": "HerBecoming 提供有思考但不完美的视角，仅供参考。",
    "chat.feedback_helpful": "有帮助",
    "chat.feedback_not_helpful": "没帮助",
    "chat.feedback_thanks": "感谢反馈",
    "footer.privacy": "隐私",
    "footer.terms": "条款",
    "journal.title": "决策日志",
    "journal.empty": "还没有保存的决策。",
    "journal.save": "保存为决策",
    "journal.saved": "已保存到决策日志",
    "journal.login_required": "登录后才能保存该决策。",
    "journal.save_error": "保存决策失败。",
    "header.decisions": "决策",
    "header.sign_in": "登录",
    "header.sign_out": "退出登录",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setLocaleState(stored === "zh" || stored === "en" ? stored : detectBrowserLocale());
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  };

  const t = (key: string): string => {
    return messages[locale][key] || messages.en[key] || key;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
