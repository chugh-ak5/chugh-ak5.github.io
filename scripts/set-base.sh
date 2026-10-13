#!/usr/bin/env bash
# Point the whole site at a different base URL (e.g. flip from chugh-ak5.github.io
# to showrojeetchugh.com once the domain is registered).
#
# Usage:  ./scripts/set-base.sh chugh-ak5.github.io
#         ./scripts/set-base.sh showrojeetchugh.com
#         ./scripts/set-base.sh              # show the current base only
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CURRENT="$(grep -rhoE '(chugh-ak5\.github\.io|showrojeetchugh\.com)' "$ROOT" \
  --include='*.html' --include='sitemap.xml' --include='robots.txt' | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')"

if [ $# -eq 0 ]; then
  echo "current base host: ${CURRENT:-<none found>}"
  exit 0
fi

NEW="$1"
NEW="${NEW#https://}"; NEW="${NEW#http://}"; NEW="${NEW%/}"

if [ -z "${CURRENT:-}" ]; then
  echo "No known base host found in the site; nothing to swap." >&2
  exit 1
fi
if [ "$NEW" = "$CURRENT" ]; then
  echo "already on $NEW — nothing to do"; exit 0
fi

echo "==> rewriting $CURRENT -> $NEW"
mapfile -t FILES < <(grep -rl "$CURRENT" "$ROOT" \
  --include='*.html' --include='sitemap.xml' --include='robots.txt' || true)

for f in "${FILES[@]}"; do
  sed -i "s/${CURRENT//./\\.}/${NEW}/g" "$f"
  echo "    ${f#$ROOT/}"
done

echo "==> verifying no stale references remain"
if grep -rn "$CURRENT" "$ROOT" --include='*.html' --include='*.xml' --include='*.txt' 2>/dev/null; then
  echo "!! stale references above" >&2; exit 1
fi
echo "==> done: base is now https://$NEW"
