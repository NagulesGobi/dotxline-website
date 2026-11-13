#!/usr/bin/env bash
# Re-render the press images from the site's own working app screens (compose.html).
# Run from the freshbit folder with the site served at http://localhost:8010/freshbit/
# (for example: python3 -m http.server 8010 --directory ~/Apps/dotxline-website).
set -euo pipefail
BASE="${BASE:-http://localhost:8010/freshbit}"
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="assets/press/screens"; TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
shot() { "$C" --headless=new --disable-gpu --hide-scrollbars "$@" >/dev/null 2>&1; }
for s in light dark; do
  shot --force-device-scale-factor=2 --window-size=1600,900 --virtual-time-budget=8000 --screenshot="$TMP/showcase-$s.png" "$BASE/tools/press/compose.html?set=$s"
  sips -s format jpeg -s formatOptions 88 "$TMP/showcase-$s.png" --out "$OUT/freshbit-showcase-$s.jpg" >/dev/null
  cwebp -quiet -q 82 -resize 1600 0 "$TMP/showcase-$s.png" -o "$OUT/freshbit-showcase-$s.webp"
  for sc in today story explore widgets settings; do
    shot --force-device-scale-factor=3 --window-size=380,760 --default-background-color=00000000 --virtual-time-budget=6000 \
      --screenshot="$OUT/freshbit-$sc-$s.png" "$BASE/tools/press/compose.html?set=$s&shot=single&screen=$sc"
    cwebp -quiet -q 85 -alpha_q 90 -resize 400 0 "$OUT/freshbit-$sc-$s.png" -o "$OUT/freshbit-$sc-$s.webp"
  done
done
shot --force-device-scale-factor=3 --window-size=380,760 --default-background-color=00000000 --virtual-time-budget=6000 \
  --screenshot="$OUT/freshbit-alerts.png" "$BASE/tools/press/compose.html?set=dark&shot=single&screen=alerts"
cwebp -quiet -q 85 -alpha_q 90 -resize 400 0 "$OUT/freshbit-alerts.png" -o "$OUT/freshbit-alerts.webp"
( cd "$OUT" && rm -f freshbit-press-screens.zip && zip -q -X freshbit-press-screens.zip *.jpg *.png )
echo "Press images updated in $OUT"
