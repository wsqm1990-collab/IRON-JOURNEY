/* ---------- characters: Liberated Pixel Cup sprite layers, put together and recoloured on the phone ----------
   The art (bodies, heads, hair, clothes, armour, weapons, monsters) was made by many pixel artists and
   shared under open licences: credits in Settings and in web/art/lpc/CREDITS.txt. A character is a stack
   of layers chosen from the person's choices, class and level; skin, hair, eyes and clothes are recoloured
   with the artists' own palettes, and every animation is drawn once into a strip the screen plays. */
Object.assign(STR, {
  hero_eyes: ['Eyes', 'Olhos', 'Ojos'], body_m: ['Male', 'Masculino', 'Masculino'], body_f: ['Female', 'Feminino', 'Femenino'],
  art_credits: ['Character art', 'Arte dos personagens', 'Arte de los personajes'],
  art_credits_text: ['The heroes, the mentor and the monsters are Liberated Pixel Cup (LPC) pixel art, made by these artists and shared under open licences ({l}). Thank you!', 'Os heróis, o mestre e os monstros são pixel art do Liberated Pixel Cup (LPC), feitos por estes artistas e compartilhados com licenças abertas ({l}). Obrigado!', 'Los héroes, el maestro y los monstruos son pixel art del Liberated Pixel Cup (LPC), hechos por estos artistas y compartidos con licencias abiertas ({l}). ¡Gracias!'],
});
const LPC_DIR = { w: 0, s: 1, e: 2 };
const LPC_IMG = new Map(), LPC_COR = new Map(), LPC_TIRA = new Map(), LPC_RET = new Map();

/* ---- loading and recolouring */
function lpcImg(f) {
  if (LPC_IMG.has(f)) return Promise.resolve(LPC_IMG.get(f));
  const p = new Promise(res => {
    const im = new Image();
    im.onload = () => { LPC_IMG.set(f, im); res(im); };
    im.onerror = () => { LPC_IMG.set(f, null); res(null); };
    im.src = 'art/lpc/' + f;
  });
  LPC_IMG.set(f, p);
  return p;
}
/* the loaded image, null if it failed, undefined while loading */
const lpcPronta = f => { const v = LPC_IMG.get(f); return v instanceof Promise ? undefined : v; };
const lpcHex = c => parseInt(String(c).slice(1, 7), 16);
/* colour target "name" comes from the layer's own material; "metal.gold" borrows another material's palette */
function lpcRampa(mat, nome) { const [m, n] = String(nome).includes('.') ? String(nome).split('.') : [mat, nome]; return (LPC_PALETAS[m] || {})[n]; }
function lpcTrocas(it) {
  const P = LPC_PARTES[it.p];
  if (!P) return [];
  return P.m.map(([mat, base]) => { const alvo = it.c && it.c[mat]; return alvo && alvo !== base ? [mat, base, alvo] : null; }).filter(Boolean);
}
function lpcTinge(f, trocas) {
  const im = lpcPronta(f);
  if (!im) return null;
  if (!trocas.length) return im;
  const k = f + '|' + trocas.map(x => x.join(':')).join(',');
  if (LPC_COR.has(k)) return LPC_COR.get(k);
  const cv = document.createElement('canvas');
  cv.width = im.width; cv.height = im.height;
  const ctx = cv.getContext('2d');
  ctx.drawImage(im, 0, 0);
  const d = ctx.getImageData(0, 0, cv.width, cv.height), px = d.data, de = [], para = [];
  for (const [mat, base, alvo] of trocas) {
    const a = lpcRampa(mat, base), b = lpcRampa(mat, alvo);
    if (a && b) a.forEach((c, i) => { de.push(lpcHex(c)); para.push(lpcHex(b[Math.min(i, b.length - 1)])); });
  }
  const memo = new Map();
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    const c = (px[i] << 16) | (px[i + 1] << 8) | px[i + 2];
    let t = memo.get(c);
    if (t === undefined) {
      t = -1;
      for (let j = 0; j < de.length; j++) {
        const s = de[j];
        if (Math.abs((s >> 16) - px[i]) <= 1 && Math.abs(((s >> 8) & 255) - px[i + 1]) <= 1 && Math.abs((s & 255) - px[i + 2]) <= 1) { t = para[j]; break; }
      }
      memo.set(c, t);
    }
    if (t >= 0) { px[i] = t >> 16; px[i + 1] = (t >> 8) & 255; px[i + 2] = t & 255; }
  }
  ctx.putImageData(d, 0, 0);
  if (LPC_COR.size > 90) LPC_COR.delete(LPC_COR.keys().next().value);
  LPC_COR.set(k, cv);
  return cv;
}
function lpcArquivos(spec, anims) {
  const fs = new Set();
  for (const it of spec) { const P = LPC_PARTES[it.p]; if (P) for (const a of anims) if (P.a[a]) fs.add(P.a[a][0]); }
  return [...fs];
}
const lpcCarregar = (spec, anims) => Promise.all(lpcArquivos(spec, anims).map(lpcImg));
const lpcCarregado = (spec, anims) => lpcArquivos(spec, anims).every(f => lpcPronta(f) !== undefined);

