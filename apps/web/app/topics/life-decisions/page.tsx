import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Life Decisions | HerBecoming",
  description:
    "Navigate life decisions with HerBecoming AI mentor. Get thoughtful guidance on uncertainty, trade-offs, and making choices that align with your values.",
};

const topics = [
  {
    title: "How to make difficult decisions",
    description:
      "Learn a structured approach to making tough choices when there's no clear right answer.",
    href: "/chat",
  },
  {
    title: "How to make decisions when both options are good",
    description:
      "Explore how to choose between multiple attractive options without paralysis or regret.",
    href: "/chat",
  },
  {
    title: "How to stop being afraid of regret",
    description:
      "Understand regret and develop a healthier relationship with uncertainty and decision-making.",
    href: "/chat",
  },
  {
    title: "Navigating life transitions",
    description:
      "Get guidance on major life changes, from moving to a new city to starting over.",
    href: "/chat",
  },
  {
    title: "Balancing priorities",
    description:
      "Learn how to clarify what matters most and make trade-offs that align with your values.",
    href: "/chat",
  },
];

export default function LifeDecisionsPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-4">Life Decisions</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          Life is full of choices without clear answers. HerBecoming helps you think through
          complex decisions, consider different perspectives, and make choices you can feel
          good about.
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
            Have a life decision on your mind?
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
