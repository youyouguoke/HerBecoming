import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Your Mentor | HerBecoming",
  description:
    "Meet your HerBecoming AI mentor - an original AI personality with structured knowledge, independent thinking, and a commitment to helping you grow.",
};

export default function AboutMentorPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-8">
          About Your Mentor
        </h1>

        <div className="space-y-8 font-body-md text-body-md text-on-surface">
          {/* Who is the mentor */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Who is HerBecoming?
            </h2>
            <p className="mb-4">
              HerBecoming is an AI mentor designed specifically for women who want to think more
              clearly, make better decisions, and grow through life&apos;s changes.
            </p>
            <p className="mb-4">
              She is not a chatbot, not a virtual girlfriend, not a substitute for therapy, and
              not an AI that agrees with everything you say to keep you coming back.
            </p>
            <p>
              She is <strong>a mentor with her own original personality, independent thinking, and
              a structured knowledge system</strong> built from research in psychology, career
              development, communication, and personal growth.
            </p>
          </section>

          {/* Where knowledge comes from */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Where does her knowledge come from?
            </h2>
            <p className="mb-4">
              HerBecoming&apos;s knowledge comes from a curated collection of insights drawn from:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Psychology research</li>
              <li>Career development studies</li>
              <li>Communication science</li>
              <li>Behavioral economics</li>
              <li>Philosophy and ethics</li>
              <li>Women&apos;s leadership research</li>
              <li>Relationship science</li>
            </ul>
            <p>
              This knowledge is structured into what we call <strong>Knowledge Units</strong> - each
              containing a core idea, context, counterpoints, reflection questions, and practical
              applications.
            </p>
          </section>

          {/* Why not a real person */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Why not a real person?
            </h2>
            <p className="mb-4">
              HerBecoming is an <strong>original AI personality</strong>, not a simulation of any
              real person. She doesn&apos;t pretend to be a specific woman, celebrity, or therapist.
            </p>
            <p>
              Her knowledge and personality are built from research and principles, not from copying
              any individual. This allows her to provide consistent, evidence-based guidance while
              maintaining clear boundaries about what she can and cannot do.
            </p>
          </section>

          {/* How knowledge is used */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              How does she use knowledge?
            </h2>
            <p className="mb-4">
              When you share a problem or question, HerBecoming:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>Understands</strong> what you&apos;re really asking about</li>
              <li><strong>Identifies</strong> the relevant topics and themes</li>
              <li><strong>Retrieves</strong> relevant knowledge from her knowledge system</li>
              <li><strong>Considers</strong> multiple perspectives, including counterpoints</li>
              <li><strong>Combines</strong> this with your personal context and history</li>
              <li><strong>Generates</strong> a thoughtful, personalized response</li>
            </ol>
            <p>
              She doesn&apos;t just look up pre-written answers. Each response is generated
              specifically for your situation, drawing on her knowledge base while adapting to
              your unique context.
            </p>
          </section>

          {/* What she can and cannot do */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              What she can and cannot do
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-surface-container rounded-2xl">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
                  She can:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>Help you think through complex decisions</li>
                  <li>Offer different perspectives on your situation</li>
                  <li>Point out blind spots in your thinking</li>
                  <li>Provide structured reflection questions</li>
                  <li>Remember important information across conversations</li>
                  <li>Gently challenge assumptions when needed</li>
                </ul>
              </div>

              <div className="p-4 bg-surface-container rounded-2xl">
                <h3 className="font-headline-sm text-headline-sm text-tertiary mb-3">
                  She cannot:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>Make decisions for you</li>
                  <li>Replace professional therapy or counseling</li>
                  <li>Provide medical or legal advice</li>
                  <li>Pretend to be a real person</li>
                  <li> Guarantee specific outcomes</li>
                  <li>Access information outside her knowledge base</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy principles */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              Privacy principles
            </h2>
            <ul className="space-y-3">
              <li>
                <strong>Your conversations are private.</strong> We don&apos;t sell your data or
                share it with third parties for advertising.
              </li>
              <li>
                <strong>You control your memory.</strong> You can view, edit, or delete any
                information the mentor remembers about you.
              </li>
              <li>
                <strong>You can use it anonymously.</strong> No account required to start
                talking. Sign in only when you want to preserve your history.
              </li>
              <li>
                <strong>Safety comes first.</strong> If you&apos;re in crisis, we provide
                immediate resources and encourage real-world support.
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center pt-8">
            <p className="text-on-surface-variant mb-6">
              Ready to think through something on your mind?
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
          </section>
        </div>
      </main>
    </div>
  );
}
