# Iron Journey

Strength and HIIT training app for Android: a periodized plan for your gym, workout logging with
double progression, a Cardio Studio with guided intervals you can do while watching a series
(voice, beeps and vibration keep coming with Netflix or YouTube in full screen), an optional AI
coach with your own Anthropic key, and a hero's-journey layer with XP, levels and relics.

## Install on the phone (once)

Open **Releases** on the phone, tap **IronJourney.apk** in the latest release and open the
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
  emulator (`native/ci/`), and if the checks pass publish a release with `IronJourney.apk`,
  `web.zip` (the automatic update) and `version.json`. Logs and screenshots go to the
  `ci-results` branch.
- Signing: every build derives the app's signing key from the `IJ_KEY_PASS` repository secret
  (`native/ci/signing-key.py`), so no key is stored anywhere. Keep that secret as it is: it is what
  lets a new APK install over the old one.

Workouts are stored only on the phone (Settings → Backup saves a copy). The AI key, if one is
added, also stays on the phone.
