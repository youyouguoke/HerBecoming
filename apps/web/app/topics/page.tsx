import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Topics | HerBecoming",
  description:
    "Explore topics with HerBecoming AI mentor. Career, relationships, self-discovery, and life decisions.",
};

const topics = [
  {
    title: "Career",
    description: "Career growth, changes, and professional development",
    href: "/topics/career",
  },
  {
    title: "Relationships",
    description: "Boundaries, communication, and healthy connections",
    href: "/topics/relationships",
  },
  {
    title: "Self",
    description: "Identity, confidence, and personal growth",
    href: "/topics/self",
  },
  {
    title: "Life Decisions",
    description: "Uncertainty, trade-offs, and making choices",
    href: "/topics/life-decisions",
  },
];

export default function TopicsPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">

      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-4">Topics</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          HerBecoming can help you think through questions across these areas of life.
          You don&apos;t need to choose a topic &mdash; just start talking and the AI will
          understand what you&apos;re dealing with.
        </p>

        <div className="grid md:grid-cols-2 gap-md">
          {topics.map((topic, index) => (
            <Link
              key={index}
              href={topic.href}
              className="block p-lg bg-surface-container rounded-2xl border border-outline-variant/50 hover:border-outline transition-colors"
            >
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                {topic.title}
              </h2>
              <p className="font-body-md text-on-surface-variant">{topic.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-xl text-center">
          <p className="text-on-surface-variant mb-4">
            Or just start talking about what&apos;s on your mind.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors"
          >
            Start talking
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
