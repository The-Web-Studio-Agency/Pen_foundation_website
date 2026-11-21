#!/usr/bin/env bash
# Update the live site on the VPS with the latest code from GitHub.
#
#   cd ~/pen-foundation && ./scripts/deploy.sh
#
# Content, leads and uploads live in MongoDB, so a deploy never touches them.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "Missing .env.local (MONGODB_URI, CMS_ADMIN_*, CMS_SECRET). Create it first." >&2
  exit 1
fi

git pull --ff-only
npm ci
npm run build

if pm2 describe pen-foundation >/dev/null 2>&1; then
  pm2 reload pen-foundation
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo "Deployed $(git rev-parse --short HEAD)."
