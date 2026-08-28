import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Self-Discovery | HerBecoming",
  description:
    "Explore self-discovery with HerBecoming AI mentor. Get thoughtful guidance on identity, confidence, and personal growth.",
};

const topics = [
  {
    title: "How to stop doubting yourself",
    description:
      "Understand the roots of self-doubt and discover ways to build confidence in your abilities.",
    href: "/chat",
  },
  {
    title: "How to build self-confidence",
    description:
      "Explore practical approaches to developing genuine confidence that doesn't depend on external validation.",
    href: "/chat",
  },
  {
    title: "How to understand what you really want",
    description:
      "Cut through the noise and discover your authentic desires and values.",
    href: "/chat",
  },
  {
    title: "Embracing imperfection",
    description:
      "Learn how perfectionism holds you back and how to embrace a healthier approach to growth.",
    href: "/chat",
  },
  {
    title: "Finding your identity",
    description:
      "Explore questions of identity and self-worth beyond your job title or relationship status.",
    href: "/chat",
  },
];

export default function SelfPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-4">Self</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          Understanding yourself is the foundation of growth. HerBecoming helps you
          explore your identity, build confidence, and discover what truly matters to you.
        </p>

        <div className="space-y-md">
          {topics.map((topic, index) => (
            <Link
              key={index}
              href={topic.href}
              className="block p-md bg-surface-container rounded-2xl border border-outline-variant/50 hover:border-outline transition-colors"
            >
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                {topic.title}
              </h2>
              <p className="font-body-md text-on-surface-variant">{topic.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-xl text-center">
          <p className="text-on-surface-variant mb-4">
            Have a question about yourself on your mind?
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors"
          >
            Talk it through with HerBecoming
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
