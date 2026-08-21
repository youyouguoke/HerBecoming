import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <header className="w-full px-margin-mobile md:px-margin-desktop py-md max-w-[1140px] mx-auto flex justify-between items-center">
        <span className="font-headline-md text-headline-md text-primary">HerBecoming</span>
        <Link
          href="/chat"
          className="font-label-md text-label-md text-primary hover:opacity-80 transition-opacity"
        >
          Start a Conversation
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile md:px-0 text-center">
        <div className="w-full max-w-[760px] space-y-lg animate-slide-up">
          <h1 className="font-display text-display text-primary">Think clearly.</h1>
          <p className="font-headline-md text-headline-md text-on-surface">
            Choose consciously. Grow intentionally.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[540px] mx-auto leading-relaxed">
            A quiet space to think through the questions that matter, guided by an AI mentor
            grounded in women&apos;s wisdom.
          </p>
          <div className="pt-lg">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors"
            >
              Start a conversation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
