import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { GlobalHeader } from "@/components/ui/GlobalHeader";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { PageWrapper } from "./PageWrapper";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "HerBecoming — Think clearly. Choose consciously. Grow intentionally.",
  description:
    "A quiet space to think through the questions that matter, guided by an AI mentor grounded in women's wisdom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <Script
          defer
          data-domain="herbecoming.app"
          src="https://plausible.shipsolo.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased bg-background text-on-background flex flex-col min-h-screen">
        <AuthProvider>
          <I18nProvider>
            <GlobalHeader />
            <PageWrapper>
              {children}
            </PageWrapper>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
