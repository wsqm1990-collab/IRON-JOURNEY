// Walks through the installed app on the emulator through Chrome DevTools (the debug build
// allows it) and checks the native parts: rest timer, HIIT voice cues in the background,
// the notification, settings and the automatic update. Writes results.json and screenshots.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const OUT = process.argv[2] || 'test-out';
const PKG = process.argv[3] || 'com.wsqm1990.ironjourney';
const UP = Number(process.argv[4] || 0);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const adb = (...a) => (spawnSync('adb', a, { encoding: 'utf8', maxBuffer: 64 << 20 }).stdout || '');
const results = [];
function check(name, ok, info, fatal = true) {
  results.push({ name, ok: !!ok, fatal, info: info === undefined ? null : info });
  console.log(`${ok ? 'PASS' : fatal ? 'FAIL' : 'WARN'} ${name}${info === undefined ? '' : ' — ' + JSON.stringify(info).slice(0, 400)}`);
}
function screen(name) {
  const r = spawnSync('adb', ['exec-out', 'screencap', '-p'], { maxBuffer: 64 << 20 });
  if (r.stdout && r.stdout.length > 1000) fs.writeFileSync(`${OUT}/${name}.png`, r.stdout);
}
const logcat = () => adb('logcat', '-d', '-s', 'IronTimer:*');

class CDP {
  constructor(url) { this.url = url; this.id = 0; this.pending = new Map(); this.events = []; }
  open() {
    return new Promise((res, rej) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => res();
      this.ws.onerror = e => rej(new Error('websocket error ' + (e && e.message)));
      this.ws.onmessage = e => {
        const m = JSON.parse(e.data);
        if (m.id && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
        else this.events.push(m);
      };
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); rej(new Error('timeout ' + method)); } }, 30000); });
  }
  close() { try { this.ws.close(); } catch { /* closed */ } }
}