/* ---- one animation (row) of a character as a strip of square frames, the character centred in each */
function lpcTira(spec, anim, dir, quadros, F) {
  const k = JSON.stringify([spec, anim, dir, quadros, F || 0]);
  if (LPC_TIRA.has(k)) return LPC_TIRA.get(k);
  if (!lpcCarregado(spec, [anim])) return null;
  const partes = spec.map(it => ({ it, P: LPC_PARTES[it.p] })).filter(x => x.P && x.P.a[anim])
    .map(x => ({ a: x.P.a[anim], src: lpcTinge(x.P.a[anim][0], lpcTrocas(x.it)) })).filter(x => x.src)
    .sort((a, b) => a.a[1] - b.a[1]);
  const lado = F || Math.max(64, ...partes.map(x => x.a[2])), linha = anim === 'hurt' ? 0 : (LPC_DIR[dir] != null ? LPC_DIR[dir] : 1);
  const cv = document.createElement('canvas');
  cv.width = lado * quadros.length; cv.height = lado;
  const ctx = cv.getContext('2d');
  quadros.forEach((q, n) => {
    for (const x of partes) {
      const s = x.a[2], off = (lado - s) / 2;
      if (q < x.a[3]) ctx.drawImage(x.src, q * s, linha * s, s, s, n * lado + off, off, s, s);
    }
  });
  const t = { cv, n: quadros.length, F: lado };
  if (LPC_TIRA.size > 120) LPC_TIRA.delete(LPC_TIRA.keys().next().value);
  LPC_TIRA.set(k, t);
  return t;
}
const lpcUrl = t => t.url || (t.url = t.cv.toDataURL('image/png'));
const ANDA = [1, 2, 3, 4, 5, 6, 7, 8];
let LPC_SEQ = 0;
const lpcEstilo = (t, k, ms) => `--w:${t.F * k}px;--n:${t.n};--d:${t.n * ms}ms;background-image:url(${lpcUrl(t)})`;
/* a character on the page: walking (or standing) in a direction, at a whole-number scale */
function lpcHTML(spec, o = {}) {
  const anim = o.anim || 'walk', dir = o.dir || 's', quadros = o.quadros || (o.parado ? [0] : ANDA), F = o.F || 64, k = o.esc || 2, ms = o.ms || 110;
  const id = 'lpc' + ++LPC_SEQ, t = lpcTira(spec, anim, dir, quadros, F);
  if (!t) lpcCarregar(spec, [anim]).then(() => { const el = document.getElementById(id), t2 = lpcTira(spec, anim, dir, quadros, F); if (el && t2) el.setAttribute('style', lpcEstilo(t2, k, ms)); });
  const cls = 'lpc' + (quadros.length > 1 ? ' anda' : '') + (o.cls ? ' ' + o.cls : '');
  return `<span class="${cls}" id="${id}" role="${o.alt ? 'img' : 'presentation'}"${o.alt ? ` aria-label="${esc(o.alt)}"` : ''} style="${t ? lpcEstilo(t, k, ms) : `--w:${F * k}px;--n:1`}"></span>`;
}
/* head and shoulders, for the creator's choices */
function lpcRetrato(spec) {
  const k = JSON.stringify(spec);
  if (LPC_RET.has(k)) return LPC_RET.get(k);
  const t = lpcTira(spec, 'walk', 's', [0], 64);
  if (!t) return null;
  const c = document.createElement('canvas');
  c.width = 36; c.height = 36;
  c.getContext('2d').drawImage(t.cv, 14, 6, 36, 36, 0, 0, 36, 36);
  const u = c.toDataURL('image/png');
  if (LPC_RET.size > 300) LPC_RET.delete(LPC_RET.keys().next().value);
  LPC_RET.set(k, u);
  return u;
}
function lpcRetratoHTML(spec) {
  const id = 'lpr' + ++LPC_SEQ, u = lpcRetrato(spec);
  if (!u) lpcCarregar(spec, ['walk']).then(() => { const el = document.getElementById(id), u2 = lpcRetrato(spec); if (el && u2) el.src = u2; });
  return `<img class="lpr" id="${id}" alt="" width="36" height="36"${u ? ` src="${u}"` : ''}>`;
}
/* a palette colour for the interface (swatches, flags) */
const lpcCorUI = (mat, nome, i = 3) => { const r = lpcRampa(mat, nome); return r ? r[Math.min(i, r.length - 1)] : '#888888'; };

