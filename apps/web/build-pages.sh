#!/bin/bash
set -e

# 1. Backup API routes
echo "Backing up API routes..."
mkdir -p .tmp_api_backup
cp -r app/api .tmp_api_backup/api

# 2. Remove API routes (static export can't have them)
rm -rf app/api

# 3. Use static config
cp next.config.mjs next.config.mjs.server.bak
cp next.config.static.mjs next.config.mjs

# Add NEXT_PUBLIC_AUTH_URL to static config
python3 -c "
with open('next.config.mjs', 'r') as f:
    content = f.read()
content = content.replace(
    'NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,\n    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || \"https://api.herbecoming.app\"'
)
with open('next.config.mjs', 'w') as f:
    f.write(content)
"

# 4. Build static export
echo "Building static export..."
npm run build

# 5. Restore API routes
echo "Restoring API routes..."
rm -rf app/api
cp -r .tmp_api_backup/api app/api
rm -rf .tmp_api_backup

# 6. Restore server config
cp next.config.mjs.server.bak next.config.mjs
rm next.config.mjs.server.bak

echo "Static export complete!"
