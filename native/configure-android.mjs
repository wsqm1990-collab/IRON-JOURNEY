// Runs in CI after `npx cap add android`: adds our native code, icons, permissions,
// signing and version to the generated Android project. Prints what it changed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'android', 'app');
const main = path.join(app, 'src', 'main');
const res = path.join(main, 'res');
const pkgDir = path.join(main, 'java', 'com', 'wsqm1990', 'ironjourney');
const build = Number(process.env.BUILD_NUMBER || 1);

const read = f => fs.readFileSync(f, 'utf8');
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const must = (ok, what) => { if (!ok) { console.error('configure-android: could not ' + what); process.exit(1); } };
function copyTree(from, to) {
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyTree(a, b); else { fs.mkdirSync(to, { recursive: true }); fs.copyFileSync(a, b); }
  }
}

// 1. Java: the timer plugin, its service, and MainActivity that registers the plugin.
fs.mkdirSync(pkgDir, { recursive: true });
for (const f of fs.readdirSync(path.join(here, 'android-src', 'java'))) fs.copyFileSync(path.join(here, 'android-src', 'java', f), path.join(pkgDir, f));
console.log('java:', fs.readdirSync(pkgDir).join(', '));

// 2. Resources: icons, notification icon, splash. The template's splash PNGs go away
//    so our splash.xml (dark background + logo) is the only "splash".
for (const d of fs.readdirSync(res)) {
  const f = path.join(res, d, 'splash.png');
  if (d.startsWith('drawable') && fs.existsSync(f)) fs.rmSync(f);
}
copyTree(path.join(here, 'android-src', 'res'), res);
const fp = path.join(res, 'xml', 'file_paths.xml');
if (fs.existsSync(fp)) {
  let x = read(fp);
  if (!x.includes('<cache-path')) { x = x.replace('</paths>', '    <cache-path name="cache" path="." />\n</paths>'); write(fp, x); }
} else {
  write(fp, '<?xml version="1.0" encoding="utf-8"?>\n<paths xmlns:android="http://schemas.android.com/apk/res/android">\n    <cache-path name="cache" path="." />\n</paths>\n');
}
console.log('file_paths.xml:\n' + read(fp));

// 3. Manifest: permissions, the timer service, and the apps we can open.
const mf = path.join(main, 'AndroidManifest.xml');
let m = read(mf);
const perms = ['FOREGROUND_SERVICE', 'FOREGROUND_SERVICE_MEDIA_PLAYBACK', 'POST_NOTIFICATIONS', 'WAKE_LOCK', 'VIBRATE', 'REQUEST_IGNORE_BATTERY_OPTIMIZATIONS']
  .filter(p => !m.includes(`android.permission.${p}"`))
  .map(p => `    <uses-permission android:name="android.permission.${p}" />`).join('\n');
const apps = ['com.netflix.mediaclient', 'com.amazon.avod.thirdpartyclient', 'com.disney.disneyplus', 'com.wbd.stream', 'com.globo.globotv',
  'com.google.android.youtube', 'com.crunchyroll.crunchyroid', 'com.cbs.app', 'com.apple.atve.androidtv.appletv',
  'com.spotify.music', 'com.apple.android.music', 'com.google.android.apps.youtube.music', 'deezer.android.app', 'com.amazon.mp3'];
const queries = `    <queries>\n        <intent>\n            <action android:name="android.intent.action.TTS_SERVICE" />\n        </intent>\n${apps.map(a => `        <package android:name="${a}" />`).join('\n')}\n    </queries>`;
must(m.includes('<application'), 'find <application> in the manifest');
m = m.replace('<application', `${perms}\n${queries}\n\n    <application`);
must(m.includes('</application>'), 'find </application>');
m = m.replace('</application>', `    <service\n            android:name=".IronTimerService"\n            android:exported="false"\n            android:foregroundServiceType="mediaPlayback" />\n    </application>`);
if (!m.includes('windowSoftInputMode')) m = m.replace(/(<activity\b[^>]*android:name="\.?MainActivity")/, '$1\n            android:windowSoftInputMode="adjustResize"');
write(mf, m);
console.log('AndroidManifest.xml:\n' + m);

// 4. Gradle: version from the build number, no lint stop. (The release APK is signed after the build.)
const gf = ['build.gradle', 'build.gradle.kts'].map(f => path.join(app, f)).find(f => fs.existsSync(f));
must(gf && gf.endsWith('build.gradle'), 'find a Groovy app/build.gradle');
let g = read(gf);
g = g.replace(/versionCode\s+\d+/, `versionCode ${build}`).replace(/versionName\s+"[^"]*"/, `versionName "1.0.${build}"`);
must(g.includes(`versionCode ${build}`), 'set versionCode');
const lint = `    lint {
        checkReleaseBuilds false
        abortOnError false
    }
`;
must(/\n\s*buildTypes\s*\{/.test(g), 'find buildTypes');
g = g.replace(/(\n)(\s*buildTypes\s*\{)/, `$1${lint}$2`);
write(gf, g);
console.log('app/build.gradle:\n' + g);

// 5. Themes: follow the phone's light/dark mode (the page reads it), dark splash.
const sf = path.join(res, 'values', 'styles.xml');
if (fs.existsSync(sf)) {
  let s = read(sf);
  console.log('styles.xml before:\n' + s);
  s = s.replace(/Theme\.AppCompat\.Light\.DarkActionBar/g, 'Theme.AppCompat.DayNight.DarkActionBar')
    .replace(/Theme\.AppCompat\.Light\.NoActionBar/g, 'Theme.AppCompat.DayNight.NoActionBar')
    .replace(/"Theme\.AppCompat\.NoActionBar"/g, '"Theme.AppCompat.DayNight.NoActionBar"');
  s = s.replace(/(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)/, '$1\n        <item name="windowSplashScreenBackground">@color/ij_splash_bg</item>');
  write(sf, s);
  console.log('styles.xml after:\n' + s);
}

// 6. Show what Capacitor generated, to compare with expectations in the logs.
for (const f of ['variables.gradle', 'build.gradle'].map(x => path.join(here, 'android', x))) if (fs.existsSync(f)) console.log(path.basename(f) + ':\n' + read(f));
console.log('configure-android: done for build', build);
