# Swordbell

Workouts that become an RPG (formerly Iron Journey). Strength and HIIT training app for Android and iPhone: a periodized plan for your gym, workout logging with
double progression (the voice calls each next set with its reps and weight), a Cardio Studio with
guided intervals that tell you what to set on the machine in every part (speed and incline, level and
cadence, rower pace) and adapt to you, plus the coach's three cardio picks for the day (from what you
trained today and your cardio week), which you can do while watching a series (voice, beeps and
vibration keep coming with Netflix or YouTube in full screen), a physical assessment with periodic
re-tests timed for your level and goal (before × now against what was expected), an optional AI
coach with your own Anthropic key, and a hero's-journey layer with XP, levels, relics, bosses and an
Arsenal of weapons, shields, armour and powers that only training earns.

## Install on the phone (once)

Open **Releases** on the phone, tap **Swordbell.apk** in the latest release and open the
download. Android asks once to allow installs from Chrome. After that the app updates itself:
new versions arrive when you open it.

## How it is built

- `web/src/` — the app (plain HTML, CSS and JavaScript). `node tools/build.mjs` joins it into
  `web/www/index.html`.
- `native/` — the Android shell (Capacitor 8). The Android project is generated in CI; our parts are
  `native/android-src/` (the `IronTimer` plugin and its foreground service: timeline, text-to-speech,
  beeps, vibration, a notification with pause/skip/finish, opening streaming apps, backups and
  updates) and `native/configure-android.mjs`, which adds them to the generated project.
- `.github/workflows/android.yml` — on every push to `main`: build, run the app on an Android
  emulator (`native/ci/`), and if the checks pass publish a release with `Swordbell.apk`
  (also as `IronJourney.apk`, the name older versions download), `Swordbell-play.aab` for Google Play,
  `web.zip` (the automatic update) and `version.json`. Logs and screenshots go to the
  `ci-results` branch.
- Signing: every build derives the app's signing key from the `IJ_KEY_PASS` repository secret
  (`native/ci/signing-key.py`), so no key is stored anywhere. Keep that secret as it is: it is what
  lets a new APK install over the old one.

Workouts are stored only on the phone (Settings → Backup saves a copy). The AI key, if one is
added, also stays on the phone.

The name, icon and brand pictures (Gmail photo, mark, wordmark) are in `store/brand/`; the Google Play
page texts and images are in `store/google-play/`.