/* ---------- the hero: choices, class gear and level ---------- */
const HEROI_OPC = {
  corpo: ['m', 'f'],
  pele: ['light', 'amber', 'olive', 'taupe', 'bronze', 'brown', 'black'],
  cabelo: ['plain', 'messy1', 'spiked', 'buzzcut', '', 'shorthawk', 'curly_short', 'afro', 'dreadlocks_short', 'pixie', 'bob', 'long', 'ponytail', 'bangs_bun', 'braid'],
  corCabelo: ['black', 'dark_brown', 'chestnut', 'light_brown', 'sandy', 'blonde', 'ginger', 'redhead', 'gray', 'white', 'blue', 'pink'],
  barba: ['', 'porfazer', 'bigode', 'aparada', 'media', 'cheia', 'lenhador'],
  olhos: ['brown', 'blue', 'green', 'gray', 'yellow', 'orange', 'purple', 'red'],
  roupa: ['red', 'maroon', 'orange', 'yellow', 'tan', 'green', 'forest', 'teal', 'blue', 'navy', 'purple', 'charcoal', 'white'],
};
const NOMES_CABELO = {
  plain: ['Short', 'Curto', 'Corto'], messy1: ['Messy', 'Bagunçado', 'Despeinado'], spiked: ['Spiky', 'Espetado', 'De punta'], buzzcut: ['Buzz cut', 'Raspado', 'Rapado'],
  '': ['Bald', 'Careca', 'Calvo'], shorthawk: ['Mohawk', 'Moicano', 'Mohicano'], curly_short: ['Curly', 'Cacheado', 'Rizado'], afro: ['Afro', 'Black power', 'Afro'],
  dreadlocks_short: ['Dreads', 'Dreads', 'Rastas'], pixie: ['Pixie', 'Joãozinho', 'Pixie'], bob: ['Bob', 'Chanel', 'Bob'], long: ['Long', 'Longo', 'Largo'],
  ponytail: ['Ponytail', 'Rabo de cavalo', 'Coleta'], bangs_bun: ['Bun', 'Coque', 'Moño'], braid: ['Braid', 'Trança', 'Trenza'],
};
const NOMES_BARBA = {
  '': ['None', 'Sem barba', 'Sin barba'], porfazer: ['Stubble', 'Por fazer', 'De tres días'], bigode: ['Moustache', 'Bigode', 'Bigote'], aparada: ['Trimmed', 'Aparada', 'Recortada'],
  media: ['Medium', 'Média', 'Media'], cheia: ['Full', 'Cheia', 'Completa'], lenhador: ['Woodsman', 'Lenhador', 'Leñador'],
};
const HEROI_PADRAO = { corpo: 'm', pele: 'light', cabelo: 'plain', corCabelo: 'dark_brown', barba: '', olhos: 'brown', roupa: 'blue' };
/* heroes saved by the first version used numbers for each choice */
const HEROI_V1 = {
  corpo: ['m', 'f'], pele: ['light', 'amber', 'olive', 'bronze', 'brown', 'black'], cabelo: ['plain', 'spiked', 'long', 'bangs_bun', 'ponytail', 'curly_short', ''],
  corCabelo: ['black', 'dark_brown', 'light_brown', 'blonde', 'redhead', 'gray', 'white', 'blue', 'pink'], barba: ['', 'aparada', 'cheia'],
  roupa: ['blue', 'red', 'green', 'purple', 'orange', 'teal', 'charcoal', 'tan'],
};
function heroiNorm(h, sexo) {
  const o = { ...HEROI_PADRAO, ...(sexo === 'f' ? { corpo: 'f', cabelo: 'long' } : {}) };
  if (h) for (const k of Object.keys(HEROI_PADRAO)) {
    let v = h[k];
    if (typeof v === 'number' && HEROI_V1[k]) v = HEROI_V1[k][v];
    if (typeof v === 'string' && HEROI_OPC[k].includes(v)) o[k] = v;
  }
  if (o.corpo === 'f') o.barba = '';
  return o;
}
const ATAQUE = { guerreiro: 'slash', paladino: 'slash', cacador: 'shoot', monge: 'thrust' };
const METAL_TIER = ['iron', 'iron', 'iron', 'steel', 'gold', 'gold'];
/* the layers of a hero (H from heroiDe, or a draft: {h, classe, tier, lenda}); o.feliz adds the smile */
function camadasHeroi(H, o = {}) {
  const h = H.h, s = h.corpo === 'f' ? 'f' : 'm', tier = H.tier || 0, cl = H.classe.id, lenda = !!H.lenda, C = [];
  const add = (p, c) => { if (LPC_PARTES[p]) C.push(c ? { p, c } : { p }); };
  add('corpo/' + s, { body: h.pele });
  add('cab/' + s, { body: h.pele, eye: h.olhos });
  if (o.feliz) add('rosto/' + s, { body: h.pele });
  if (h.cabelo) { add('cabelo/' + h.cabelo, { hair: h.corCabelo }); add('cabelo/' + h.cabelo + '-tras', { hair: h.corCabelo }); }
  if (h.barba && s === 'm') add('barba/' + h.barba, { hair: h.corCabelo });
  add('camisa/' + s, { cloth: h.roupa });
  add('calca/' + s, { cloth: tier >= 3 ? 'black' : 'charcoal' });
  add((tier >= 1 ? 'bota/' : 'sapato/') + s, { cloth: tier >= 3 ? 'black' : 'leather' });
  const capa = c => { add('capa', { cloth: c }); add('capa-tras', { cloth: c }); };
  if (cl === 'guerreiro' || cl === 'paladino') {
    const ouro = lenda && cl === 'paladino', mt = ouro ? 'gold' : METAL_TIER[tier];
    if (tier === 1 && !ouro) add('couro/' + s);
    if (tier === 2 && !ouro) add('malha/' + s, { metal: 'iron' });
    if (tier >= 3 || ouro) { add('placas/' + s, { metal: mt }); add('ombreira/' + s, { cloth: 'metal.' + mt }); }
    if (tier >= 1) add('bracadeira/' + s, { metal: tier >= 4 || ouro ? 'gold' : 'iron' });
    if (tier >= 3) capa(h.roupa);
  } else if (cl === 'cacador') {
    if (tier >= 4) add('malha/' + s, { metal: 'steel' });
    if (tier >= 1) add('couro/' + s);
    if (tier >= 2) { add('bracadeira/' + s, { metal: tier >= 4 ? 'gold' : 'bronze' }); capa(h.roupa); }
    if (tier >= 3) add('ombreira/' + s, { cloth: 'leather' });
    add('aljava');
  } else {
    if (tier >= 1) { add('manto/' + s, { cloth: tier >= 4 ? 'yellow' : 'white' }); add('cinto/' + s); }
    if (tier >= 2) add('bracadeira/' + s, { metal: tier >= 4 ? 'gold' : 'bronze' });
    if (tier >= 3) capa(h.roupa);
  }
  if (tier >= 5) add('coroa');
  const arma = { guerreiro: lenda ? 'arma/espada-luz' : 'arma/espada', paladino: 'arma/maca', cacador: lenda ? 'arma/arco-grande' : tier >= 4 ? 'arma/arco-ouro' : 'arma/arco', monge: lenda ? 'arma/cristal' : 'arma/cajado' }[cl];
  add(arma); add(arma + '-tras');
  if (cl === 'cacador') add('arma/flecha');
  if (cl === 'paladino') {
    if (lenda || tier >= 4) { add('escudo/espartano-tras'); add('escudo/espartano'); }
    else if (tier >= 2) { add('escudo/cruzado-tras'); add('escudo/cruzado/' + s); }
    else add('escudo/redondo');
  }
  return C;
}
const lendaria = H => (H.tier || 0) >= 5 || !!H.lenda;
/* the hero on the page (Journey, Today, map, allies, creator) */
function heroiAnimHTML(H, modo = 'parado', cls = '') {
  const esc2 = cls.includes('grande') ? 2 : 1;
  return lpcHTML(camadasHeroi(H), { parado: modo !== 'anda', esc: esc2, cls: cls + (lendaria(H) ? ' lenda' : ''), alt: H.nome || '' });
}
/* Master Atlas: the old trainer-wizard */
const MENTOR = [{ p: 'corpo/m', c: { body: 'light' } }, { p: 'cab/velho', c: { body: 'light', eye: 'gray' } }, { p: 'barba/lenhador', c: { hair: 'white' } },
  { p: 'camisa/m', c: { cloth: 'purple' } }, { p: 'calca/m', c: { cloth: 'charcoal' } }, { p: 'sapato/m', c: { cloth: 'leather' } }, { p: 'manto/m', c: { cloth: 'navy' } },
  { p: 'chapeu-mago' }, { p: 'arma/cajado' }, { p: 'arma/cajado-tras' }];
