#!/usr/bin/env bash
# Deploy showrojeetchugh.com to the always-free preview host and verify.
# Usage: ./scripts/deploy.sh [user@host-or-ssh-alias]
set -euo pipefail

REMOTE="${1:-a1}"
REMOTE_DIR="/home/ubuntu/sites/showrojeetchugh.com"
UNIT="showrojeetchugh-site.service"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> syncing $ROOT -> $REMOTE:$REMOTE_DIR"
ssh "$REMOTE" "mkdir -p $REMOTE_DIR"
rsync -a --delete --exclude CNAME --exclude .git --exclude scripts "$ROOT/" "$REMOTE:$REMOTE_DIR/"

echo "==> restarting $UNIT"
ssh "$REMOTE" "sudo systemctl restart $UNIT && sleep 2 && systemctl is-active $UNIT"

echo "==> verifying local fetch on the host"
ssh "$REMOTE" 'for p in / /resume.html /projects.html /markets.html /systems.html /digital-assets.html /contact.html /assets/css/site.css /assets/pdf/Showrojeet_Chugh_Resume.pdf; do
  printf "%-46s " "$p"; curl -s -o /dev/null -w "%{http_code} %{size_download}B\n" "http://127.0.0.1:8099$p"; done'

echo "==> done. Public URL: see the cloudflared quick-tunnel log on the host"
echo "    ssh $REMOTE 'grep -oE \"https://[a-z0-9-]+\\.trycloudflare\\.com\" /home/ubuntu/.cloudflared/showrojeetchugh-preview.log | head -1'"
