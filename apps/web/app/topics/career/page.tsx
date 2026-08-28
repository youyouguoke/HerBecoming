import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Career Guidance | HerBecoming",
  description:
    "Explore career decisions with HerBecoming AI mentor. Get thoughtful guidance on career changes, work-life balance, and professional growth.",
};

const topics = [
  {
    title: "Should I quit my job?",
    description:
      "Feeling stuck in your current role? Learn how to evaluate whether it's time for a change or if there are ways to improve your current situation.",
    href: "/chat",
  },
  {
    title: "How to know if you need a career change",
    description:
      "Discover the signs that might indicate it's time for a career transition, and how to distinguish between temporary dissatisfaction and a fundamental mismatch.",
    href: "/chat",
  },
  {
    title: "How to make a career decision",
    description:
      "Struggling with a career choice? Learn a structured approach to weighing your options and making decisions aligned with your values and goals.",
    href: "/chat",
  },
  {
    title: "Navigating career growth",
    description:
      "Explore how to grow professionally while maintaining balance, and understand what true career success means to you.",
    href: "/chat",
  },
  {
    title: "Work-life balance myths",
    description:
      "Is perfect work-life balance realistic? Explore healthier ways to think about integrating work and personal life.",
    href: "/chat",
  },
];

export default function CareerPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-4">Career</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          Thinking through career decisions? HerBecoming can help you explore your options,
          clarify what you really want, and make choices aligned with your values.
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
            Have a career question on your mind?
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