const mentorAnimHTML = (cls = '') => lpcHTML(MENTOR, { parado: true, esc: 1, cls: 'respira ' + cls, alt: L3(['Master Atlas', 'Mestre Atlas', 'Maestro Atlas']) });

/* ---------- monsters of each region and the bosses ---------- */
const lp = (p, c) => (c ? { p, c } : { p });
const INIMIGOS = {
  goblin: { nome: ['Goblin', 'Goblin', 'Goblin'], ataque: 'slash', spec: [lp('corpo/m', { body: 'green' }), lp('cab/goblin'), lp('couro/m'), lp('arma/adaga'), lp('arma/adaga-tras')] },
  orc: { nome: ['Orc', 'Orc', 'Orco'], ataque: 'slash', spec: [lp('corpo/mus', { body: 'green' }), lp('cab/orc'), lp('calca/m', { cloth: 'brown' }), lp('arma/machado'), lp('arma/machado-tras')] },
  esqueleto: { nome: ['Skeleton', 'Esqueleto', 'Esqueleto'], ataque: 'thrust', spec: [lp('corpo/esq'), lp('cab/esq'), lp('arma/lanca'), lp('arma/lanca-tras')] },
  zumbi: { nome: ['Zombie', 'Zumbi', 'Zombi'], ataque: 'slash', spec: [lp('corpo/zum'), lp('cab/zumbi'), lp('calca/m', { cloth: 'charcoal' })] },
  lobisomem: { nome: ['Werewolf', 'Lobisomem', 'Hombre lobo'], ataque: 'slash', spec: [lp('corpo/m', { body: 'fur_brown' }), lp('cab/lobo'), lp('calca/m', { cloth: 'brown' })] },
  lobisomemNeve: { nome: ['Snow werewolf', 'Lobisomem da neve', 'Hombre lobo de nieve'], ataque: 'slash', spec: [lp('corpo/m', { body: 'fur_white' }), lp('cab/lobo', { body: 'fur_white' }), lp('calca/m', { cloth: 'slate' })] },
  lagarto: { nome: ['Lizardfolk', 'Homem-lagarto', 'Hombre lagarto'], ataque: 'thrust', spec: [lp('corpo/m', { body: 'green' }), lp('cab/lagarto'), lp('couro/m'), lp('arma/lanca'), lp('arma/lanca-tras')] },
  javali: { nome: ['Boarman', 'Javali guerreiro', 'Jabalí guerrero'], ataque: 'slash', spec: [lp('corpo/m', { body: 'fur_brown' }), lp('cab/javali'), lp('calca/m', { cloth: 'brown' }), lp('couro/m'), lp('arma/machado'), lp('arma/machado-tras')] },
};
const CHEFES_LPC = {
  orc: { nome: ['Gorak, the orc chief', 'Gorak, o chefe orc', 'Gorak, el jefe orco'], spec: [lp('corpo/mus', { body: 'dark_green' }), lp('cab/orc', { body: 'dark_green' }), lp('calca/m', { cloth: 'black' }), lp('ombreira/m', { cloth: 'metal.iron' }), lp('arma/machado'), lp('arma/machado-tras')] },
  troll: { nome: ['Trog, the mountain troll', 'Trog, o troll da montanha', 'Trog, el trol de la montaña'], spec: [lp('corpo/mus', { body: 'pale_green' }), lp('cab/troll', { body: 'pale_green' }), lp('calca/m', { cloth: 'brown' }), lp('arma/maca'), lp('arma/maca-tras')] },
  minotauro: { nome: ['Asterion, the minotaur', 'Astério, o minotauro', 'Asterión, el minotauro'], spec: [lp('corpo/mus', { body: 'fur_tan' }), lp('cab/minotauro'), lp('calca/m', { cloth: 'maroon' }), lp('arma/machado'), lp('arma/machado-tras')] },
  reiLagarto: { nome: ['Sssarak, the lizard king', 'Sssarak, o rei lagarto', 'Sssarak, el rey lagarto'], spec: [lp('corpo/mus', { body: 'dark_green' }), lp('cab/lagarto', { body: 'dark_green' }), lp('calca/m', { cloth: 'forest' }), lp('coroa'), lp('arma/lanca'), lp('arma/lanca-tras')] },
  trollGelo: { nome: ['Ymir, the frost troll', 'Ymir, o troll do gelo', 'Ymir, el trol de hielo'], spec: [lp('corpo/mus', { body: 'blue' }), lp('cab/troll', { body: 'blue' }), lp('calca/m', { cloth: 'slate' }), lp('arma/maca'), lp('arma/maca-tras')] },
  minotauroFogo: { nome: ['Ember, the fire minotaur', 'Brasa, o minotauro de fogo', 'Brasa, el minotauro de fuego'], spec: [lp('corpo/mus', { body: 'fur_copper' }), lp('cab/minotauro', { body: 'fur_copper' }), lp('calca/m', { cloth: 'black' }), lp('ombreira/m', { cloth: 'metal.gold' }), lp('arma/espada-fogo'), lp('arma/espada-fogo-tras')] },
};
/* load the people's heroes and the mentor ahead, so screens show them at once */
function lpcPreparar() {
  try {
    const specs = [MENTOR, ...S.ordem.filter(p => S.perfis[p]).map(p => camadasHeroi(heroiDe(p)))];
    specs.forEach(sp => lpcCarregar(sp, ['walk']));
  } catch { /* nothing to prepare yet */ }
}
