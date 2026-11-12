/* ---------- pixel art ----------
   Every sprite is drawn by the app on a small grid from simple shapes, then outlined, so the
   whole world shares one look and nothing comes from anyone else's art. Grids become PNGs once
   (canvas) and are cached; the browser scales them up with crisp pixels. */
const PX = {
  pele: ['#F6D2B5', '#E8B48F', '#C98E62', '#A0673F', '#7B4A2B', '#4E2E1C'],
  cabelo: ['#2B1D14', '#5A3A22', '#8C5A2B', '#D9A441', '#B5452A', '#9A9A9A', '#EDE6D6', '#3B6FD9', '#D95FA0'],
  roupa: ['#2F6FD6', '#D94A3A', '#2E9E5B', '#7E4BC9', '#E39B1E', '#1F9AA6', '#3A3F4B', '#D9D3C4'],
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

/* ---------- the hero ---------- */
const HEROI_PADRAO = { corpo: 0, pele: 1, cabelo: 0, corCabelo: 1, barba: 0, roupa: 0 };
const CLASSES = {
  forca: { id: 'guerreiro', arma: 'espada', nome: ['Warrior', 'Guerreiro', 'Guerrero'] },
  hipertrofia: { id: 'paladino', arma: 'maca', nome: ['Paladin', 'Paladino', 'Paladín'] },
  emagrecer: { id: 'cacador', arma: 'arco', nome: ['Ranger', 'Caçador', 'Cazador'] },
  saude: { id: 'monge', arma: 'cajado', nome: ['Monk', 'Monge', 'Monje'] },
};
const classeDe = obj => CLASSES[obj] || CLASSES.hipertrofia;
/* armour and weapon material go up with the level */
const tierDe = nivel => (nivel >= 16 ? 5 : nivel >= 12 ? 4 : nivel >= 8 ? 3 : nivel >= 5 ? 2 : nivel >= 3 ? 1 : 0);
const MATERIAL = [PX.madeira, PX.ferro, PX.ferro, PX.aco, PX.ouro, PX.lenda];
/* quadro: parado0, parado1, anda0, anda1, ataque, vitoria */
function heroiGrade(h, quadro = 'parado0', extra = {}) {
  const g = grade(24, 26), pele = PX.pele[h.pele] || PX.pele[1], cab = PX.cabelo[h.corCabelo] || PX.cabelo[1], roupa = PX.roupa[h.roupa] || PX.roupa[0];
  const tier = extra.tier || 0, arma = extra.arma || 'espada', mat = extra.material || MATERIAL[tier];
  const dy = quadro === 'parado1' || quadro === 'anda1' ? 1 : 0, fino = h.corpo === 1;
  const ox = 3;
  const calca = tier >= 2 ? '#454B57' : '#5B4636', bota = tier >= 4 ? escurece(PX.ouro, 0.7) : '#3A2A20';
  const peito = tier === 0 ? roupa : tier === 1 ? PX.couro : tier === 2 ? PX.ferro : tier === 3 ? PX.aco : PX.ouro;
  // cape (behind everything) from steel armour up
  if (tier >= 3) { ret(g, ox + 3, 13 + dy, 3, 9, escurece(roupa, 0.85)); ret(g, ox + 2, 17 + dy, 2, 6, escurece(roupa, 0.7)); }
  // legs and boots
  const pernas = quadro === 'anda0' ? [[6, 0], [10, 1]] : quadro === 'anda1' ? [[8, 1], [8, 0]] : [[7, 0], [9, 0]];
  pernas.forEach(([x, frente], i) => {
    const px0 = ox + x, cor = i === 0 ? escurece(calca, 0.8) : calca;
    ret(g, px0, 19, 2, 4, cor);
    ret(g, px0, 23, 3, 2, i === 0 ? escurece(bota, 0.8) : bota);
  });
  // back arm
  ret(g, ox + 6, 13 + dy, 2, 5, escurece(tier >= 2 ? peito : roupa, 0.7));
  // torso
  const tw = fino ? 5 : 6;
  ret(g, ox + 7, 12 + dy, tw, 7, peito);
  ret(g, ox + 7, 12 + dy, 1, 7, escurece(peito, 0.8));
  if (tier === 1 || tier === 2) ret(g, ox + 7 + tw - 2, 12 + dy, 2, 3, roupa);
  if (tier >= 2) { ret(g, ox + 9, 11 + dy, 4, 2, clareia(peito, 0.25)); }
  if (tier >= 4) { ret(g, ox + 7, 17 + dy, tw, 1, PX.ouro); pinta(g, ox + 9, 14 + dy, '#C73E3E'); }
  ret(g, ox + 7, 18 + dy, tw, 1, escurece(tier >= 2 ? calca : PX.couro, 0.9));
  // head
  const hx = ox + 10, hy = 7 + dy;
  elipse(g, hx, hy, 4.6, 4.4, pele);
  pinta(g, hx + 5, hy + 1, pele); // nose
  pinta(g, hx - 2, hy + 1, escurece(pele, 0.85)); // ear
  // hair
  const cabelo = (x, y) => pinta(g, x, y, cab), cabEsc = escurece(cab, 0.78);
  const topo = (x, y) => y <= hy - 1 || (x <= hx - 2 && y <= hy + 2);
  switch (h.cabelo) {
    case 0: elipse(g, hx, hy, 4.9, 4.7, cab, (x, y) => topo(x, y)); break; // short
    case 1: elipse(g, hx, hy, 4.9, 4.7, cab, (x, y) => topo(x, y)); [[hx - 3, hy - 6], [hx - 1, hy - 7], [hx + 1, hy - 6], [hx + 3, hy - 6], [hx - 5, hy - 4]].forEach(([x, y]) => { cabelo(x, y); cabelo(x, y + 1); }); break; // spiky
    case 2: elipse(g, hx, hy, 4.9, 4.7, cab, (x, y) => topo(x, y)); ret(g, hx - 5, hy, 3, 9, cab); ret(g, hx - 5, hy + 6, 2, 3, cabEsc); break; // long
    case 3: elipse(g, hx, hy, 4.9, 4.7, cab, (x, y) => topo(x, y)); elipse(g, hx - 3, hy - 5, 2, 2, cab); pinta(g, hx - 4, hy - 4, cabEsc); break; // bun
    case 4: elipse(g, hx, hy, 4.9, 4.7, cab, (x, y) => topo(x, y)); linha(g, hx - 5, hy - 1, hx - 7, hy + 6, cab, 2); break; // ponytail
    case 5: elipse(g, hx - 0.5, hy - 0.5, 5.6, 5.2, cab, (x, y) => !(x >= hx && y >= hy - 1)); [[hx - 5, hy - 3], [hx - 2, hy - 6], [hx + 2, hy - 5]].forEach(([x, y]) => pinta(g, x, y, cabEsc)); break; // curly
    default: break; // bald
  }
  // beard
  if (h.barba === 1) { ret(g, hx - 1, hy + 3, 5, 1, cab); ret(g, hx + 2, hy + 2, 3, 1, cab); }
  if (h.barba === 2) { elipse(g, hx + 1, hy + 3, 3.4, 2.4, cab, (x, y) => y >= hy + 2); ret(g, hx + 2, hy + 1, 3, 1, cab); }
  // eye
  pinta(g, hx + 2, hy, PX.olho); pinta(g, hx + 2, hy + 1, PX.olho); pinta(g, hx + 3, hy, '#FFFFFF');
  // helmet on gold and legendary armour
  if (tier >= 4) { elipse(g, hx, hy - 1, 5, 4.4, PX.ouro, (x, y) => y <= hy - 2); ret(g, hx - 1, hy - 7, 2, 2, '#C73E3E'); }
  // front arm, weapon
  const pulso = quadro === 'ataque' ? [ox + 17, 14 + dy] : quadro === 'vitoria' ? [ox + 14, 7 + dy] : [ox + 12, 18 + dy];
  const ombro = [ox + 11, 13 + dy];
  const manga = tier === 0 ? escurece(roupa, 0.88) : tier === 1 ? roupa : tier >= 4 ? PX.ouro : peito;
  linha(g, ombro[0], ombro[1], pulso[0] - (quadro === 'ataque' ? 1 : 0), pulso[1] - (quadro === 'parado0' || quadro === 'parado1' || quadro.startsWith('anda') ? 1 : 0), manga, 2);
  ret(g, pulso[0], pulso[1], 2, 2, pele);
  desenhaArma(g, arma, pulso[0] + 1, pulso[1] + 1, quadro, mat, roupa);
  contorno(g);
  if (tier >= 5) auraLendaria(g);
  return g;
}
function desenhaArma(g, arma, x, y, quadro, mat, roupa) {
  const brilho = clareia(mat, 0.45), cabo = PX.madeira;
  const atk = quadro === 'ataque', up = quadro === 'vitoria';
  if (arma === 'espada') {
    if (atk) { linha(g, x + 1, y, x + 6, y, mat, 1); linha(g, x + 1, y - 1, x + 6, y - 1, brilho, 1); ret(g, x, y - 2, 1, 4, escurece(mat, 0.7)); }
    else if (up) { linha(g, x, y - 1, x, y - 7, mat); linha(g, x + 1, y - 1, x + 1, y - 7, brilho); ret(g, x - 1, y, 4, 1, escurece(mat, 0.7)); }
    else { linha(g, x, y - 1, x + 3, y - 7, mat, 1); linha(g, x + 1, y - 1, x + 4, y - 7, brilho, 1); ret(g, x - 1, y - 1, 3, 1, escurece(mat, 0.7)); }
  } else if (arma === 'martelo') {
    const [hx, hy] = atk ? [x + 6, y - 1] : up ? [x, y - 8] : [x + 3, y - 7];
    linha(g, x, y, hx, hy + 1, cabo, 1);
    ret(g, hx - 1, hy - 2, 4, 4, mat); ret(g, hx - 1, hy - 2, 4, 1, brilho);
  } else if (arma === 'maca') {
    const [hx, hy] = atk ? [x + 5, y] : up ? [x, y - 6] : [x + 2, y - 5];
    linha(g, x, y, hx, hy, cabo, 1);
    elipse(g, hx, hy, 1.6, 1.6, mat); pinta(g, hx, hy - 2, brilho); pinta(g, hx + 2, hy, brilho);
    // shield on the far side
    elipse(g, x - 9, y - 4, 2.6, 3.4, roupa); elipse(g, x - 9, y - 4, 1.2, 1.8, mat);
  } else if (arma === 'arco') {
    const bx = atk ? x + 2 : x + 1;
    for (let k = -5; k <= 5; k++) pinta(g, bx + Math.round(2 - (k * k) / 12.5), y - 2 + k, cabo);
    linha(g, bx, y - 7, bx, y + 3, '#E9E4D8', 1);
    if (atk) linha(g, bx - 3, y - 2, bx + 6, y - 2, mat, 1);
  } else if (arma === 'cajado') {
    const topoY = up ? y - 10 : y - 9;
    linha(g, x, y + 4, x, topoY, cabo, 1);
    elipse(g, x, topoY - 1, 1.5, 1.5, mat === PX.madeira ? '#6FC3E8' : mat);
    pinta(g, x - 1, topoY - 2, '#FFFFFF');
  }
}
function auraLendaria(g) {
  const out = g.px.slice();
  for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
    if (gp(g, x, y)) continue;
    if ((gp(g, x - 1, y) === PX.linha || gp(g, x + 1, y) === PX.linha || gp(g, x, y - 1) === PX.linha) && (x + y) % 2 === 0) out[y * g.w + x] = '#FFE58A99';
  }
  g.px = out;
}
function heroiSprite(h, quadro, extra = {}) {
  const k = 'h:' + JSON.stringify([h.corpo, h.pele, h.cabelo, h.corCabelo, h.barba, h.roupa, quadro, extra.tier || 0, extra.arma || '', extra.material || '', extra.mentor ? 1 : 0]);
  return sprite(k, () => (extra.mentor ? mentorGrade(quadro) : heroiGrade(h, quadro, extra)));
}
/* the mentor: an old trainer-wizard with a white beard, a robe and a staff */
function mentorGrade(quadro) {
  const h = { corpo: 0, pele: 1, cabelo: 6, corCabelo: 6, barba: 2, roupa: 3 };
  const g = heroiGrade(h, quadro, { tier: 0, arma: 'cajado', material: '#7EE0C2' });
  const chapeu = grade(g.w, g.h), cor = '#5B3E9E', dy = quadro === 'parado1' ? 1 : 0;
  elipse(chapeu, 13, 3 + dy, 6, 1.4, cor);
  for (let i = 0; i < 6; i++) ret(chapeu, 10 + Math.floor(i / 2), -3 + i + dy, 6 - i, 1, cor);
  pinta(chapeu, 14, 1 + dy, '#FFD34D');
  contorno(chapeu);
  cola(g, chapeu, 0, 0);
  return g;
}

