"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";

export default function Home() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div
      className="relative flex flex-col flex-1 bg-cover bg-center bg-no-repeat text-on-background"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-background/75" aria-hidden="true" />
      <div className="relative z-10 flex flex-col flex-1">
        <header className="w-full px-margin-mobile md:px-margin-desktop py-md max-w-[1140px] mx-auto flex justify-between items-center">
          <span className="font-headline-md text-headline-md text-primary">HerBecoming</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === "en" ? "zh" : "en")}
              className="font-label-md text-label-md text-on-surface hover:text-primary transition-colors"
              aria-label="Switch language"
            >
              {locale === "en" ? "中文" : "English"}
            </button>
            <Link
              href="/chat"
              className="font-label-md text-label-md text-primary hover:opacity-80 transition-opacity"
            >
              {t("nav.start_conversation")}
            </Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile md:px-0 text-center">
          <div className="w-full max-w-[760px] space-y-lg animate-slide-up">
            <h1 className="font-display text-display text-primary">{t("hero.title")}</h1>
            <p className="font-headline-md text-headline-md text-on-surface">
              {t("hero.subtitle")}
            </p>
            <div className="pt-lg">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors"
              >
                {t("hero.cta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </Link>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[540px] mx-auto leading-relaxed">
              {t("hero.free")}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
