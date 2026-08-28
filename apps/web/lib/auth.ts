import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { migrateAnonymousSessionToUser } from "@/lib/auth/migrate";

console.log("[auth] Loading auth module...");
console.log("[auth] GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("[auth] GOOGLE_CLIENT_SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length);
console.log("[auth] NEXTAUTH_SECRET length:", process.env.NEXTAUTH_SECRET?.length);
console.log("[auth] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  logger: {
    error(code: any, ...args: any[]) {
      console.error("[auth][ERROR]", code, ...args);
    },
    warn(code: any, ...args: any[]) {
      console.warn("[auth][WARN]", code, ...args);
    },
    debug(code: any, ...args: any[]) {
      // silent in production
    },
  },
  callbacks: {
    async signIn({ user, account }: any) {
      console.log("[auth][signIn] user:", user?.id, user?.email);
      console.log("[auth][signIn] account:", JSON.stringify(account));
      try {
        const rawState = account?.state as string | undefined;
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
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // After OAuth callback, always redirect to the frontend
      // The callbackUrl cookie often gets overwritten to api.herbecoming.app
      // during the CSRF exchange, so we force redirect to the frontend
      if (url.startsWith("https://herbecoming.app")) {
        return url;
      }
      // For any other URL (including api.herbecoming.app), go to chat
      return "https://herbecoming.app/chat";
    },
  },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: true,
        domain: ".herbecoming.app",
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: true,
        domain: ".herbecoming.app",
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: true,
        domain: ".herbecoming.app",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };

export async function auth() {
  return getServerSession(authOptions);
}

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};
