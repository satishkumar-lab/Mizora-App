#!/usr/bin/env bash
set -euo pipefail

APP="${1:?Usage: verify-ios-codesign.sh /path/to/Mizora.app}"
EXPECTED_AUTH='Apple Development: its.satish@icloud.com (5VPT69HSF3)'

fail=0

check_signed() {
  local path="$1"
  local label="$2"
  if [[ ! -e "$path" ]]; then
    echo "FAIL: missing $label ($path)"
    fail=1
    return
  fi
  local out
  if ! out=$(codesign -dv --verbose=2 "$path" 2>&1); then
    echo "FAIL: $label — not signed"
    echo "$out"
    fail=1
    return
  fi
  if echo "$out" | grep -q "not signed at all"; then
    echo "FAIL: $label — not signed"
    fail=1
    return
  fi
  if ! echo "$out" | grep -q "Authority=${EXPECTED_AUTH}"; then
    echo "FAIL: $label — wrong or missing signing authority"
    echo "$out" | grep -E 'Authority=|TeamIdentifier=|not signed' || echo "$out"
    fail=1
    return
  fi
  echo "OK: $label"
}

echo "Verifying Mizora.app at: $APP"
echo "Expected authority: $EXPECTED_AUTH"
echo ""

check_signed "$APP" "Mizora.app"

FW="$APP/Frameworks"
if [[ -d "$FW" ]]; then
  for framework in "$FW"/*.framework; do
    [[ -d "$framework" ]] || continue
    check_signed "$framework" "$(basename "$framework")"
  done
fi

# Explicit paths requested
check_signed "$FW/React.framework" "React.framework"
check_signed "$FW/hermesvm.framework" "hermesvm.framework"
check_signed "$FW/ExpoFont.framework" "ExpoFont.framework"
check_signed "$FW/ExpoModulesWorklets.framework" "ExpoModulesWorklets.framework"
check_signed "$FW/ExpoModulesCore.framework" "ExpoModulesCore.framework"
check_signed "$FW/ExpoFileSystem.framework" "ExpoFileSystem.framework"

if ! codesign --verify --deep --strict "$APP" 2>/dev/null; then
  echo "FAIL: codesign --verify --deep --strict Mizora.app"
  codesign --verify --deep --strict "$APP" 2>&1 || true
  fail=1
else
  echo "OK: deep strict verify Mizora.app"
fi

echo ""
if [[ "$fail" -ne 0 ]]; then
  echo "SIGNING VERIFICATION FAILED — do not install."
  exit 1
fi
echo "All signing checks passed."
exit 0