/* ---------- monsters and bosses ---------- */
const MONSTROS = ['slime', 'morcego', 'goblin', 'esqueleto', 'lobo', 'cogumelo'];
function monstroGrade(tipo, cor, quadro = 0) {
  const g = grade(22, 22), esc2 = escurece(cor, 0.72), luz2 = clareia(cor, 0.35);
  const olho = (x, y) => { pinta(g, x, y, '#FFFFFF'); pinta(g, x, y + 1, PX.olho); };
  if (tipo === 'slime') {
    const rx = quadro ? 8 : 7, ry = quadro ? 5 : 6;
    elipse(g, 11, 20 - ry, rx, ry, cor, (x, y) => y <= 20);
    elipse(g, 9, 17 - ry, 2, 1.4, luz2);
    olho(7, 15); olho(11, 15);
    ret(g, 4, 20, 14, 1, esc2);
  } else if (tipo === 'morcego') {
    const asa = quadro ? -3 : 2;
    elipse(g, 11, 11, 3.4, 3.6, cor);
    for (let i = 0; i < 6; i++) { linha(g, 8 - i, 10 + Math.round(asa * i / 6) - (i % 2), 8 - i, 13 + Math.round(asa * i / 6), esc2); linha(g, 14 + i, 10 + Math.round(asa * i / 6) - (i % 2), 14 + i, 13 + Math.round(asa * i / 6), esc2); }
    pinta(g, 9, 7, cor); pinta(g, 13, 7, cor);
    pinta(g, 10, 10, '#FFD34D'); pinta(g, 12, 10, '#FFD34D');
  } else if (tipo === 'goblin' || tipo === 'esqueleto') {
    const h = { corpo: 1, pele: 0, cabelo: 6, corCabelo: 0, barba: 0, roupa: 6 };
    const base = heroiGrade(h, quadro ? 'ataque' : 'parado0', { tier: 0, arma: tipo === 'goblin' ? 'espada' : 'maca', material: tipo === 'goblin' ? PX.ferro : '#BFB8A6' });
    const recor = espelha(base), pele0 = PX.pele[0];
    recor.px = recor.px.map(c => (c === pele0 ? (tipo === 'goblin' ? cor : '#E8E2CF') : c === escurece(pele0, 0.85) ? esc2 : c === PX.roupa[6] ? (tipo === 'goblin' ? '#6B4A2E' : '#2C2C34') : c));
    cola(g, recor, -2, -4);
    return g;
  } else if (tipo === 'lobo') {
    const p = quadro ? 1 : -1;
    elipse(g, 12, 13, 6.5, 3.4, cor);
    elipse(g, 5, 10, 3.2, 2.8, cor); ret(g, 1, 11, 3, 2, cor); pinta(g, 1, 11, PX.olho);
    pinta(g, 4, 6, cor); pinta(g, 4, 7, cor); pinta(g, 6, 6, cor); pinta(g, 6, 7, cor);
    pinta(g, 4, 9, '#FFD34D');
    [[7, p], [10, -p], [14, p], [17, -p]].forEach(([x, d]) => linha(g, x, 15, x + d, 19, esc2, 2));
    linha(g, 18, 12, 21, 9 + (quadro ? 1 : 0), cor, 2);
    ret(g, 9, 11, 7, 1, luz2);
  } else if (tipo === 'cogumelo') {
    const s = quadro ? 1 : 0;
    elipse(g, 11, 9 + s, 8, 5, cor, (x, y) => y <= 10 + s);
    [[7, 7], [12, 6], [15, 9]].forEach(([x, y]) => ret(g, x, y + s, 2, 2, '#FFFFFF'));
    ret(g, 8, 11 + s, 7, 8 - s, '#EADFC8');
    olho(9, 13 + s); olho(13, 13 + s);
    ret(g, 7, 19, 9, 1, '#C9BCA0');
  }
  return contorno(g);
}
const CHEFES = ['troll', 'golem', 'dragao'];
function chefeGrade(tipo, cor, quadro = 0) {
  const g = grade(40, 40), esc2 = escurece(cor, 0.72), luz2 = clareia(cor, 0.3);
  if (tipo === 'troll') {
    const b = quadro ? 1 : 0;
    elipse(g, 20, 22 + b, 11, 10, cor);
    elipse(g, 17, 10 + b, 6, 5.5, cor);
    pinta(g, 14, 9 + b, '#FFD34D'); pinta(g, 18, 9 + b, '#FFD34D');
    ret(g, 13, 13 + b, 7, 2, esc2); pinta(g, 14, 12 + b, '#F2EEE0'); pinta(g, 18, 12 + b, '#F2EEE0');
    ret(g, 13, 30, 5, 8, esc2); ret(g, 23, 30, 5, 8, esc2);
    linha(g, 9, 18 + b, 3, 27, cor, 4);
    linha(g, 3, 27, 2, 8, PX.madeira, 3); elipse(g, 2, 7, 3, 4, escurece(PX.madeira, 0.8));
    ret(g, 15, 27 + b, 11, 3, '#6B4A2E');
  } else if (tipo === 'golem') {
    const b = quadro ? 1 : 0;
    ret(g, 11, 13 + b, 18, 16, cor); ret(g, 11, 13 + b, 18, 2, luz2);
    ret(g, 15, 5 + b, 10, 8, cor); ret(g, 17, 8 + b, 2, 2, '#7FE3FF'); ret(g, 21, 8 + b, 2, 2, '#7FE3FF');
    ret(g, 4, 14 + b, 7, 13, esc2); ret(g, 29, 14 + b, 7, 13, esc2); ret(g, 3, 26 + b, 8, 5, cor); ret(g, 29, 26 + b, 8, 5, cor);
    ret(g, 13, 29, 6, 9, esc2); ret(g, 22, 29, 6, 9, esc2);
    [[14, 17], [24, 20], [18, 24]].forEach(([x, y]) => ret(g, x, y + b, 2, 1, esc2));
    ret(g, 12, 12 + b, 4, 2, '#5E9E4A');
  } else {
    const a = quadro ? -3 : 0;
    elipse(g, 22, 25, 10, 7, cor);
    linha(g, 30, 23, 37, 30, cor, 3);
    linha(g, 14, 22, 8, 12, cor, 4);
    elipse(g, 7, 10, 5, 3.6, cor); ret(g, 1, 10, 5, 3, cor);
    pinta(g, 6, 8, '#FFD34D'); pinta(g, 2, 11, PX.olho);
    [[5, 6], [8, 5]].forEach(([x, y]) => linha(g, x, y, x + 1, y - 3, luz2, 1));
    for (let i = 0; i < 9; i++) linha(g, 18 + i, 19 - Math.round(i * 0.6), 18 + i * 2, 8 + a + Math.round(i * 0.5), esc2, 1);
    ret(g, 16, 30, 4, 7, esc2); ret(g, 25, 30, 4, 7, esc2);
    ret(g, 15, 26, 14, 2, luz2);
    if (quadro) for (let i = 0; i < 6; i++) pinta(g, 0 - i, 11 + (i % 2), i < 3 ? '#FFB13B' : '#E8572A');
  }
  return contorno(g);
}

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
