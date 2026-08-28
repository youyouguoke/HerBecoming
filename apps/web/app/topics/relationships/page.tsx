import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Relationships | HerBecoming",
  description:
    "Navigate relationships with HerBecoming AI mentor. Get thoughtful guidance on boundaries, communication, and healthy connections.",
};

const topics = [
  {
    title: "How to set healthy boundaries",
    description:
      "Learn why boundaries matter and how to establish them without guilt or conflict.",
    href: "/chat",
  },
  {
    title: "How to stop people pleasing",
    description:
      "Understand the patterns behind people-pleasing and discover ways to honor your own needs.",
    href: "/chat",
  },
  {
    title: "How to communicate your needs",
    description:
      "Explore effective ways to express what you need in relationships while maintaining connection.",
    href: "/chat",
  },
  {
    title: "Navigating romantic relationships",
    description:
      "Get guidance on relationship decisions, from early dating to long-term partnerships.",
    href: "/chat",
  },
  {
    title: "Building trust",
    description:
      "Understand the foundations of trust and how to rebuild it when it's been damaged.",
    href: "/chat",
  },
];

export default function RelationshipsPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-4">Relationships</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          Navigating relationships can be complex. HerBecoming helps you think through
          relationship challenges, improve communication, and build healthier connections.
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
            Have a relationship question on your mind?
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
