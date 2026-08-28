import { GET as NextAuthGET, POST as NextAuthPOST } from "@/lib/auth";

async function loggedGET(req: Request, ctx: any) {
  const url = new URL(req.url);
  const cookies = req.headers.get("cookie") || "none";
  console.log("[auth-route] GET", url.pathname, "cookies:", cookies.substring(0, 300));
  const res = await (NextAuthGET as any)(req, ctx);
  console.log("[auth-route] GET", url.pathname, "status:", res.status);
  return res;
}

async function loggedPOST(req: Request, ctx: any) {
  const url = new URL(req.url);
  const cookies = req.headers.get("cookie") || "none";
  console.log("[auth-route] POST", url.pathname, "cookies:", cookies.substring(0, 300));
  const res = await (NextAuthPOST as any)(req, ctx);
  console.log("[auth-route] POST", url.pathname, "status:", res.status);
  return res;
}

export { loggedGET as GET, loggedPOST as POST };
