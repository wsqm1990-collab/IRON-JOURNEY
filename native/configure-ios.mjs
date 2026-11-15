// Turns the iOS project made by `npx cap add ios` into Iron Journey for iPhone: the native timer
// plugin and its screen, sound behind other apps, upright only, the icon and the launch image.
// Run from native/ after `npx cap add ios`:   node configure-ios.mjs
// For the TestFlight build it also sets the app's signing:   node configure-ios.mjs --sign TEAM "PROFILE NAME"
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IOS = process.env.IJ_IOS_DIR || path.join(HERE, 'ios');
const APP = path.join(IOS, 'App', 'App');
const PBX = path.join(IOS, 'App', 'App.xcodeproj', 'project.pbxproj');
const SRC = path.join(HERE, 'ios-src');

const read = f => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s);
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function fail(msg) { console.error('configure-ios: ' + msg); process.exit(1); }

/* ---------- Xcode project: add our files to the App target ----------
   Each new file goes next to a file the template already has (AppDelegate.swift for code,
   Assets.xcassets for resources): same group, same build phase. */
export function addFiles(pbx, names, { anchor, phase, type }) {
  const refLine = pbx.match(new RegExp('^([ \\t]*)([0-9A-F]{24}) /\\* ' + reEsc(anchor) + ' \\*/ = \\{isa = PBXFileReference;.*$', 'm'));
  const bldLine = pbx.match(new RegExp('^([ \\t]*)([0-9A-F]{24}) /\\* ' + reEsc(anchor) + ' in ' + phase + ' \\*/ = \\{isa = PBXBuildFile;.*$', 'm'));
  if (!refLine || !bldLine) {
    // Newer projects build every file in the App folder by themselves.
    if (/PBXFileSystemSynchronizedRootGroup/.test(pbx)) return { pbx, added: [], note: 'synchronized folder' };
    throw new Error(anchor + ' was not found in the Xcode project');
  }
  const [, ind, refId] = refLine, [, bInd, bldId] = bldLine;
  let n = 0;
  const newId = () => {
    for (;;) {
      const id = ('49524F4E' + (Date.now() % 1e8).toString(16).toUpperCase().padStart(8, '0') + (++n).toString(16).toUpperCase().padStart(8, '0')).slice(0, 24);
      if (!pbx.includes(id)) return id;
    }
  };
  const ins = (re, text, what) => {
    const m = pbx.match(re);
    if (!m) throw new Error('Xcode project: ' + what + ' not found');
    const at = m.index + m[0].length;
    pbx = pbx.slice(0, at) + '\n' + text + pbx.slice(at);
  };
  const added = [];
  for (const name of names) {
    if (pbx.includes(`/* ${name} */ = {isa = PBXFileReference;`)) continue;
    const r = newId(), b = newId();
    ins(new RegExp('^' + reEsc(refLine[0]) + '$', 'm'), `${ind}${r} /* ${name} */ = {isa = PBXFileReference; lastKnownFileType = ${type}; path = ${name}; sourceTree = "<group>"; };`, 'file list');
    ins(new RegExp('^' + reEsc(bldLine[0]) + '$', 'm'), `${bInd}${b} /* ${name} in ${phase} */ = {isa = PBXBuildFile; fileRef = ${r} /* ${name} */; };`, 'build file list');
    const child = pbx.match(new RegExp('^([ \\t]*)' + refId + ' /\\* ' + reEsc(anchor) + ' \\*/,$', 'm'));
    if (!child) throw new Error('Xcode project: the App group was not found');
    ins(new RegExp('^' + reEsc(child[0]) + '$', 'm'), `${child[1]}${r} /* ${name} */,`, 'App group');
    const inPhase = pbx.match(new RegExp('^([ \\t]*)' + bldId + ' /\\* ' + reEsc(anchor) + ' in ' + phase + ' \\*/,$', 'm'));
    if (!inPhase) throw new Error('Xcode project: the ' + phase + ' build phase was not found');
    ins(new RegExp('^' + reEsc(inPhase[0]) + '$', 'm'), `${inPhase[1]}${b} /* ${name} in ${phase} */,`, phase + ' phase');
    added.push(name);
  }
  return { pbx, added };
}
export const addSwiftFiles = (pbx, names) => addFiles(pbx, names, { anchor: 'AppDelegate.swift', phase: 'Sources', type: 'sourcecode.swift' });

