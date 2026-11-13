#!/usr/bin/env bash
# Release FreshBit for Mac and update the website in the same step.
#
#   tools/release-mac.sh                       # uses ~/Apps/Designer News/mac
#   tools/release-mac.sh /path/to/mac/project
#
# What it does, in order:
#   1. Regenerates the Xcode project (xcodegen) so the version in project.yml is used.
#   2. Archives a Release build signed with your Developer ID Application certificate.
#   3. Packages FreshBit.dmg (app + Applications shortcut) and signs it.
#   4. Notarizes it with Apple and staples the ticket, then checks Gatekeeper accepts it.
#   5. Publishes it as GitHub release mac-v<version> on NagulesGobi/freshbit-website.
#      The download link on the site always points at the latest release:
#      https://github.com/NagulesGobi/freshbit-website/releases/latest/download/FreshBit.dmg
#   6. Writes mac.json (version, build, size, date) into both copies of the site and pushes
#      them, so the version shown on the website changes at the same time as the app.
#
# One-time setup (done by you, not this script):
#   - A "Developer ID Application" certificate in your keychain
#     (Xcode › Settings › Accounts › Manage Certificates › + › Developer ID Application).
#   - A Developer ID provisioning profile named "FreshBit Mac Developer ID" for
#     com.nagulesgobi.freshbit.mac that includes Sign in with Apple, installed in Xcode.
#   - Notarization credentials saved under the profile name "freshbit":
#       xcrun notarytool store-credentials freshbit --apple-id <your Apple ID> --team-id B7WQQB5K9P
#     (it asks for an app-specific password from account.apple.com; it is stored in your keychain).
set -euo pipefail

PROJ="${1:-$HOME/Apps/Designer News/mac}"
TEAM="${TEAM_ID:-B7WQQB5K9P}"
PROFILE="${NOTARY_PROFILE:-freshbit}"
PROV="${PROVISIONING_PROFILE:-FreshBit Mac Developer ID}"   # Developer ID profile with Sign in with Apple
REPO="NagulesGobi/freshbit-website"
SITE_A="$HOME/Apps/freshbit-website"
SITE_B="$HOME/Apps/dotxline-website/freshbit"
DMG_NAME="FreshBit.dmg"
URL="https://github.com/$REPO/releases/latest/download/$DMG_NAME"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
die() { printf '\n\033[31m%s\033[0m\n' "$*" >&2; exit 1; }

[ -f "$PROJ/project.yml" ] || die "No project.yml in $PROJ"
security find-identity -v -p codesigning | grep -q "Developer ID Application" ||
  die "No Developer ID Application certificate found. See the one-time setup at the top of this script."
xcrun notarytool history --keychain-profile "$PROFILE" >/dev/null 2>&1 ||
  die "No notarization profile \"$PROFILE\". See the one-time setup at the top of this script."
command -v gh >/dev/null || die "GitHub CLI (gh) is needed."

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

say "1/6 Generating the Xcode project"
( cd "$PROJ" && xcodegen generate --quiet )

say "2/6 Archiving a Release build"
xcodebuild -project "$PROJ/FreshBit.xcodeproj" -scheme FreshBit -configuration Release \
  -archivePath "$WORK/FreshBit.xcarchive" -destination 'generic/platform=macOS' \
  DEVELOPMENT_TEAM="$TEAM" CODE_SIGN_STYLE=Manual CODE_SIGN_IDENTITY="Developer ID Application" \
  PROVISIONING_PROFILE_SPECIFIER="$PROV" archive -quiet
cat > "$WORK/export.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>developer-id</string>
  <key>teamID</key><string>$TEAM</string>
  <key>signingStyle</key><string>manual</string>
  <key>signingCertificate</key><string>Developer ID Application</string>
  <key>provisioningProfiles</key><dict><key>com.nagulesgobi.freshbit.mac</key><string>$PROV</string></dict>
</dict></plist>
PLIST
xcodebuild -exportArchive -archivePath "$WORK/FreshBit.xcarchive" -exportOptionsPlist "$WORK/export.plist" \
  -exportPath "$WORK/export" -quiet
APP="$WORK/export/FreshBit.app"
VERSION="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' "$APP/Contents/Info.plist")"
BUILD="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleVersion' "$APP/Contents/Info.plist")"
MINOS="$(/usr/libexec/PlistBuddy -c 'Print :LSMinimumSystemVersion' "$APP/Contents/Info.plist" 2>/dev/null || echo 26.0)"
TAG="mac-v$VERSION"
gh release view "$TAG" --repo "$REPO" >/dev/null 2>&1 &&
  die "Release $TAG already exists. Raise MARKETING_VERSION in project.yml first."

say "3/6 Packaging $DMG_NAME (FreshBit $VERSION, build $BUILD)"
mkdir "$WORK/dmg"
cp -R "$APP" "$WORK/dmg/"
ln -s /Applications "$WORK/dmg/Applications"
hdiutil create -volname "FreshBit" -srcfolder "$WORK/dmg" -ov -format UDZO -quiet "$WORK/$DMG_NAME"
codesign --sign "Developer ID Application" --timestamp "$WORK/$DMG_NAME"

say "4/6 Notarizing with Apple (this can take a few minutes)"
xcrun notarytool submit "$WORK/$DMG_NAME" --keychain-profile "$PROFILE" --wait
xcrun stapler staple "$WORK/$DMG_NAME"
spctl -a -t open --context context:primary-signature -v "$WORK/$DMG_NAME"

say "5/6 Publishing GitHub release $TAG"
gh release create "$TAG" "$WORK/$DMG_NAME" --repo "$REPO" --latest \
  --title "FreshBit for Mac $VERSION" \
  --notes "FreshBit $VERSION (build $BUILD) for Mac. Requires macOS $MINOS on Apple silicon. Download: $URL"

say "6/6 Updating the website"
SIZE="$(stat -f%z "$WORK/$DMG_NAME")"
SHA="$(shasum -a 256 "$WORK/$DMG_NAME" | cut -d' ' -f1)"
DATE="$(date -u +%Y-%m-%d)"
JSON="{\"version\":\"$VERSION\",\"build\":\"$BUILD\",\"date\":\"$DATE\",\"size\":$SIZE,\"sha256\":\"$SHA\",\"minimumOS\":\"$MINOS\",\"arch\":\"Apple silicon\",\"url\":\"$URL\"}"
for SITE in "$SITE_A" "$SITE_B"; do
  [ -d "$SITE" ] || continue
  printf '%s\n' "$JSON" > "$SITE/mac.json"
  REPO_DIR="$(git -C "$SITE" rev-parse --show-toplevel)"
  git -C "$REPO_DIR" add "$SITE/mac.json"
  git -C "$REPO_DIR" commit -q -m "FreshBit for Mac $VERSION (build $BUILD)" -- "$SITE/mac.json"
  git -C "$REPO_DIR" push -q
done

say "Done. FreshBit $VERSION for Mac is live: $URL"
