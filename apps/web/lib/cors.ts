const ALLOWED_ORIGINS = [
  "https://herbecoming.app",
  "https://www.herbecoming.app",
  "https://herbecoming.pages.dev",
  "http://localhost:3000",
  "http://localhost:8788",
];

export function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
}
