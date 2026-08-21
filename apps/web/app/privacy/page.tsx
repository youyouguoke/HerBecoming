import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | HerBecoming",
  description: "HerBecoming privacy policy",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1 bg-background text-on-background">
      <header className="w-full px-margin-mobile md:px-margin-desktop py-md max-w-[1140px] mx-auto flex justify-between items-center">
        <Link href="/" className="font-headline-md text-headline-md text-primary">
          HerBecoming
        </Link>
      </header>
      <main className="flex-1 w-full max-w-[760px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <h1 className="font-display text-display text-primary mb-8">Privacy Policy</h1>
        <div className="space-y-6 font-body-md text-body-md text-on-surface">
          <p>Last updated: August 2026</p>
          <p>
            HerBecoming is committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our AI mentor service.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">1. Information We Collect</h2>
          <p>
            We collect the conversations you choose to have with HerBecoming, anonymous session
            identifiers, and optional account information if you sign in. We do not sell your personal
            data.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">2. How We Use Your Information</h2>
          <p>
            We use your information to provide mentorship responses, improve the quality of our AI,
            and ensure safety. Conversations may be reviewed for safety and quality improvement
            purposes.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">3. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data. However, no method of
            transmission over the internet is 100% secure.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">4. Your Choices</h2>
          <p>
            You may start a conversation anonymously. Signing in allows you to preserve your
            conversation history across devices.
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-8">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
