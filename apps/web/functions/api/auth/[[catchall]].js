const BACKEND = "https://api.herbecoming.app";

export async function onRequest(context) {
  const { request, params } = context;
  const catchall = params.catchall || [];
  const path = "/api/auth/" + catchall.join("/");
  const url = new URL(request.url);
  const targetUrl = BACKEND + path + url.search;

  // Forward the request to the backend
  const headers = new Headers(request.headers);
  headers.set("Host", "api.herbecoming.app");
  // Remove origin/referer so backend doesn't complain
  headers.delete("origin");
  headers.delete("referer");

  const resp = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    redirect: "manual",
  });

  // Build response with adjusted headers
  const respHeaders = new Headers(resp.headers);
  // Remove problematic headers
  respHeaders.delete("content-security-policy");
  respHeaders.delete("x-frame-options");
  // Set CORS for same-origin
  respHeaders.set("Access-Control-Allow-Origin", url.origin);
  respHeaders.set("Access-Control-Allow-Credentials", "true");

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: respHeaders,
  });
}
