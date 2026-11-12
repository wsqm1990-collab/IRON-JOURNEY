/* ---------- pixel art ----------
   Map scenery and items are drawn by the app on a small grid from simple shapes, then outlined.
   Grids become PNGs once (canvas) and are cached; the browser scales them up with crisp pixels.
   The characters (heroes, mentor, monsters) are artists' pixel art: see 11b-lpc.js. */
const PX = {
  linha: '#1B1D26', olho: '#1B1D26',
  madeira: '#8B5A2B', ferro: '#9AA3AD', aco: '#D0D7DE', ouro: '#E2B33C', lenda: '#8FE3FF', couro: '#8A5A33',
};
const hex2rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb2hex = c => '#' + c.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
const escurece = (h, k = 0.75) => rgb2hex(hex2rgb(h).map(v => v * k));
const clareia = (h, k = 0.3) => rgb2hex(hex2rgb(h).map(v => v + (255 - v) * k));
const mistura = (a, b, k) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map((v, i) => v + (y[i] - v) * k)); };

function grade(w, h) { return { w, h, px: new Array(w * h).fill(null) }; }
const gp = (g, x, y) => (x < 0 || y < 0 || x >= g.w || y >= g.h ? null : g.px[y * g.w + x]);
function pinta(g, x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < g.w && y < g.h && c) g.px[y * g.w + x] = c; }
function ret(g, x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) pinta(g, x + i, y + j, c); }
function elipse(g, cx, cy, rx, ry, c, filtro) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    const dx = (x - cx) / (rx + 0.35), dy = (y - cy) / (ry + 0.35);
    if (dx * dx + dy * dy <= 1 && (!filtro || filtro(x, y))) pinta(g, x, y, c);
  }
}
function apaga(g, cx, cy, rx, ry) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    const dx = (x - cx) / (rx + 0.35), dy = (y - cy) / (ry + 0.35);
    if (dx * dx + dy * dy <= 1 && x >= 0 && y >= 0 && x < g.w && y < g.h) g.px[y * g.w + x] = null;
  }
}
function linha(g, x0, y0, x1, y1, c, e = 1) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n, y = y0 + ((y1 - y0) * i) / n; ret(g, Math.round(x - (e - 1) / 2), Math.round(y - (e - 1) / 2), e, e, c); }
}
/* dark outline around everything that was drawn */
function contorno(g, c = PX.linha) {
  const out = g.px.slice();
  for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
    if (gp(g, x, y)) continue;
    if (gp(g, x - 1, y) || gp(g, x + 1, y) || gp(g, x, y - 1) || gp(g, x, y + 1)) out[y * g.w + x] = c;
  }
  g.px = out;
  return g;
}
function espelha(g) { const o = grade(g.w, g.h); for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) o.px[y * g.w + x] = g.px[y * g.w + (g.w - 1 - x)]; return o; }
function cola(dst, src, ox, oy) { for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) { const c = src.px[y * src.w + x]; if (c) pinta(dst, ox + x, oy + y, c); } }
const PX_CACHE = new Map();
function gradeCanvas(g) {
  const cv = document.createElement('canvas'); cv.width = g.w; cv.height = g.h;
  const ctx = cv.getContext('2d'), img = ctx.createImageData(g.w, g.h);
  g.px.forEach((c, i) => { if (!c) return; const [r, gg, b] = hex2rgb(c.slice(0, 7)); const a = c.length > 7 ? parseInt(c.slice(7, 9), 16) : 255; img.data.set([r, gg, b, a], i * 4); });
  ctx.putImageData(img, 0, 0);
  return cv;
}
/* a cached sprite: {cv: canvas, url: data URL} built once per key */
function sprite(chave, fazer) {
  if (PX_CACHE.has(chave)) return PX_CACHE.get(chave);
  const cv = gradeCanvas(fazer()), s = { chave, cv, w: cv.width, h: cv.height, get url() { return this._u || (this._u = cv.toDataURL('image/png')); } };
  PX_CACHE.set(chave, s);
  return s;
}
const imgPx = (s, cls = '', alt = '') => `<img class="px ${cls}" src="${s.url}" width="${s.w}" height="${s.h}" alt="${esc(alt)}"${alt ? '' : ' aria-hidden="true"'}>`;