let cdp = null;
async function connect() {
  if (cdp) cdp.close();
  for (let i = 0; i < 40; i++) {
    const pid = adb('shell', 'pidof', PKG).trim().split(/\s+/)[0];
    if (pid) {
      adb('forward', '--remove-all');
      adb('forward', 'tcp:9222', `localabstract:webview_devtools_remote_${pid}`);
      try {
        const list = await (await fetch('http://127.0.0.1:9222/json')).json();
        const page = list.find(t => t.type === 'page' && /localhost/.test(t.url));
        if (page) {
          cdp = new CDP(page.webSocketDebuggerUrl);
          await cdp.open();
          await cdp.send('Runtime.enable');
          return page;
        }
      } catch { /* not ready */ }
    }
    await sleep(1000);
  }
  throw new Error('could not reach the app WebView');
}
async function ev(expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text);
  return r.result.value;
}
const q = s => JSON.stringify(s);
const click = async (sel, wait = 250) => { await ev(`(() => { const el = document.querySelector(${q(sel)}); if (!el) throw new Error('missing ' + ${q(sel)}); el.click(); return true; })()`); await sleep(wait); };
const clickNth = async (sel, n, wait = 150) => { await ev(`(() => { const el = document.querySelectorAll(${q(sel)})[${n}]; if (!el) throw new Error('missing ' + ${q(sel)}); el.click(); return true; })()`); await sleep(wait); };
const fill = async (sel, v) => { await ev(`(() => { const el = document.querySelector(${q(sel)}); el.value = ${q(v)}; el.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`); await sleep(100); };
async function waitFor(expr, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { try { if (await ev(expr)) return true; } catch { /* page busy */ } await sleep(300); }
  return false;
}
const A = (a, extra = '') => `[data-a="${a}"]${extra}`;
const pronto = () => waitFor(`typeof window.IJ_BUILD === 'number' && typeof perfil === 'function' && typeof S === 'object' && S.ready`, 40000);
function jsErrors() {
  return cdp.events.filter(m => m.method === 'Runtime.exceptionThrown').map(m => (m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description) || m.params.exceptionDetails.text)
    .concat(cdp.events.filter(m => m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error').map(m => m.params.args.map(a => a.value || a.description).join(' ')));
}

async function main() {
  await connect();
  await pronto();
  check('app opens to the welcome screen', await waitFor(`!!document.querySelector('[data-a="novoPerfil"]')`, 30000));
  check('native bridge is on', await ev('Nat.on'), await ev('({ build: window.IJ_BUILD, ua: navigator.userAgent })'));
  check('page fills the screen without sideways scroll', await ev('document.documentElement.scrollWidth <= innerWidth + 1'), await ev('[document.documentElement.scrollWidth, innerWidth]'));
  screen('01-welcome');

  // profile wizard (same answers a person would give)
  await click(A('novoPerfil')); await fill('#wz-nome', 'Walter'); await click(A('wzAvancar'));
  await click(A('wzSet', '[data-v="hipertrofia"]')); await click(A('wzAvancar'));
  await click(A('wzToggle', '[data-v="costas"]')); await click(A('wzAvancar'));
  await click(A('wzSet', '[data-v="intermediario"]')); await click(A('wzAvancar'));
  await click(A('wzAvancar')); await fill('#wz-idade', '35'); await click(A('wzAvancar'));
  await click(A('wzToggle', '[data-v="joelho"]')); await click(A('wzAvancar'));
  await click(A('wzToggle', '[data-v="bike"]')); await click(A('wzAvancar')); await click(A('wzAvancar'));
  check('profile saved, gym screen shown', await waitFor(`!!document.querySelector('#gym-outros')`));
  for (let g = 0; g < 4; g++) await clickNth(A('gymTodos'), g);
  await click(A('gymSalvar'));
  await waitFor(`!!document.querySelector('[data-a="gerar"]')`);
  screen('02-before-plan');
  await click(A('gerar'), 800);
  const plano = await ev(`(() => { const p = plano(S.me); return p && { nome: p.programa.nome, dias: p.programa.dias.length, exs: p.programa.dias.map(d => d.exercicios.length) }; })()`);
  check('built-in plan created without an AI key', plano && plano.dias === 4, plano);
  screen('03-plan');

  // strength workout: a set starts the rest timer on the phone
  await click('.tab[data-tab="hoje"]'); await click(A('iniciar'), 600);
  await fill('#kg-0-0', '60'); await fill('#rp-0-0', '10');
  await click('[data-a="ok"][data-i="0"][data-j="0"]', 1500);
  const rest = await ev(`Nat.call('getState')`);
  check('rest timer runs on the phone', rest && rest.running && rest.kind === 'rest', rest);
  screen('04-rest');
  adb('shell', 'cmd', 'statusbar', 'expand-notifications'); await sleep(1500); screen('05-rest-notification'); adb('shell', 'cmd', 'statusbar', 'collapse'); await sleep(500);
  await click(A('restFechar'), 800);
  const rest2 = await ev(`Nat.call('getState')`);
  check('closing the rest bar stops the phone timer', rest2 && !rest2.running, rest2);
  await click(A('finalizar')); await click(A('finSens', '[data-v="ok"]')); await click(A('salvarTreino'), 800);
  screen('06-reward');
  await click('#sheet ' + A('fecharSheet'));

  // HIIT with the app in the background: the phone keeps the timeline and talks
  await click('.tab[data-tab="cardio"]');
  await ev(`(() => { iniciarPlayer({ id: 'h3030', maq: 'bike', sessao: '', titulo: 'E2E HIIT', segs: [seg('warm', 8), seg('work', 8), seg('rest', 8), seg('work', 8), seg('cool', 8)] }); return true; })()`);
  await sleep(2500);
  const h = await ev(`Nat.call('getState')`);
  check('HIIT timeline handed to the phone', h && h.running && h.kind === 'hiit', h);
  screen('07-player');
  adb('shell', 'input', 'keyevent', 'KEYCODE_HOME');
  await sleep(5000);
  adb('shell', 'cmd', 'statusbar', 'expand-notifications'); await sleep(1500); screen('08-hiit-notification-background'); adb('shell', 'cmd', 'statusbar', 'collapse');
  await sleep(36000);
  const lc = logcat();
  fs.writeFileSync(`${OUT}/logcat-irontimer-hiit.txt`, lc);
  const cues = (lc.match(/cue seg=\d/g) || []);
  check('voice/beep cues fired while another app was in front', cues.length >= 3, cues);
  check('workout finished by itself in the background', /finish complete=true kind=hiit/.test(lc));
  check('text-to-speech spoke', /speak result=0/.test(lc), (lc.match(/tts init status=-?\d+|speak result=-?\d+/g) || []).slice(0, 6), false);
  adb('shell', 'am', 'start', '-n', `${PKG}/.MainActivity`);
  await sleep(3000);
  await connect();
  await pronto();
  const depois = await waitFor(`!P.on && !!document.querySelector('[data-a="cfSalvar"]')`, 10000);
  check('back in the app, the cardio log opens to save the session', depois);
  screen('09-after-hiit');
  if (depois) { await click(A('cfSalvar'), 600); await ev(`(() => { const b = document.querySelector('#sheet [data-a="fecharSheet"]'); if (b) b.click(); return true; })()`); }

  // settings, look and the coach without a key
  await click('#langBtn', 800);
  check('settings show the background permissions', await waitFor(`(document.querySelector('#bgStatus') || {}).textContent.length > 20`, 5000));
  screen('10-settings');
  await click(A('setTema', '[data-v="dark"]'), 500); screen('11-settings-dark');
  await click(A('setTema', '[data-v="system"]'), 300);
  await click('#sheet ' + A('fecharSheet'));
  await click('.tab[data-tab="coach"]'); screen('12-coach');
  await click('.tab[data-tab="cardio"]'); await click(A('stModo', '[data-v="assistir"]')); screen('13-watch');
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK'); await sleep(800);
  check('Android back button goes to Today instead of closing', (await ev('S.tab')) === 'hoje', await ev('S.tab'));
  screen('14-today');

  // keyboard: a focused input must stay visible above the keyboard
  await click('.tab[data-tab="coach"]');
  await click('#langBtn', 600);
  await ev(`(() => { const i = document.querySelector('#key-in'); i.scrollIntoView({ block: 'center' }); return true; })()`);
  await sleep(600);
  // tap the field like a finger would (its position on screen comes from the accessibility tree)
  adb('shell', 'uiautomator', 'dump', '/sdcard/ui.xml');
  const ui = adb('shell', 'cat', '/sdcard/ui.xml');
  const field = ui.match(/class="android\.widget\.EditText"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  if (field) adb('shell', 'input', 'tap', String((+field[1] + +field[3]) >> 1), String((+field[2] + +field[4]) >> 1));
  else {
    const r = await ev(`(() => { const b = document.querySelector('#key-in').getBoundingClientRect(); return { x: (b.left + b.right) / 2 * devicePixelRatio, y: (b.top + b.bottom) / 2 * devicePixelRatio }; })()`);
    adb('shell', 'input', 'tap', String(Math.round(r.x)), String(Math.round(r.y + 60)));
  }
  await sleep(1800);
  screen('15-keyboard');
  const vis = await ev(`(() => { const r = document.querySelector('#key-in').getBoundingClientRect(); const vv = window.visualViewport; return { top: r.top, bottom: r.bottom, vh: vv ? vv.height : innerHeight, ih: innerHeight }; })()`);
  check('focused field is not hidden by the keyboard', vis.bottom <= vis.vh + 2, vis, false);
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK'); await sleep(400);
  await ev(`(() => { closeSheet(); return true; })()`);

  // automatic update: switch to a newer copy of the page, then restart the app
  if (UP) {
    const zip = 'upd.zip';
    if (fs.existsSync(zip)) {
      adb('push', zip, '/data/local/tmp/upd.zip');
      adb('shell', `cat /data/local/tmp/upd.zip | run-as ${PKG} sh -c 'mkdir -p files/bundles && cat > files/upd.zip && rm -rf files/bundles/e2e && mkdir files/bundles/e2e && cd files/bundles/e2e && unzip -q -o ../../upd.zip && ls'`);
      const dir = `/data/user/0/${PKG}/files/bundles/e2e`;
      await ev(`(() => { LS.set('ij_staged', { build: ${UP}, path: ${q(dir)} }); return aplicarAtualizacao(); })()`);
      await sleep(6000);
      await connect();
      await pronto();
      const b1 = await ev('window.IJ_BUILD');
      check('update: app switched to the new version', b1 === UP, b1, false);
      await sleep(5000);
      check('update: new version confirmed itself', (await ev(`LS.get('ij_trying')`)) == null, await ev(`LS.get('ij_trying')`), false);
      adb('shell', 'am', 'force-stop', PKG); await sleep(1000);
      adb('shell', 'am', 'start', '-n', `${PKG}/.MainActivity`); await sleep(5000);
      await connect();
      check('update: app starts again after a restart', await pronto(), null, false);
      // the kept version is opened right after start (the APK's own page may show for a moment)
      await waitFor(`window.IJ_BUILD === ${UP}`, 20000);
      await sleep(1500); await connect(); await pronto();
      const b2 = await ev('window.IJ_BUILD');
      check('update: still on the new version after restarting', b2 === UP, b2, false);
      check('update: data kept after the update', await ev(`!!perfil() && !!plano(S.me)`), null, false);
      screen('16-after-update');
    }
  }

  // real download of the latest published update, when there is one
  try {
    const t = await ev(`Nat.call('fetchText', { url: UPD.url }).then(r => r.text)`);
    const v = JSON.parse(t);
    const r = await ev(`Nat.call('fetchBundle', { url: ${q(v.zip)}, build: 'net-test', sha256: ${q(v.sha256 || '')} })`);
    check('update: downloads the latest published version', !!(r && r.path), r, false);
  } catch (e) { check('update: downloads the latest published version', false, String(e.message || e), false); }

  const excecoes = cdp.events.filter(m => m.method === 'Runtime.exceptionThrown').map(m => (m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description) || m.params.exceptionDetails.text);
  check('no uncaught JavaScript errors', excecoes.length === 0, excecoes.slice(0, 10));
  const avisos = jsErrors().filter(e => !/capacitor\.js|favicon/i.test(e) && !excecoes.includes(e));
  check('no console errors (plugin refusals are logged here)', avisos.length === 0, avisos.slice(0, 10), false);
}

try { await main(); } catch (e) { check('test ran to the end', false, String((e && e.stack) || e)); screen('99-crash'); }
fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 1));
const failed = results.filter(r => !r.ok && r.fatal);
fs.writeFileSync(`${OUT}/summary.txt`, results.map(r => `${r.ok ? 'PASS' : r.fatal ? 'FAIL' : 'WARN'} ${r.name}`).join('\n') + '\n');
console.log(`\n${results.length - failed.length}/${results.length} checks passed (warnings don't block)`);
if (cdp) cdp.close();
process.exit(failed.length ? 1 : 0);
