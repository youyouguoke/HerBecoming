import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { migrateAnonymousSessionToUser } from "@/lib/auth/migrate";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Migrate anonymous session data if sessionId was passed via OAuth state.
        const rawState = (account as any)?.state as string | undefined;
        if (rawState && user.id) {
          const parsed = JSON.parse(rawState);
          if (parsed?.anonymousSessionId) {
            await migrateAnonymousSessionToUser(parsed.anonymousSessionId, user.id);
          }
        }
      } catch (err) {
        console.error("[auth] Failed to migrate anonymous session:", err);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/chat",
    error: "/chat",
  },
  trustHost: true,
});

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};