/* ---------- classes (the hero itself is drawn in 11b-lpc.js) ---------- */
const CLASSES = {
  forca: { id: 'guerreiro', arma: 'espada', nome: ['Warrior', 'Guerreiro', 'Guerrero'] },
  hipertrofia: { id: 'paladino', arma: 'maca', nome: ['Paladin', 'Paladino', 'Paladín'] },
  emagrecer: { id: 'cacador', arma: 'arco', nome: ['Ranger', 'Caçador', 'Cazador'] },
  saude: { id: 'monge', arma: 'cajado', nome: ['Monk', 'Monge', 'Monje'] },
};
const classeDe = obj => CLASSES[obj] || CLASSES.hipertrofia;
/* armour goes up with the level */
const tierDe = nivel => (nivel >= 16 ? 5 : nivel >= 12 ? 4 : nivel >= 8 ? 3 : nivel >= 5 ? 2 : nivel >= 3 ? 1 : 0);

/* ---------- items: the relics as little pixel objects ---------- */
function itemGrade(tipo, cor) {
  const g = grade(14, 14), esc2 = escurece(cor, 0.7), luz2 = clareia(cor, 0.45);
  switch (tipo) {
    case 'mapa': ret(g, 2, 3, 10, 8, '#E9DDB8'); ret(g, 2, 3, 1, 8, '#C9B98F'); linha(g, 4, 9, 9, 5, '#C73E3E'); pinta(g, 9, 5, '#C73E3E'); break;
    case 'pergaminho': ret(g, 3, 2, 8, 10, '#E9DDB8'); ret(g, 2, 2, 10, 2, '#C9B98F'); ret(g, 2, 10, 10, 2, '#C9B98F'); ret(g, 5, 5, 4, 1, '#8C7A55'); ret(g, 5, 7, 4, 1, '#8C7A55'); break;
    case 'bota': ret(g, 4, 2, 4, 7, cor); ret(g, 4, 9, 7, 3, cor); ret(g, 4, 2, 4, 1, luz2); ret(g, 4, 11, 7, 1, esc2); break;
    case 'anilha': elipse(g, 7, 7, 5.5, 5.5, cor); elipse(g, 5, 4, 1.6, 1, luz2); apaga(g, 7, 7, 1.2, 1.2); break;
    case 'cinto': ret(g, 1, 5, 12, 4, '#7A4E2C'); ret(g, 5, 4, 4, 6, cor); ret(g, 6, 5, 2, 4, esc2); break;
    case 'amuleto': linha(g, 3, 1, 7, 6, '#C9B98F'); linha(g, 11, 1, 7, 6, '#C9B98F'); elipse(g, 7, 9, 3, 3, cor); pinta(g, 6, 8, luz2); break;
    case 'coroa': ret(g, 2, 6, 10, 5, cor); [2, 6, 10].forEach(x => ret(g, x, 3, 2, 3, cor)); pinta(g, 7, 8, '#C73E3E'); ret(g, 2, 10, 10, 1, esc2); break;
    case 'calice': ret(g, 3, 2, 8, 4, cor); elipse(g, 7, 5, 4, 2.5, cor, (x, y) => y >= 5); ret(g, 6, 7, 2, 4, cor); ret(g, 4, 11, 6, 1, cor); ret(g, 4, 2, 6, 1, luz2); break;
    case 'elixir': ret(g, 6, 1, 2, 3, '#C9B98F'); elipse(g, 7, 8, 4, 4, '#E8F4FF'); elipse(g, 7, 9, 3.2, 3, cor, (x, y) => y >= 7); pinta(g, 5, 6, '#FFFFFF'); break;
    case 'pulmao': elipse(g, 3.5, 8, 2.6, 4.4, cor); elipse(g, 10.5, 8, 2.6, 4.4, cor); linha(g, 7, 1, 7, 6, esc2); linha(g, 7, 6, 4, 8, esc2); linha(g, 7, 6, 10, 8, esc2); break;
    case 'coracao': ['.XX..XX.', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', '.XXXXXX.', '..XXXX..', '...XX...'].forEach((r, y) => [...r].forEach((c, x) => { if (c === 'X') ret(g, 1 + x * 1.5, 2 + y * 1.5, 2, 2, cor); })); pinta(g, 3, 4, luz2); pinta(g, 4, 3, luz2); break;
    case 'medalha': linha(g, 4, 0, 6, 5, '#3B6FD9', 2); linha(g, 10, 0, 8, 5, '#C73E3E', 2); elipse(g, 7, 9, 3.6, 3.6, cor); pinta(g, 6, 8, luz2); break;
    case 'selo': elipse(g, 7, 7, 5, 5, cor); elipse(g, 7, 7, 2.5, 2.5, esc2); break;
    case 'laco': elipse(g, 5, 7, 3.5, 3.5, cor); apaga(g, 5, 7, 1.6, 1.6); elipse(g, 9, 7, 3.5, 3.5, esc2, (x, y) => Math.hypot(x - 9, y - 7) > 2.2); break;
    case 'bau': ret(g, 1, 5, 12, 7, '#9B6332'); ret(g, 1, 3, 12, 3, '#B5763F'); ret(g, 1, 7, 12, 1, cor); ret(g, 6, 6, 2, 3, cor); break;
    case 'gema': elipse(g, 7, 7, 4, 5, cor); pinta(g, 6, 4, '#FFFFFF'); pinta(g, 5, 5, luz2); break;
    case 'trofeu': ret(g, 4, 2, 6, 5, cor); elipse(g, 7, 5, 3, 3, cor, (x, y) => y >= 5); ret(g, 6, 8, 2, 3, cor); ret(g, 4, 11, 6, 2, esc2); ret(g, 2, 3, 2, 2, cor); ret(g, 10, 3, 2, 2, cor); break;
    case 'martelo': linha(g, 3, 12, 8, 5, PX.madeira, 2); ret(g, 6, 1, 7, 5, cor); ret(g, 6, 1, 7, 1, luz2); break;
    case 'espada': linha(g, 5, 8, 12, 1, cor, 2); linha(g, 6, 7, 12, 1, luz2, 1); linha(g, 3, 6, 7, 10, '#C99A2E', 2); linha(g, 4, 9, 1, 12, '#6B4A2E', 2); pinta(g, 1, 12, '#E2B33C'); break;
    case 'armadura': /* a breastplate: round shoulder plates, V neck, ridge down the middle, narrow waist */
      elipse(g, 3, 4, 2.2, 1.8, esc2); elipse(g, 10, 4, 2.2, 1.8, esc2); ret(g, 3, 3, 8, 7, cor); ret(g, 4, 10, 6, 2, cor);
      apaga(g, 6.5, 2.4, 1.4, 1.4); g.px[4 * g.w + 6] = null; g.px[4 * g.w + 7] = null;
      ret(g, 6, 5, 2, 4, esc2); ret(g, 4, 9, 6, 1, esc2); pinta(g, 6, 9, luz2); pinta(g, 7, 9, luz2); ret(g, 4, 4, 1, 4, luz2); pinta(g, 2, 3, luz2); pinta(g, 9, 3, luz2); break;
    case 'arco': for (let k = -5; k <= 5; k++) pinta(g, 4 + Math.round(4 - (k * k) / 6.5), 7 + k, cor); linha(g, 4, 2, 4, 12, '#E9E4D8'); linha(g, 2, 7, 12, 7, PX.aco); break;
    case 'cajado': linha(g, 7, 13, 7, 4, PX.madeira); elipse(g, 7, 3, 2.5, 2.5, cor); pinta(g, 6, 2, '#FFFFFF'); break;
    default: elipse(g, 7, 7, 4, 4, cor);
  }
  return contorno(g);
}
const itemSprite = (tipo, cor) => sprite('i:' + tipo + cor, () => itemGrade(tipo, cor));
