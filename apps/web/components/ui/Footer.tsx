"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-outline-variant/30 bg-background">
      <div className="max-w-[1140px] mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo variant="footer" />
          </div>

          <nav className="flex items-center gap-6 md:gap-8">
            <Link
              href="/about"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/memory"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Memory
            </Link>
            <Link
              href="/privacy"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <a
              href="mailto:hello@herbecoming.app"
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant/30 text-center md:text-left">
          <p className="font-label-sm text-label-sm text-on-surface-variant/60">
            &copy; {currentYear} HerBecoming. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
