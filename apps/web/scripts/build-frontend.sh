#!/bin/bash
set -e

cd /root/projects/HerBecoming/apps/web

# Save server config
cp next.config.mjs next.config.server.mjs

# Use static export config
cp next.config.static.mjs next.config.mjs

# Build static export
NEXT_PUBLIC_API_URL=https://api.herbecoming.app npx next build

# Restore server config
cp next.config.server.mjs next.config.mjs
rm next.config.server.mjs
