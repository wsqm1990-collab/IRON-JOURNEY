#!/usr/bin/env bash
# Runs the iPhone build on a simulator. The app tests its own native parts (IronSelfTest.swift):
# first launch in light mode, second launch in dark mode. When it asks for a screenshot (a .req
# file in its Documents/selftest folder) this script takes a real one, status bar included.
# Usage: native/ci/ios-sim-test.sh path/to/App.app OUTDIR
set -u
APP="$1"
OUT="${2:-ios-out}"
mkdir -p "$OUT"
BID=com.wsqm1990.ironjourney

# the newest plain iPhone (not Plus, Pro Max, mini...) on the newest iOS
UDID=$(xcrun simctl list devices available -j | python3 -c '
import json, re, sys
best = None
for runtime, devices in json.load(sys.stdin)["devices"].items():
    m = re.search(r"iOS-(\d+)-(\d+)", runtime)
    if not m:
        continue
    for d in devices:
        name = d.get("name", "")
        plain = re.fullmatch(r"iPhone \d+", name) is not None
        pro = re.fullmatch(r"iPhone \d+ Pro", name) is not None
        if not d.get("isAvailable", True) or not (plain or pro):
            continue
        num = int(re.search(r"\d+", name).group())
        key = (int(m.group(1)), int(m.group(2)), plain, num)
        if best is None or key > best[0]:
            best = (key, d["udid"], name, runtime)
if best:
    print(best[1])
    sys.stderr.write("simulator: %s on %s\n" % (best[2], best[3]))
')
if [ -z "$UDID" ]; then
  xcrun simctl list devices available > "$OUT/simulators.txt"
  echo "no iPhone simulator found" | tee "$OUT/errors.txt"
  exit 1
fi
xcrun simctl list devices | grep "$UDID" > "$OUT/simulator.txt"

xcrun simctl boot "$UDID" 2>/dev/null || true
xcrun simctl bootstatus "$UDID" -b > /dev/null 2>&1
xcrun simctl ui "$UDID" appearance light
xcrun simctl status_bar "$UDID" override --time "9:41" --dataNetwork wifi --wifiBars 3 --cellularBars 4 --batteryState charged --batteryLevel 100 2>/dev/null || true
if ! xcrun simctl install "$UDID" "$APP" > "$OUT/install.txt" 2>&1; then cat "$OUT/install.txt"; exit 1; fi
DATA=$(xcrun simctl get_app_container "$UDID" "$BID" data)
ST="$DATA/Documents/selftest"
mkdir -p "$ST"

run_phase() {
  local P="$1"
  rm -f "$ST/done-$P"
  xcrun simctl launch --terminate-running-process --stdout="$OUT/app-$P.out.txt" --stderr="$OUT/app-$P.log.txt" \
    "$UDID" "$BID" -ijSelfTest "$P" > "$OUT/launch-$P.txt" 2>&1
  local end=$((SECONDS + 420))
  while [ $SECONDS -lt $end ]; do
    for r in "$ST"/shot-*.req; do
      [ -e "$r" ] || continue
      local n
      n=$(basename "$r" .req)
      n=${n#shot-}
      xcrun simctl io "$UDID" screenshot "$OUT/$n.png" > /dev/null 2>&1
      rm -f "$r"
      touch "$ST/shot-$n.ok"
    done
    [ -e "$ST/done-$P" ] && return 0
    sleep 0.5
  done
  echo "phase $P did not finish in time" | tee -a "$OUT/errors.txt"
  return 1
}

run_phase 1
xcrun simctl terminate "$UDID" "$BID" 2>/dev/null || true
sleep 1
xcrun simctl ui "$UDID" appearance dark
run_phase 2
xcrun simctl terminate "$UDID" "$BID" 2>/dev/null || true

cp "$ST"/results-*.json "$OUT"/ 2>/dev/null
for f in "$ST"/page-*.png; do [ -e "$f" ] && cp "$f" "$OUT"/; done
xcrun simctl spawn "$UDID" log show --last 20m --style compact --predicate 'process == "App"' > "$OUT/system-log.txt" 2>&1 || true
grep -E "IronTimer|selftest|Capacitor|error|Error" "$OUT/system-log.txt" | tail -n 400 > "$OUT/system-log-app.txt" || true

python3 - "$OUT" <<'EOF'
import json, os, sys
out = sys.argv[1]
lines, bad = [], 0
for phase in ("1", "2"):
    path = os.path.join(out, "results-%s.json" % phase)
    if not os.path.exists(path):
        lines.append("FAIL phase %s: no results" % phase)
        bad += 1
        continue
    for c in json.load(open(path))["checks"]:
        ok = c.get("pass") is True
        bad += 0 if ok else 1
        detail = "" if ok else ": " + json.dumps(c.get("detail"), ensure_ascii=False)[:300]
        lines.append("%s %s%s" % ("PASS" if ok else "FAIL", c["name"], detail))
open(os.path.join(out, "selftest.txt"), "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
sys.exit(1 if bad else 0)
EOF
