#!/usr/bin/env bash
set -euo pipefail

# Build HerBecoming frontend for Cloudflare Pages static export.
# The Next.js API routes (including NextAuth) must stay on the backend server,
# so we temporarily remove app/api before static export.

cd "$(dirname "$0")/.."

echo "[build-pages] Preparing static export..."

# Remove API routes from the static export by moving them outside the project.
# .bak inside the project is still scanned by Next.js, so use /tmp.
API_TMP="/tmp/herbecoming_api_backup_$$"
if [ -d "app/api" ]; then
  mv app/api "$API_TMP"
fi

# Ensure static export config
if [ -f "next.config.static.mjs" ]; then
  cp next.config.static.mjs next.config.mjs
fi

# Build
echo "[build-pages] Building..."
NEXT_PUBLIC_API_URL=https://api.herbecoming.app npm run build
EXIT_CODE=$?

# Restore API routes
if [ -d "$API_TMP" ]; then
  mv "$API_TMP" app/api
fi

if [ $EXIT_CODE -ne 0 ]; then
  echo "[build-pages] Build failed."
  exit $EXIT_CODE
fi

echo "[build-pages] Done. Output: .vercel/output/static"
