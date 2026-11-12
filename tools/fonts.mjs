// CI only: downloads the Google fonts the app uses and serves them from inside the app,
// so it looks right at a gym with no signal. If anything fails, the online fonts stay.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const www = path.join(root, process.argv[2] || 'web/www');
const file = path.join(www, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const links = [...html.matchAll(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/[^"]+)">/g)];
if (!links.length) { console.log('fonts: no Google font links'); process.exit(0); }
const UA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
fs.mkdirSync(path.join(www, 'fonts'), { recursive: true });
let css = '', n = 0;
try {
  for (const [, url] of links) {
    const text = await (await fetch(url.replace(/&amp;/g, '&'), { headers: { 'user-agent': UA } })).text();
    for (const block of text.split(/(?=\/\* [a-z-]+ \*\/)/)) {
      const subset = (block.match(/^\/\* ([a-z-]+) \*\//) || [])[1];
      if (subset && subset !== 'latin' && subset !== 'latin-ext') continue;
      let b = block;
      for (const [whole, fontUrl] of [...block.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)]) {
        const name = `f${++n}.woff2`;
        const buf = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
        if (buf.length < 1000) throw new Error('font too small: ' + fontUrl);
        fs.writeFileSync(path.join(www, 'fonts', name), buf);
        b = b.replace(whole, `url(${name})`);
      }
      css += b + '\n';
    }
  }
  fs.writeFileSync(path.join(www, 'fonts', 'fonts.css'), css);
  html = html.replace(/<link rel="preconnect"[^>]*>\n?/g, '');
  let first = true;
  html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/[^"]+">\n?/g, () => { if (first) { first = false; return '<link rel="stylesheet" href="fonts/fonts.css">\n'; } return ''; });
  fs.writeFileSync(file, html);
  console.log(`fonts: ${n} files bundled`);
} catch (e) {
  console.log('fonts: kept online fonts (' + e.message + ')');
}
