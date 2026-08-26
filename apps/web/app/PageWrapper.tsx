"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Footer } from "@/components/ui/Footer";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  const isChat = pathname === "/chat";

  return (
    <>
      {children}
      {!isChat && <Footer />}
    </>
  );
}
