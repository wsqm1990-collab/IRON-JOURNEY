// Builds the app into web/www/index.html: one page with all styles and code inlined.
// Usage: node tools/build.mjs [buildNumber]   (CI passes BUILD_NUMBER)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'web', 'src'), out = path.join(root, 'web', 'www');
const build = Number(process.env.BUILD_NUMBER || process.argv[2] || 0);
const HEAD = ['01-head.html', '01b-journey.css', '01c-cardio.css'];
const BODY = ['02-body.html'];
const JS = ['02i-i18n.js', '02n-native.js', '03-data.js', '04-store.js', '05-ai.js', '05b-key.js', '05c-local-plan.js', '06-logic.js', '06b-carga.js',
  '07-views-a.js', '08-workout.js', '08b-cardio.js', '08c-guia.js', '08d-figura.js', '08e-musculos.js', '08f-pegada.js', '08g-casa.js', '09-coach-journey.js', '09b-evolucao.js', '09c-settings.js', '11-pixel.js', '11a-lpc-dados.js', '11b-lpc.js', '12-mundo.js', '10-app.js'];
const read = f => fs.readFileSync(path.join(src, f), 'utf8');
const head = HEAD.map(read).join('\n').replace(/<meta name="claude:[^>]*>\n?/g, '');
const body = BODY.map(read).join('\n');
const js = JS.map(f => `/* ===== ${f} ===== */\n` + read(f)).join('\n');
if (js.includes('</script')) throw new Error('a script contains </script>');

// If a freshly downloaded version can't start within 15 s, go back to the previous one.
const guard = `window.IJ_BUILD=${build};
setTimeout(function(){try{var tr=JSON.parse(localStorage.getItem('ij_trying')||'null');if(tr&&tr===window.IJ_BUILD&&!window.__ijOk){var C=window.Capacitor,p=window.capacitorExports&&capacitorExports.registerPlugin?capacitorExports.registerPlugin('IronTimer'):(C&&C.Plugins&&C.Plugins.IronTimer);if(p)p.reloadApp();}}catch(e){}},15000);`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,-apple-system,"Segoe UI",sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body}
<script src="capacitor.js"></script>
<script>${guard}</script>
<script>
${js}
</script>
</body>
</html>
`;
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
// the characters' pixel art (web/art) goes next to the page
const art = path.join(root, 'web', 'art');
fs.rmSync(path.join(out, 'art'), { recursive: true, force: true });
if (fs.existsSync(art)) fs.cpSync(art, path.join(out, 'art'), { recursive: true });
console.log(`web/www/index.html: build ${build}, ${(html.length / 1024).toFixed(0)} KB`);
