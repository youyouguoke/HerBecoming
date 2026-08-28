"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Static export has no /api routes.
 * We manually fetch the session from the backend API and pass it to SessionProvider
 * so useSession() picks it up immediately after OAuth redirect.
 *
 * We render children while session is still loading (no visibility:hidden) so the
 * page shell (GlobalHeader, Footer) is never hidden. NextAuth will reconcile the
 * session state once it arrives.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    fetch("/api/auth/session", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setSession(data);
        } else {
          setSession(null);
        }
      })
      .catch(() => setSession(null));
  }, []);

  return (
    <SessionProvider session={session === undefined ? null : session}>
      {children}
    </SessionProvider>
  );
}