/* ---------- Xcode project: build settings of the App target ---------- */
function appConfigIds(pbx) {
  const list = pbx.match(/\/\* Build configuration list for PBXNativeTarget "App" \*\/ = \{[\s\S]*?buildConfigurations = \(([\s\S]*?)\);/);
  if (!list) throw new Error('the App target build configurations were not found');
  const ids = {};
  for (const m of list[1].matchAll(/([0-9A-F]{24}) \/\* (\w+) \*\//g)) ids[m[2]] = m[1];
  return ids;
}
export function setBuildSettings(pbx, config, settings) {
  const id = appConfigIds(pbx)[config];
  if (!id) throw new Error('no ' + config + ' configuration for the App target');
  const start = pbx.search(new RegExp('^[ \\t]*' + id + ' /\\* ' + config + ' \\*/ = \\{', 'm'));
  if (start < 0) throw new Error('configuration ' + id + ' not found');
  const open = pbx.indexOf('buildSettings = {', start);
  const endBlock = pbx.indexOf('};', open); // settings lines end in ";", only the block itself in "};"
  let body = pbx.slice(open, endBlock);
  const lineInd = (body.match(/\n([ \t]*)[\w"]/) || [, '\t\t\t\t'])[1];
  for (const [k, v] of Object.entries(settings)) {
    const key = /^[A-Za-z0-9_]+$/.test(k) ? k : JSON.stringify(k);
    const val = /^[A-Za-z0-9_./]+$/.test(v) ? v : JSON.stringify(v);
    const re = new RegExp('\\n[ \\t]*' + reEsc(key) + ' = [^\\n]*;');
    const line = `\n${lineInd}${key} = ${val};`;
    if (re.test(body)) body = body.replace(re, line);
    else body = body.replace(/\n(\s*)$/, line + '\n$1');
  }
  return pbx.slice(0, open) + body + pbx.slice(endBlock);
}

/* ---------- Info.plist ---------- */
function plistValueRe(key) {
  return new RegExp('(\\s*<key>' + reEsc(key) + '</key>\\s*)(<(true|false)\\s*/>|<string>[\\s\\S]*?</string>|<integer>[^<]*</integer>|<array\\s*/>|<array>[\\s\\S]*?</array>|<dict\\s*/>)');
}
export function plistSet(xml, key, valueXml) {
  const re = plistValueRe(key);
  if (re.test(xml)) return xml.replace(re, (m, head) => head + valueXml);
  const at = xml.lastIndexOf('</dict>');
  if (at < 0) throw new Error('Info.plist has no dictionary');
  return xml.slice(0, at) + `\t<key>${key}</key>\n\t${valueXml}\n` + xml.slice(at);
}
const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pString = s => `<string>${xmlEsc(s)}</string>`;
const pBool = b => (b ? '<true/>' : '<false/>');
const pArray = items => `<array>\n${items.map(i => `\t\t<string>${xmlEsc(i)}</string>`).join('\n')}\n\t</array>`;

export function configurePlist(xml) {
  xml = plistSet(xml, 'CFBundleDisplayName', pString('Iron Journey'));
  // sound (voice, beeps) goes on while another app is on screen
  xml = plistSet(xml, 'UIBackgroundModes', pArray(['audio']));
  // upright only, like the Android app; on an iPad it then runs full screen
  xml = plistSet(xml, 'UISupportedInterfaceOrientations', pArray(['UIInterfaceOrientationPortrait']));
  xml = plistSet(xml, 'UISupportedInterfaceOrientations~ipad', pArray(['UIInterfaceOrientationPortrait', 'UIInterfaceOrientationPortraitUpsideDown']));
  xml = plistSet(xml, 'UIRequiresFullScreen', pBool(true));
  xml = plistSet(xml, 'UIRequiredDeviceCapabilities', pArray(['arm64']));
  // only standard HTTPS: no export paperwork for TestFlight
  xml = plistSet(xml, 'ITSAppUsesNonExemptEncryption', pBool(false));
  // to know which streaming and music apps are installed (Netflix, Spotify...)
  xml = plistSet(xml, 'LSApplicationQueriesSchemes', pArray(['nflx', 'aiv', 'disneyplus', 'hbomax', 'globoplay', 'youtube', 'crunchyroll', 'videos', 'spotify', 'youtubemusic', 'deezer', 'music', 'amznmp3']));
  return xml;
}

/* ---------- Main.storyboard: our view controller instead of Capacitor's ---------- */
export function configureStoryboard(xml) {
  let found = false;
  const out = xml.replace(/<viewController\b[^>]*customClass="CAPBridgeViewController"[^>]*>/, tag => {
    found = true;
    let t = tag.replace('customClass="CAPBridgeViewController"', 'customClass="MainViewController"');
    t = /customModule="/.test(t) ? t.replace(/customModule="[^"]*"/, 'customModule="App"') : t.replace('customClass=', 'customModule="App" customClass=');
    if (!/customModuleProvider=/.test(t)) t = t.replace('customModule="App"', 'customModule="App" customModuleProvider="target"');
    return t;
  });
  if (!found && !/customClass="MainViewController"/.test(xml)) throw new Error('the bridge view controller was not found in Main.storyboard');
  return out;
}

/* ---------- SceneDelegate.swift (Capacitor 8.5+): it creates the screen in code ---------- */
export function configureSceneDelegate(src) {
  if (src.includes('MainViewController()')) return src;
  if (!src.includes('CAPBridgeViewController()')) throw new Error('SceneDelegate.swift does not create CAPBridgeViewController()');
  return src.replace(/CAPBridgeViewController\(\)/g, 'MainViewController()');
}

/* ---------- icon and launch image ---------- */
function images() {
  const cat = path.join(APP, 'Assets.xcassets');
  const icon = path.join(cat, 'AppIcon.appiconset');
  fs.rmSync(icon, { recursive: true, force: true });
  fs.mkdirSync(icon, { recursive: true });
  fs.copyFileSync(path.join(SRC, 'AppIcon-1024.png'), path.join(icon, 'AppIcon-1024.png'));
  write(path.join(icon, 'Contents.json'), JSON.stringify({ images: [{ filename: 'AppIcon-1024.png', idiom: 'universal', platform: 'ios', size: '1024x1024' }], info: { author: 'xcode', version: 1 } }, null, 2));
  const splash = path.join(cat, 'Splash.imageset');
  fs.rmSync(splash, { recursive: true, force: true });
  fs.mkdirSync(splash, { recursive: true });
  fs.copyFileSync(path.join(SRC, 'Splash-2732.png'), path.join(splash, 'Splash-2732.png'));
  write(path.join(splash, 'Contents.json'), JSON.stringify({ images: [{ filename: 'Splash-2732.png', idiom: 'universal', scale: '1x' }], info: { author: 'xcode', version: 1 } }, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  if (!fs.existsSync(PBX)) fail('no iOS project at ' + IOS + ' (run `npx cap add ios` first)');
  let pbx = read(PBX);
  if (args[0] === '--sign') {
    const [, team, profile] = args;
    if (!team || !profile) fail('usage: --sign TEAM "PROFILE NAME"');
    pbx = setBuildSettings(pbx, 'Release', {
      CODE_SIGN_STYLE: 'Manual',
      DEVELOPMENT_TEAM: team,
      CODE_SIGN_IDENTITY: 'Apple Distribution',
      'CODE_SIGN_IDENTITY[sdk=iphoneos*]': 'Apple Distribution',
      PROVISIONING_PROFILE_SPECIFIER: profile,
    });
    write(PBX, pbx);
    console.log('signing set for Release (Apple Distribution, profile "' + profile + '")');
    return;
  }
  const swift = fs.readdirSync(SRC).filter(f => f.endsWith('.swift')).sort();
  for (const f of swift) fs.copyFileSync(path.join(SRC, f), path.join(APP, f));
  const r = addSwiftFiles(pbx, swift);
  // what the app does with "required reason" APIs (UserDefaults), which App Store Connect asks for
  fs.copyFileSync(path.join(SRC, 'PrivacyInfo.xcprivacy'), path.join(APP, 'PrivacyInfo.xcprivacy'));
  const res = addFiles(r.pbx, ['PrivacyInfo.xcprivacy'], { anchor: 'Assets.xcassets', phase: 'Resources', type: 'text.xml' });
  pbx = setBuildSettings(res.pbx, 'Debug', { TARGETED_DEVICE_FAMILY: '1,2' });
  pbx = setBuildSettings(pbx, 'Release', { TARGETED_DEVICE_FAMILY: '1,2' });
  write(PBX, pbx);
  console.log('Swift files: ' + swift.join(', ') + (r.added.length ? ' (added to the project)' : ' (' + (r.note || 'already in the project') + ')'));
  write(path.join(APP, 'Info.plist'), configurePlist(read(path.join(APP, 'Info.plist'))));
  console.log('Info.plist: background audio, upright only, display name, no export paperwork');
  // the screen: MainViewController instead of Capacitor's own (made in SceneDelegate.swift, or by Main.storyboard)
  const sd = path.join(APP, 'SceneDelegate.swift'), sb = path.join(APP, 'Base.lproj', 'Main.storyboard');
  if (fs.existsSync(sd)) { write(sd, configureSceneDelegate(read(sd))); console.log('SceneDelegate.swift: MainViewController'); }
  if (fs.existsSync(sb)) {
    const xml = read(sb);
    if (/customClass="CAPBridgeViewController"/.test(xml)) { write(sb, configureStoryboard(xml)); console.log('Main.storyboard: MainViewController'); }
    else if (!fs.existsSync(sd)) fail('neither SceneDelegate.swift nor Main.storyboard creates the app screen');
  }
  images();
  console.log('icon and launch image replaced');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { fail(e.message); }
}
