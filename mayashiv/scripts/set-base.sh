#!/usr/bin/env bash
# Re-point the site at a different base URL, e.g. when it moves from
#   https://chugh-ak5.github.io/mayashiv/   (project page, temporary)
# to
#   https://mayashiv.github.io/             (its own account/org)
# or https://mayashiv.in/                    (bought domain)
#
# Usage: ./scripts/set-base.sh https://mayashiv.github.io/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OLD_HOST="chugh-ak5.github.io"
OLD_PATH="/mayashiv"

if [ $# -eq 0 ]; then
  echo "current base: https://${OLD_HOST}${OLD_PATH}/"
  echo "usage: $0 https://<new-host>/[path/]"
  exit 0
fi

BASE="${1%/}/"                    # normalise trailing slash
NEW_HOST="$(printf '%s' "$BASE" | sed -E 's#https?://([^/]+)/.*#\1#')"
NEW_PATH="$(printf '%s' "$BASE" | sed -E 's#https?://[^/]+(/.*)#\1#')"
NEW_PATH="${NEW_PATH%/}"          # '' for a root site

echo "==> host: $OLD_HOST -> $NEW_HOST | path prefix: '$OLD_PATH' -> '$NEW_PATH'"

mapfile -t FILES < <(grep -rl -e "$OLD_HOST" -e "href=\"$OLD_PATH/" "$ROOT" \
  --include='*.html' --include='sitemap.xml' --include='robots.txt' || true)

for f in "${FILES[@]}"; do
  sed -i "s#${OLD_HOST}#${NEW_HOST}#g; s#href=\"${OLD_PATH}/#href=\"${NEW_PATH}/#g" "$f"
  echo "    ${f#$ROOT/}"
done

echo "==> leftover references to the old base:"
grep -rn -e "$OLD_HOST" -e "href=\"$OLD_PATH/" "$ROOT" --include='*.html' --include='*.xml' --include='*.txt' || echo "    none"
echo "==> done: base is now $BASE"
