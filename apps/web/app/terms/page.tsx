import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HerBecoming",
  description: "HerBecoming terms of service",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-8">Terms of Service</h1>
        <div className="space-y-6 font-body-md text-body-md text-on-surface">
          <p>Last updated: August 2026</p>
          <p>
            Welcome to HerBecoming. By accessing or using our service, you agree to these Terms of
            Service. If you do not agree, please do not use the service.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">1. The Service</h2>
          <p>
            HerBecoming provides an AI-powered mentorship experience designed to help users reflect
            on life decisions, relationships, career, and personal growth. The service is not a
            substitute for professional therapy, medical advice, or legal counsel.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">2. User Responsibilities</h2>
          <p>
            You agree to use the service responsibly and not to misuse, abuse, or attempt to harm the
            platform or others. You are responsible for any content you submit.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">3. Limitation of Liability</h2>
          <p>
            HerBecoming provides perspectives for reflection only. We are not liable for any decisions
            or actions you take based on interactions with the AI mentor.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">4. Modifications</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes
            constitutes acceptance of the updated terms.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">5. Contact Us</h2>
          <p>
            For questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:hello@herbecoming.app" className="text-primary hover:underline">
              hello@herbecoming.app
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
