import { ReactNode } from "react";
import { Footer } from "@/components/ui/Footer";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
