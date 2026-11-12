/* ---------- the world: each person's pixel hero walks a map that is their training plan ----------
   Chapter (training block) = a region. Every planned workout = a stage on the path, the light week =
   the village, and a boss waits at the end: the block's real test (consistency, records, strength,
   cardio). Every 3 chapters a campaign ends with the grand prize of the person's class, plus the
   real prize they chose for themselves. */
Object.assign(STR, {
  hero_create: ['Create your hero', 'Crie seu herói', 'Crea tu héroe'],
  hero_create_text: ['Your hero walks the map of your training plan: every workout you finish is a stage won.', 'Seu herói percorre o mapa do seu plano de treino: cada treino concluído é uma fase vencida.', 'Tu héroe recorre el mapa de tu plan: cada entrenamiento terminado es una fase ganada.'],
  hero_edit: ['Edit hero', 'Editar herói', 'Editar héroe'], hero_name: ['Hero name', 'Nome do herói', 'Nombre del héroe'],
  hero_body: ['Body', 'Corpo', 'Cuerpo'], hero_skin: ['Skin', 'Pele', 'Piel'], hero_hair: ['Hair', 'Cabelo', 'Pelo'], hero_hair_color: ['Hair colour', 'Cor do cabelo', 'Color del pelo'],
  hero_beard: ['Beard', 'Barba', 'Barba'], hero_outfit: ['Outfit colour', 'Cor da roupa', 'Color de la ropa'], hero_save: ['Save hero', 'Salvar herói', 'Guardar héroe'],
  hero_saved: ['Hero saved', 'Herói salvo', 'Héroe guardado'], hero_class: ['Class: {c}', 'Classe: {c}', 'Clase: {c}'],
  hero_class_why: ['It comes from your goal ({g}). Change the goal and the class changes too.', 'Vem do seu objetivo ({g}). Mudou o objetivo, muda a classe.', 'Viene de tu objetivo ({g}). Si cambias el objetivo, cambia la clase.'],
  body_a: ['Broad', 'Largo', 'Ancho'], body_b: ['Slim', 'Fino', 'Delgado'],
  hair_names: ['Short|Spiky|Long|Bun|Ponytail|Curly|Bald', 'Curto|Espetado|Longo|Coque|Rabo de cavalo|Cacheado|Careca', 'Corto|De punta|Largo|Moño|Coleta|Rizado|Calvo'],
  beard_names: ['None|Short|Full', 'Sem barba|Curta|Cheia', 'Sin barba|Corta|Completa'],
  prize_real: ['Your real prize', 'Seu prêmio real', 'Tu premio real'],
  prize_real_text: ['When you finish the campaign (3 chapters), give yourself this:', 'Quando concluir a campanha (3 capítulos), você se dá isto de presente:', 'Cuando termines la campaña (3 capítulos), te regalas esto:'],
  prize_real_ph: ['E.g. new running shoes', 'Ex.: um tênis novo', 'Ej.: unas zapatillas nuevas'],
  chapter_region: ['Chapter {n} · {r}', 'Capítulo {n} · {r}', 'Capítulo {n} · {r}'], stages_won: ['{a} of {b} stages won', '{a} de {b} fases vencidas', '{a} de {b} fases ganadas'],
  campaign_n: ['Campaign {n} · chapter {a} of 3', 'Campanha {n} · capítulo {a} de 3', 'Campaña {n} · capítulo {a} de 3'],
  legend_done: ['won', 'vencida', 'ganada'], legend_next: ['next', 'próxima', 'siguiente'], legend_village: ['village (light week)', 'vila (semana leve)', 'aldea (semana ligera)'],
  legend_boss: ['boss', 'chefão', 'jefe'], legend_chest: ['cardio chest', 'baú de cardio', 'cofre de cardio'],
  mentor_name: ['Master Atlas', 'Mestre Atlas', 'Maestro Atlas'], mentor_talk: ['Talk to the master', 'Falar com o mestre', 'Hablar con el maestro'],
  m_noplan: ['Every hero needs a map. Build your training plan and I will draw the road.', 'Todo herói precisa de um mapa. Monte seu plano de treino e eu desenho a estrada.', 'Todo héroe necesita un mapa. Arma tu plan de entrenamiento y yo dibujo el camino.'],
  m_village: ['Welcome to the village! Light week: rest is part of the quest, this is where the body gets stronger.', 'Bem-vindo à vila! Semana leve: descansar faz parte da missão, é aqui que o corpo fica mais forte.', '¡Bienvenido a la aldea! Semana ligera: descansar es parte de la misión, aquí el cuerpo se fortalece.'],
  m_boss_next: ['The boss is waiting. Finish your last workout and we will see how much stronger you came back.', 'O chefão está esperando. Termine o último treino e vamos ver o quanto você voltou mais forte.', 'El jefe espera. Termina el último entrenamiento y veremos cuánto más fuerte vuelves.'],
  m_done: ['Chapter won! Ask the coach for the next map whenever you are ready.', 'Capítulo vencido! Peça o próximo mapa ao treinador quando estiver pronto.', '¡Capítulo ganado! Pide el próximo mapa al entrenador cuando quieras.'],
  m_week: ['Week {n}: {x}', 'Semana {n}: {x}', 'Semana {n}: {x}'],
  grand_prize: ['Grand prize of the campaign', 'Prêmio maior da campanha', 'Gran premio de la campaña'], prize_left: ['{n} chapter(s) to go', 'Faltam {n} capítulo(s)', 'Faltan {n} capítulo(s)'],
  prize_won_n: ['Won {n}×', 'Conquistado {n}×', 'Conseguido {n}×'], prize_real_show: ['Real prize: {x}', 'Prêmio real: {x}', 'Premio real: {x}'], prize_set: ['Set your real prize', 'Definir meu prêmio real', 'Definir mi premio real'],
  inventory: ['Inventory', 'Inventário', 'Inventario'], allies_map: ['Allies', 'Aliados', 'Aliados'], ally_at: ['{r} · stage {a} of {b}', '{r} · fase {a} de {b}', '{r} · fase {a} de {b}'], ally_noplan: ['No map yet', 'Ainda sem mapa', 'Aún sin mapa'],
  boss_hp: ['Boss', 'Chefão', 'Jefe'], stage_n: ['Stage {n}', 'Fase {n}', 'Fase {n}'], stage_won: ['Stage {n} won!', 'Fase {n} vencida!', '¡Fase {n} ganada!'], duo_attack: ['Duo attack!', 'Ataque em dupla!', '¡Ataque en dúo!'],
  rare_loot: ['Rare item: personal record!', 'Item raro: recorde pessoal!', '¡Objeto raro: récord personal!'], boss_won: ['Boss defeated!', 'Chefão derrotado!', '¡Jefe derrotado!'],
  boss_fled: ['The boss escaped! You will meet again next chapter.', 'O chefão fugiu! Vocês se encontram no próximo capítulo.', '¡El jefe escapó! Os veréis en el próximo capítulo.'],
  dmg_const: ['Consistency', 'Constância', 'Constancia'], dmg_rec: ['Records', 'Recordes', 'Récords'], dmg_str: ['Strength', 'Força', 'Fuerza'], dmg_cardio: ['Cardio', 'Cardio', 'Cardio'],
  boss_how: ['How the boss fight works', 'Como funciona a luta com o chefão', 'Cómo funciona la pelea con el jefe'],
  boss_how_text: ['At the end of each chapter your real training hits the boss: consistency (workouts done out of those planned), personal records, strength gained (estimated from your sets) and cardio sessions. 100 damage defeats it. If it escapes, nothing is lost: it waits for you in the next chapter.', 'No fim de cada capítulo o seu treino de verdade bate no chefão: constância (treinos feitos dos planejados), recordes pessoais, força ganha (estimada pelas suas séries) e sessões de cardio. Com 100 de dano ele cai. Se fugir, você não perde nada: ele te espera no próximo capítulo.', 'Al final de cada capítulo tu entrenamiento real golpea al jefe: constancia (entrenamientos hechos de los planificados), récords personales, fuerza ganada (estimada por tus series) y sesiones de cardio. Con 100 de daño cae. Si escapa, no pierdes nada: te espera en el próximo capítulo.'],
  tap_skip: ['Tap to skip', 'Toque para pular', 'Toca para saltar'],
});
const REGIOES = [
  { id: 'floresta', nome: ['Whispering Forest', 'Floresta Sussurrante', 'Bosque Susurrante'], chao: ['#4E9A43', '#5BAA4E', '#437F3A'], ceu: ['#9FD3F0', '#C6E7F7'], trilha: '#D8BC80', agua: '#4C9BD6', deco: ['arvore', 'arbusto', 'pedra', 'arvore'], monstro: '#69B85A', chefe: ['troll', '#6E9E46'] },
  { id: 'montanha', nome: ['Iron Mountains', 'Montanhas de Ferro', 'Montañas de Hierro'], chao: ['#8A8E96', '#9DA1A9', '#777B83'], ceu: ['#A9C7E2', '#D2E2F0'], trilha: '#CDB98F', agua: '#5D8FC2', deco: ['pico', 'pedra', 'pinheiro', 'pinheiro'], monstro: '#8E95A3', chefe: ['golem', '#8C8F98'] },
  { id: 'deserto', nome: ['Scorching Desert', 'Deserto Escaldante', 'Desierto Abrasador'], chao: ['#E5C47A', '#EDD08E', '#D8B260'], ceu: ['#F6C77D', '#FBE3B4'], trilha: '#B98B4A', agua: '#4CB3C9', deco: ['cacto', 'pedra', 'osso', 'cacto'], monstro: '#D69A3E', chefe: ['dragao', '#D9A02E'] },
  { id: 'pantano', nome: ['Gloom Swamp', 'Pântano Sombrio', 'Pantano Sombrío'], chao: ['#4E6B3A', '#5B7A44', '#41592F'], ceu: ['#8FA58C', '#B9C9B4'], trilha: '#9A8860', agua: '#3C5C55', deco: ['arvoreSeca', 'junco', 'pedra', 'junco'], monstro: '#7A9A4A', chefe: ['troll', '#5E7D4A'] },
  { id: 'gelo', nome: ['Frozen Peaks', 'Picos Gelados', 'Picos Helados'], chao: ['#E6EEF4', '#F3F7FA', '#D3E1EA'], ceu: ['#B8D8EE', '#E2F0F9'], trilha: '#A9B8C6', agua: '#8CC8E8', deco: ['pinheiroNeve', 'pedra', 'cristal', 'pinheiroNeve'], monstro: '#7FB8E0', chefe: ['golem', '#9CC6E6'] },
  { id: 'vulcao', nome: ['Crimson Volcano', 'Vulcão Rubro', 'Volcán Carmesí'], chao: ['#4A3B3B', '#57463F', '#3A2E2E'], ceu: ['#6E4A44', '#A0625A'], trilha: '#8E7B6B', agua: '#E8572A', deco: ['rochaLava', 'pedra', 'rochaLava', 'osso'], monstro: '#D4573A', chefe: ['dragao', '#C8462E'] },
];
const regiaoDe = ciclo => REGIOES[(Math.max(1, ciclo || 1) - 1) % REGIOES.length];
const PREMIOS = {
  guerreiro: { item: 'martelo', cor: '#E2B33C', nome: ['Titan\'s Hammer', 'Martelo do Titã', 'Martillo del Titán'] },
  paladino: { item: 'armadura', cor: '#E2B33C', nome: ['Colossus Armour', 'Armadura do Colosso', 'Armadura del Coloso'] },
  cacador: { item: 'arco', cor: '#8FE3FF', nome: ['Wind Bow', 'Arco do Vento', 'Arco del Viento'] },
  monge: { item: 'cajado', cor: '#7EE0C2', nome: ['Staff of the Eternal Heart', 'Cajado do Coração Eterno', 'Bastón del Corazón Eterno'] },
};
/* small seeded random numbers, so a map always looks the same */
function rnd(seed) { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) | 0; return () => { s = (s * 1103515245 + 12345) | 0; return ((s >>> 16) & 0x7fff) / 0x8000; }; }

/* ---------- scenery ---------- */
function decorGrade(tipo, r) {
  const g = grade(12, 14), verde = '#2F7A35', verde2 = '#3F9444';
  switch (tipo) {
    case 'arvore': ret(g, 5, 9, 2, 4, '#6B4A2E'); elipse(g, 6, 6, 4.5, 4.2, verde); elipse(g, 5, 4, 2, 1.6, verde2); break;
    case 'arbusto': elipse(g, 6, 10, 4, 2.6, verde); pinta(g, 4, 9, verde2); break;
    case 'pedra': elipse(g, 6, 10, 3.6, 2.6, '#8D9096'); pinta(g, 5, 9, '#B4B7BC'); break;
    case 'pico': for (let y = 2; y < 13; y++) ret(g, 6 - Math.floor((y - 2) / 2), y, Math.floor((y - 2) / 2) * 2 + 1, 1, y < 5 ? '#F2F5F8' : '#6E727A'); break;
    case 'pinheiro': ret(g, 5, 11, 2, 2, '#6B4A2E'); for (let y = 1; y < 11; y++) ret(g, 6 - Math.floor(y / 2.2), y, Math.floor(y / 2.2) * 2 + 1, 1, y % 3 ? '#2E6B3A' : '#3B7F48'); break;
    case 'pinheiroNeve': ret(g, 5, 11, 2, 2, '#6B4A2E'); for (let y = 1; y < 11; y++) ret(g, 6 - Math.floor(y / 2.2), y, Math.floor(y / 2.2) * 2 + 1, 1, y % 3 ? '#2E6B3A' : '#F3F7FA'); break;
    case 'cacto': ret(g, 5, 3, 2, 10, '#3E8E4A'); ret(g, 2, 6, 2, 3, '#3E8E4A'); ret(g, 3, 8, 2, 1, '#3E8E4A'); ret(g, 8, 4, 2, 3, '#3E8E4A'); ret(g, 7, 6, 2, 1, '#3E8E4A'); break;
    case 'osso': linha(g, 2, 11, 9, 9, '#EFE8D6', 1); pinta(g, 2, 10, '#EFE8D6'); pinta(g, 9, 10, '#EFE8D6'); break;
    case 'arvoreSeca': linha(g, 6, 13, 6, 4, '#4A3A2A', 2); linha(g, 6, 7, 2, 4, '#4A3A2A'); linha(g, 7, 6, 10, 3, '#4A3A2A'); break;
    case 'junco': [3, 6, 9].forEach((x, i) => { linha(g, x, 13, x, 6 + i, '#6B8A3A'); pinta(g, x, 5 + i, '#7A5230'); }); break;
    case 'cristal': linha(g, 6, 12, 6, 4, '#9FE3FF', 2); linha(g, 3, 12, 3, 8, '#C9F1FF', 2); linha(g, 9, 12, 9, 7, '#7FCBEA', 2); break;
    case 'rochaLava': elipse(g, 6, 10, 4, 3, '#2C2222'); linha(g, 4, 9, 8, 11, '#F07A2A'); break;
    case 'casa': ret(g, 2, 7, 9, 6, '#C99A6B'); for (let y = 2; y < 7; y++) ret(g, 6 - (y - 2) - 1, y, (y - 2) * 2 + 3, 1, '#B5452A'); ret(g, 5, 9, 3, 4, '#6B4A2E'); pinta(g, 3, 9, '#FFE58A'); break;
    case 'bandeira': linha(g, 3, 13, 3, 1, '#5B4636'); ret(g, 4, 1, 6, 4, r || '#D94A3A'); ret(g, 4, 4, 4, 1, escurece(r || '#D94A3A', 0.8)); break;
    case 'covil': for (let y = 1; y < 14; y++) ret(g, 6 - Math.min(5, Math.floor(y / 1.6)), y, Math.min(5, Math.floor(y / 1.6)) * 2 + 1, 1, '#5E5A63'); elipse(g, 6, 12, 2.4, 2.6, '#1B1D26', (x, y) => y >= 10); break;
    default: break;
  }
  return contorno(g);
}
const decor = (tipo, extra = '') => sprite('d:' + tipo + extra, () => decorGrade(tipo, extra));

/* ---------- each person's hero ---------- */
function heroiDe(pid, dados) {
  const p = perfil(pid) || {}, h = { ...HEROI_PADRAO, ...(p.heroi || {}) };
  const cl = classeDe(p.objetivo), d = dados || jornadaDados(pid), camp = campanhas(pid);
  const lenda = camp.vencidas > 0;
  return { h, classe: cl, nome: (p.heroi && p.heroi.nome) || p.nome || '', criado: !!p.heroi, tier: tierDe(d.nivel.n), arma: lenda && cl.id === 'guerreiro' ? 'martelo' : cl.arma, material: lenda ? PREMIOS[cl.id].cor : null, d, camp };
}
const extraHeroi = H => ({ tier: H.tier, arma: H.arma, ...(H.material ? { material: H.material } : {}) });
/* an animated sprite: frames side by side, played with CSS steps */
function folha(chave, quadros) {
  return sprite('f:' + chave, () => {
    const gs = quadros.map(q => q()), w = gs[0].w, h = gs[0].h, g = grade(w * gs.length, h);
    gs.forEach((q, i) => cola(g, q, i * w, 0));
    return g;
  });
}
function pxAnim(s, n, ms, cls = '', alt = '') {
  return `<span class="pxa ${cls}" role="${alt ? 'img' : 'presentation'}"${alt ? ` aria-label="${esc(alt)}"` : ''} style="--n:${n};--ms:${ms}ms;aspect-ratio:${s.w / n}/${s.h};background-image:url(${s.url})"></span>`;
}
function heroiAnimHTML(H, modo = 'parado', cls = '') {
  const q = modo === 'anda' ? ['anda0', 'anda1'] : ['parado0', 'parado1'], ex = extraHeroi(H);
  const s = folha(JSON.stringify([H.h, ex, q]), q.map(x => () => heroiGrade(H.h, x, ex)));
  return pxAnim(s, 2, modo === 'anda' ? 360 : 1000, cls, H.nome);
}
const mentorAnimHTML = (cls = '') => pxAnim(folha('mentor', ['parado0', 'parado1'].map(q => () => mentorGrade(q))), 2, 1100, cls, L3(['Master Atlas', 'Mestre Atlas', 'Maestro Atlas']));

/* ---------- chapters, bosses and campaigns from the real training ---------- */
function forcaGanha(ss) {
  /* best estimated 1RM per exercise in the first third of the chapter vs the last third */
  if (ss.length < 3) return 0;
  const ord = ss.slice().sort((a, b) => a.inicio - b.inicio), n = ord.length, a = ord.slice(0, Math.ceil(n / 3)), b = ord.slice(Math.floor((2 * n) / 3));
  const melhor = lista => { const m = {}; for (const s of lista) for (const x of s.exs || []) for (const z of x.sets || []) if (z.kg > 0 && z.reps > 0) m[x.id] = Math.max(m[x.id] || 0, e1rm(z.kg, z.reps)); return m; };
  const A = melhor(a), B = melhor(b), ganhos = Object.keys(A).filter(k => B[k]).map(k => (B[k] / A[k] - 1) * 100);
  return ganhos.length ? clamp(ganhos.reduce((x, y) => x + y, 0) / ganhos.length, -20, 40) : 0;
}
function lutaChefe(pid, planoId) {
  const ss = sessoesDe(pid).filter(s => s.planoId === planoId);
  if (!ss.length) return null;
  const total = Math.max(1, ...ss.map(s => s.total || 0)), ids = new Set(ss.map(s => s._id));
  const constancia = clamp(ss.length / total, 0, 1), prs = recordes(pid).prs.filter(r => ids.has(r.sess)).length;
  const cardio = cardioDe(pid).filter(c => c.planoId === planoId && (c.minutos || 0) >= 10).length, ganho = forcaGanha(ss);
  const obj = (perfil(pid) || {}).objetivo, foco = obj === 'emagrecer' || obj === 'saude';
  const partes = [
    ['dmg_const', Math.round(constancia * 100) + '%', Math.round(constancia * (foco ? 60 : 70))],
    ['dmg_rec', String(prs), Math.min(foco ? 10 : 20, prs * 5)],
    ['dmg_str', (ganho >= 0 ? '+' : '') + Math.round(ganho) + '%', Math.max(0, Math.round(Math.min(foco ? 15 : 25, ganho * (foco ? 3 : 4))))],
    ['dmg_cardio', String(cardio), Math.min(foco ? 25 : 10, cardio * (foco ? 4 : 2))],
  ];
  const dano = partes.reduce((n, p) => n + p[2], 0);
  return { partes, dano, venceu: dano >= 100, ciclo: Math.max(...ss.map(s => s.ciclo || 1)) };
}
/* every chapter that was finished (all its planned workouts done), and the campaigns won */
function campanhas(pid) {
  const porPlano = {};
  for (const s of sessoesDe(pid)) if (s.planoId) (porPlano[s.planoId] = porPlano[s.planoId] || []).push(s);
  const caps = Object.entries(porPlano).filter(([, l]) => l.length >= Math.max(1, ...l.map(s => s.total || 0)) && l[0].total).map(([id]) => ({ id, ...lutaChefe(pid, id) }));
  const vencidas = caps.filter(c => c.venceu && c.ciclo % 3 === 0).length;
  return { caps, vencidas };
}

/* ---------- the map of the current chapter ---------- */
const MAPA_W = 96;
function mapaDados(pid) {
  const pr = progresso(pid);
  if (!pr) return null;
  const R = regiaoDe(pr.pl.ciclo), N = pr.total, passo = 12, H = 46 + N * passo + 22;
  const r = rnd(pr.pl.id), fase = r() * 6;
  const nos = Array.from({ length: N }, (_, i) => ({ x: Math.round(48 + 27 * Math.sin(i * 0.82 + fase)), y: H - 20 - i * passo, i, semana: Math.floor(i / pr.nD), deload: !!(pr.pg.semanas[Math.floor(i / pr.nD)] || {}).deload }));
  const chefe = { x: 48, y: 30 };
  const cardios = cardioDe(pid).filter(c => c.planoId === pr.pl.id).length;
  return { pr, R, N, H, nos, chefe, cardios, seed: pr.pl.id };
}
function mapaCanvas(M) {
  const chave = 'mapa:' + M.seed + ':' + M.N + ':' + M.R.id + ':' + M.cardios + ':' + Math.min(M.pr.feitos, M.N);
  return sprite(chave, () => {
    const { R, H, nos, chefe } = M, g = grade(MAPA_W, H), r = rnd(M.seed + 'deco');
    ret(g, 0, 0, MAPA_W, H, R.chao[0]);
    for (let i = 0; i < MAPA_W * H * 0.14; i++) pinta(g, Math.floor(r() * MAPA_W), Math.floor(r() * H), r() < 0.5 ? R.chao[1] : R.chao[2]);
    /* the road: start at the bottom, boss lair at the top */
    const trilha = grade(MAPA_W, H), pts = [{ x: nos[0].x, y: H - 4 }, ...nos, chefe];
    for (let k = 1; k < pts.length; k++) linha(trilha, pts[k - 1].x, pts[k - 1].y, pts[k].x, pts[k].y, R.trilha, 3);
    contorno(trilha, escurece(R.trilha, 0.72));
    /* ponds and scenery away from the road */
    const perto = (x, y, d) => pts.some(p => Math.abs(p.x - x) < d && Math.abs(p.y - y) < d);
    for (let i = 0; i < 2; i++) { const x = 10 + r() * 76, y = 40 + r() * (H - 80); if (!perto(x, y, 16)) elipse(g, x, y, 7 + r() * 4, 4 + r() * 2, R.agua); }
    cola(g, trilha, 0, 0);
    const n = Math.round((MAPA_W * H) / 150);
    for (let i = 0; i < n; i++) {
      const x = Math.floor(r() * (MAPA_W - 12)), y = Math.floor(r() * (H - 16)) + 2;
      if (perto(x + 6, y + 8, 11)) continue;
      cola(g, decorGrade(R.deco[Math.floor(r() * R.deco.length)]), x, y);
    }
    /* village houses beside the light-week stages */
    nos.filter(o => o.deload).forEach((o, k) => { if (k % 2 === 0) cola(g, decorGrade('casa'), o.x + (o.x > 48 ? -18 : 7), o.y - 10); });
    /* the stages */
    nos.forEach(o => {
      const feito = o.i < M.pr.feitos, prox = o.i === M.pr.feitos;
      const cor = feito ? '#F2D25B' : prox ? '#FFFFFF' : escurece(R.trilha, 0.55);
      elipse(g, o.x, o.y, 2.4, 2.4, PX.linha); elipse(g, o.x, o.y, 1.5, 1.5, o.deload && !feito ? '#E7A8D8' : cor);
    });
    /* cardio chests along the road */
    for (let k = 0; k < Math.min(M.cardios, M.N); k++) { const o = nos[Math.min(M.N - 1, Math.round(((k + 0.5) * Math.max(1, M.pr.feitos)) / Math.max(1, M.cardios)))]; cola(g, itemGrade('bau', '#E2B33C'), o.x + (o.x > 48 ? 4 : -16), o.y - 6); }
    cola(g, decorGrade('covil'), chefe.x - 6, chefe.y - 13);
    return g;
  });
}
function mapaHTML(pid, H) {
  const M = mapaDados(pid);
  if (!M) return '';
  const img = mapaCanvas(M), atual = Math.min(M.pr.feitos, M.N), o = atual >= M.N ? M.chefe : M.nos[atual];
  const pct = (x, tot) => ((x / tot) * 100).toFixed(2) + '%';
  const hw = 24, hh = 26, c = M.R.chefe;
  const chefeImg = sprite('c' + c[0] + c[1], () => chefeGrade(c[0], c[1], 0));
  const flags = M.nos.filter(n => n.i < M.pr.feitos).map(n => `<span class="mp-flag" style="left:${pct(n.x - 1, MAPA_W)};top:${pct(n.y - 11, M.H)};width:${pct(12, MAPA_W)}">${imgPx(decor('bandeira', PX.roupa[H.h.roupa] || '#D94A3A'))}</span>`).join('');
  return `<div class="mapa-rpg" style="aspect-ratio:${MAPA_W}/${M.H}">
    <img class="px mp-bg" src="${img.url}" alt="">
    ${flags}
    <span class="mp-boss${M.pr.completo ? ' won' : ''}" style="left:${pct(M.chefe.x - 10, MAPA_W)};top:${pct(M.chefe.y - 26, M.H)};width:${pct(20, MAPA_W)}">${imgPx(chefeImg, '', t('legend_boss'))}</span>
    <span class="mp-hero" style="left:${pct(o.x - hw / 2 + 1, MAPA_W)};top:${pct(o.y - hh + 2, M.H)};width:${pct(hw, MAPA_W)}">${heroiAnimHTML(H, 'parado')}</span>
  </div>
  <div class="mp-leg small">${[['#F2D25B', 'legend_done'], ['#FFFFFF', 'legend_next'], ['#E7A8D8', 'legend_village']].map(([c, k]) => `<span><i style="background:${c}"></i>${t(k)}</span>`).join('')}<span>${imgPx(itemSprite('bau', '#E2B33C'), 'ico')}${t('legend_chest')}</span><span>${imgPx(decor('covil'), 'ico')}${t('legend_boss')}</span></div>`;
}

/* ---------- the journey screen ---------- */
function falaMentor(pid) {
  const pr = progresso(pid);
  if (!pr) return t('m_noplan');
  if (pr.completo) return t('m_done');
  if (pr.sem.deload) return t('m_village');
  if (pr.feitos >= pr.total - 1) return t('m_boss_next');
  return pr.sem.nota ? t('m_week', { n: pr.semana, x: pr.sem.nota }) : t('m_week', { n: pr.semana, x: L3(NOTA_FASE[pr.fase] || NOTA_FASE.accum) });
}
const ITEM_RELIQUIA = { chamado: 'mapa', mentor: 'pergaminho', bota: 'bota', bronze: 'anilha', prata: 'anilha', ouro: 'anilha', lendaria: 'anilha', cinturao: 'cinto', campeao: 'cinto', amuleto: 'amuleto', coroa: 'coroa', calice: 'calice', elixir: 'elixir', folego: 'pulmao', coracao: 'coracao', maratona: 'medalha', selo: 'selo', laco: 'laco' };
const COR_ITEM = c => ({ 'var(--plate-green)': '#3DAA5F', 'var(--plate-blue)': '#3B6FD9', 'var(--plate-red)': '#D9473B', 'var(--plate-yellow)': '#E2B33C', 'var(--plate-white)': '#E8ECF0', 'var(--bronze)': '#B87333', 'var(--silver)': '#C0C6CE' }[c] || '#E2B33C');
function inventarioHTML(d) {
  const rels = reliquiasAtivas();
  return `<div class="inv">${rels.map(r => { const on = r.ok(d), meta = !on && r.meta ? r.meta(d) : null; return `<div class="inv-it${on ? '' : ' off'}" title="${esc(L3(r.nome))}">${imgPx(itemSprite(ITEM_RELIQUIA[r.id] || 'gema', on ? COR_ITEM(r.cor) : '#8D96A3'))}<b>${esc(L3(r.nome))}</b><span>${esc(L3(r.desc))}${meta ? ` · ${Math.min(meta[0], meta[1])}/${meta[1]}` : ''}</span></div>`; }).join('')}</div>`;
}
function premioHTML(pid, H) {
  const pr = progresso(pid), P = PREMIOS[H.classe.id], p = perfil(pid) || {};
  const ciclo = pr ? pr.pl.ciclo : 1, noCamp = ((ciclo - 1) % 3) + 1, faltam = 3 - noCamp + (pr && pr.completo ? 0 : 1);
  return `<div class="card pad premio"><div class="row" style="gap:12px;align-items:center">${imgPx(itemSprite(P.item, P.cor), 'big')}<div class="stack" style="gap:2px;flex:1;min-width:0"><p class="eyebrow">${t('grand_prize')}</p><b>${esc(L3(P.nome))}</b>
    <span class="small muted">${H.camp.vencidas ? esc(t('prize_won_n', { n: H.camp.vencidas })) + ' · ' : ''}${esc(t('campaign_n', { n: Math.ceil(ciclo / 3), a: noCamp }))}${faltam > 0 && faltam <= 3 ? ' · ' + esc(t('prize_left', { n: faltam })) : ''}</span></div></div>
    <div class="row" style="gap:8px;align-items:center">${imgPx(itemSprite('bau', '#E2B33C'), 'ico')}${p.premio ? `<span class="small">${esc(t('prize_real_show', { x: p.premio }))}</span>` : `<button class="btn ghost small" data-a="heroiEditar">${t('prize_set')}</button>`}</div></div>`;
}
function aliadosHTML(pid) {
  const outros = S.ordem.filter(p => p !== pid && S.perfis[p]);
  if (!outros.length) return '';
  return `<div class="stack"><h2 class="h3">${t('allies_map')}</h2><div class="aliados">${outros.map(p => {
    const H = heroiDe(p), pr = progresso(p);
    return `<div class="aliado">${heroiAnimHTML(H, 'parado', 'mini')}<div class="stack" style="gap:2px;min-width:0"><b>${esc(H.nome)}</b><span class="xs muted">${esc(L3(H.classe.nome))} · ${t('level_n', { n: H.d.nivel.n })}</span><span class="xs muted">${pr ? esc(t('ally_at', { r: L3(regiaoDe(pr.pl.ciclo).nome), a: Math.min(pr.feitos, pr.total), b: pr.total })) : t('ally_noplan')}</span></div></div>`;
  }).join('')}</div></div>`;
}
function viewMundo(sub) {
  const pid = S.me, d = jornadaDados(pid), H = heroiDe(pid, d), nv = d.nivel, pr = progresso(pid), p = perfil(pid) || {};
  const pct = clamp(((d.xp - nv.base) / (nv.prox - nv.base)) * 100, 0, 100);
  const cab = `<div class="hero rpg-top">
      <div class="rpg-heroi">${heroiAnimHTML(H, 'parado', 'grande')}</div>
      <div class="stack" style="gap:4px;min-width:0;flex:1">
        <p class="eyebrow">${esc(L3(H.classe.nome))} · ${t('level_n', { n: nv.n })}</p>
        <h1 class="h-display h2">${esc(H.nome || p.nome || '')}</h1>
        <span class="pill acc" style="align-self:flex-start">${esc(nv.titulo)}</span>
        <div class="xp"><div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div><span class="xs muted num">${d.xp - nv.base} / ${nv.prox - nv.base} XP</span></div>
        <button class="btn ghost small" data-a="heroiEditar" style="align-self:flex-start">${H.criado ? t('hero_edit') : t('hero_create')}</button>
      </div></div>`;
  const convite = H.criado ? '' : `<div class="note">${t('hero_create_text')}</div>`;
  const mentor = `<div class="mentor">${mentorAnimHTML('m')}<div class="balao"><b>${t('mentor_name')}</b><span>${esc(falaMentor(pid))}</span>${AI.on ? `<button class="btn quiet small" data-a="tab" data-tab="coach">${t('mentor_talk')}</button>` : ''}${pr && pr.completo ? `<button class="btn small" data-a="gerar" data-modo="proximo">${t('next_chapter')}</button>` : !pr ? `<button class="btn small" data-a="tab" data-tab="plano">${t('go_plan')}</button>` : ''}</div></div>`;
  const regiao = pr ? `<div class="row between" style="align-items:flex-end"><h2 class="h3">${esc(t('chapter_region', { n: pr.pl.ciclo, r: L3(regiaoDe(pr.pl.ciclo).nome) }))}</h2><span class="small muted num">${esc(t('stages_won', { a: Math.min(pr.feitos, pr.total), b: pr.total }))}</span></div>` : '';
  return `<section class="screen">
    ${sub}
    ${cab}${convite}
    ${mentor}
    ${pr ? `<div class="stack">${regiao}${mapaHTML(pid, H)}</div>` : ''}
    ${premioHTML(pid, H)}
    ${aliadosHTML(pid)}
    <div class="stack"><div class="row between"><h2 class="h3">${t('inventory')}</h2><span class="small muted num">${t('of_n', { a: reliquiasAtivas().filter(r => r.ok(d)).length, b: reliquiasAtivas().length })}</span></div>${inventarioHTML(d)}</div>
    <div class="stats four"><div class="stat"><b class="num">${d.treinos}</b><span>${t('st_workouts')}</span></div><div class="stat"><b class="num">${Math.round(d.cardioMin)}</b><span>${t('st_cardio_min')}</span></div><div class="stat"><b class="num">${d.prs}</b><span>${t('st_records')}</span></div><div class="stat"><b class="num">${d.seq}</b><span>${t('st_streak')}</span></div></div>
    <details class="box"><summary>${t('boss_how')}</summary><div class="in"><p class="small">${t('boss_how_text')}</p></div></details>
    <details class="box"><summary>${t('how_xp')}</summary><div class="in stack">
      <ul class="small stack" style="margin:0;padding-left:18px">
        <li>${t('xp_i1', { n: XP.treino })}</li><li>${t('xp_i2', { n: XP.serie })}</li><li>${t('xp_i3', { n: XP.recorde })}</li><li>${t('xp_i4', { n: XP.semana })}</li>
        <li>${t('xp_i5', { n: XP.deload })}</li><li>${t('xp_i6', { n: XP.ciclo })}</li><li>${t('xp_i7', { n: XP.cardio, m: XP.cardioMin })}</li><li>${t('xp_i8', { n: XP.cardioSemana })}</li></ul>
      <p class="small muted">${t('xp_note')}</p></div></details>
  </section>`;
}

/* ---------- hero creator ---------- */
function abrirCriador() {
  const pid = S.me, p = perfil(pid) || {};
  S.heroiDraft = { ...HEROI_PADRAO, nome: p.nome || '', ...(p.heroi || {}), premio: p.premio || '' };
  openSheet(t(p.heroi ? 'hero_edit' : 'hero_create'), criadorHTML(), () => { S.heroiDraft = null; });
  const cab = $('.sheet-h'), painel = $('#sheetP');
  if (cab && painel) painel.style.setProperty('--sheet-h', cab.offsetHeight + 'px');
}
function criadorHTML() {
  const h = S.heroiDraft, pid = S.me, p = perfil(pid) || {}, d = jornadaDados(pid), cl = classeDe(p.objetivo);
  const H = { h, classe: cl, nome: h.nome, tier: tierDe(d.nivel.n), arma: cl.arma, material: null };
  const nomes = k => L3(STR[k]).split('|');
  const sw = (k, cores) => `<div class="sw">${cores.map((c, i) => `<button data-a="heroiSet" data-k="${k}" data-v="${i}" aria-pressed="${h[k] === i}" style="background:${c}" aria-label="${k} ${i + 1}"></button>`).join('')}</div>`;
  const chips = (k, rot) => `<div class="chips">${rot.map((r, i) => `<button class="chip" data-a="heroiSet" data-k="${k}" data-v="${i}" aria-pressed="${h[k] === i}">${esc(r)}</button>`).join('')}</div>`;
  return `<div class="stack criador">
    <div class="cr-prev">${heroiAnimHTML(H, 'anda', 'grande')}</div>
    <p class="small" style="text-align:center"><b>${esc(t('hero_class', { c: L3(cl.nome) }))}</b><br><span class="muted">${esc(t('hero_class_why', { g: nomeObj(p.objetivo) }))}</span></p>
    <label class="f" for="hr-nome">${t('hero_name')}<input class="inp" id="hr-nome" data-in="heroiNome" maxlength="18" value="${esc(h.nome)}"></label>
    <p class="eyebrow">${t('hero_body')}</p>${chips('corpo', [L3(STR.body_a), L3(STR.body_b)])}
    <p class="eyebrow">${t('hero_skin')}</p>${sw('pele', PX.pele)}
    <p class="eyebrow">${t('hero_hair')}</p>${chips('cabelo', nomes('hair_names'))}
    <p class="eyebrow">${t('hero_hair_color')}</p>${sw('corCabelo', PX.cabelo)}
    <p class="eyebrow">${t('hero_beard')}</p>${chips('barba', nomes('beard_names'))}
    <p class="eyebrow">${t('hero_outfit')}</p>${sw('roupa', PX.roupa)}
    <p class="eyebrow">${t('prize_real')}</p><label class="f" for="hr-premio">${t('prize_real_text')}<input class="inp" id="hr-premio" data-in="heroiPremio" maxlength="60" value="${esc(h.premio)}" placeholder="${t('prize_real_ph')}"></label>
    <button class="btn ok big block" data-a="heroiSalvar">${t('hero_save')}</button>
  </div>`;
}
function atualizarCriador() {
  const prev = $('.cr-prev');
  if (!prev || !S.heroiDraft) return;
  const h = S.heroiDraft, pid = S.me, p = perfil(pid) || {}, d = jornadaDados(pid), cl = classeDe(p.objetivo);
  prev.innerHTML = heroiAnimHTML({ h, classe: cl, nome: h.nome, tier: tierDe(d.nivel.n), arma: cl.arma, material: null }, 'anda', 'grande');
  document.querySelectorAll('.criador [data-a="heroiSet"]').forEach(b => b.setAttribute('aria-pressed', String(h[b.dataset.k] === Number(b.dataset.v))));
}
async function salvarHeroi() {
  const pid = S.me, p = perfil(pid), h = S.heroiDraft;
  if (!p || !h) return;
  const { premio, ...heroi } = h;
  heroi.nome = String(heroi.nome || '').trim().slice(0, 18) || p.nome;
  const body = { ...p, heroi, premio: String(premio || '').trim().slice(0, 60), atualizadoEm: Date.now() };
  try { await save('perfis/' + pid, body, t('hero_saved')); } catch { return; }
  S.perfis[pid] = body; S.heroiDraft = null;
  closeSheet(); render();
}

/* ---------- the battle at the end of each workout ---------- */
const Batalha = { raf: 0, fim: false };
function batalhaHTML() { return `<div class="batalha"><canvas id="batalhaCv" width="512" height="288" data-a="batalhaPular" aria-label="${esc(t('tap_skip'))}"></canvas><p class="small" id="batalhaTxt"></p></div>`; }
function quadrosHeroi(H) { const ex = extraHeroi(H); return Object.fromEntries(['parado0', 'parado1', 'anda0', 'anda1', 'ataque', 'vitoria'].map(q => [q, heroiSprite(H.h, q, ex)])); }
function branco(s) {
  return sprite('w:' + s.chave, () => {
    const ctx = s.cv.getContext('2d'), d = ctx.getImageData(0, 0, s.w, s.h).data, g = grade(s.w, s.h);
    for (let i = 0; i < s.w * s.h; i++) if (d[i * 4 + 3] > 0) g.px[i] = '#FFFFFF';
    return g;
  });
}
/* info for the scene: the region, the stage number, the monster of the day, partner, records, boss */
function cenaDoTreino(pid, sess, prs, chefeAgora) {
  const pr = progresso(pid), ciclo = (pr && pr.pl.ciclo) || sess.ciclo || 1, R = regiaoDe(ciclo), r = rnd((sess.planoId || '') + (sess.inicio || ''));
  const hoje = dayKey(sess.inicio || Date.now());
  const aliado = S.ordem.find(p => p !== pid && S.sessoes.some(s => s.pid === p && dayKey(s.inicio) === hoje));
  const n = sessoesDe(pid).filter(s => s.planoId === sess.planoId).length;
  return { R, pid, n, monstro: MONSTROS[Math.floor(r() * MONSTROS.length)], aliado, prs: prs.length, chefe: chefeAgora ? lutaChefe(pid, sess.planoId) : null, final: chefeAgora && ciclo % 3 === 0 };
}
function iniciarBatalha(C) {
  cancelAnimationFrame(Batalha.raf);
  const cv = $('#batalhaCv');
  if (!cv) return;
  const ctx = cv.getContext('2d'), E = 4, W = 128, Hh = 72;
  ctx.imageSmoothingEnabled = false;
  const H = heroiDe(C.pid), QH = quadrosHeroi(H), A = C.aliado ? heroiDe(C.aliado) : null, QA = A ? quadrosHeroi(A) : null;
  const inimigo = C.chefe ? [0, 1].map(q => sprite('c' + C.R.chefe[0] + C.R.chefe[1] + q, () => chefeGrade(C.R.chefe[0], C.R.chefe[1], q)))
    : [0, 1].map(q => sprite('m' + C.monstro + C.R.monstro + q, () => monstroGrade(C.monstro, C.R.monstro, q)));
  const bau = itemSprite('bau', '#E2B33C'), gema = itemSprite('gema', '#7FE3FF'), P = PREMIOS[H.classe.id], premio = itemSprite(P.item, P.cor);
  const golpes = C.chefe ? C.chefe.partes.filter(p => p[2] > 0) : [['', '', 34], ['', '', 33], ['', '', 33]];
  const totalDano = C.chefe ? Math.min(100, C.chefe.dano) : 100, venceu = C.chefe ? C.chefe.venceu : true;
  const T0 = 900, TG = 700, tGolpes = T0 + 500 + golpes.length * TG, TFIM = tGolpes + 2200;
  const fala = $('#batalhaTxt');
  let ultimoTxt = '';
  const txt = s => { if (s !== ultimoTxt && fala) { fala.textContent = s; ultimoTxt = s; } };
  const desenha = (s, x, y, alpha = 1) => { ctx.globalAlpha = alpha; ctx.drawImage(s.cv, Math.round(x) * E, Math.round(y) * E, s.w * E, s.h * E); ctx.globalAlpha = 1; };
  const r = rnd(C.R.id + 'cena');
  const fundo = sprite('cena:' + C.R.id, () => {
    const g = grade(W, Hh), cor = C.R;
    for (let y = 0; y < 47; y++) ret(g, 0, y, W, 1, mistura(cor.ceu[0], cor.ceu[1], y / 46));
    const altos = cor.deco.filter(d => d !== 'osso' && d !== 'pedra');
    for (let i = 0; i < 5; i++) { const x = Math.floor(r() * (W - 12)); cola(g, decorGrade(altos[i % altos.length] || 'arbusto'), x, 32 + Math.floor(r() * 4)); }
    ret(g, 0, 46, W, 26, cor.chao[0]);
    for (let i = 0; i < 260; i++) pinta(g, Math.floor(r() * W), 46 + Math.floor(r() * 26), r() < 0.5 ? cor.chao[1] : cor.chao[2]);
    ret(g, 0, 58, W, 3, cor.trilha); ret(g, 0, 57, W, 1, escurece(cor.trilha, 0.75)); ret(g, 0, 61, W, 1, escurece(cor.trilha, 0.75));
    return g;
  });
  const ini = performance.now();
  Batalha.fim = false;
  const quadro = agora => {
    if (!$('#batalhaCv')) return;
    Batalha.raf = requestAnimationFrame(quadro);
    const t2 = Batalha.fim ? TFIM : Math.max(0, agora - ini), f = Math.floor(t2 / 180) & 1;
    ctx.clearRect(0, 0, cv.width, cv.height);
    desenha(fundo, 0, 0);
    const chao = 60, ex = C.chefe ? 78 : 88, ey = chao - inimigo[0].h + 2;
    /* who is hitting and how much life is left */
    let hp = 1, golpeAtual = -1, flash = false;
    if (t2 > T0 + 500) {
      golpeAtual = Math.min(golpes.length - 1, Math.floor((t2 - T0 - 500) / TG));
      const dentro = (t2 - T0 - 500) % TG, feitos = golpes.slice(0, golpeAtual + (dentro > 200 || t2 > tGolpes ? 1 : 0)).reduce((n, g) => n + g[2], 0);
      hp = clamp(1 - Math.min(feitos, totalDano) / 100, 0, 1);
      flash = dentro > 150 && dentro < 300 && t2 < tGolpes;
    }
    const derrotado = t2 > tGolpes && venceu, fugiu = t2 > tGolpes && !venceu;
    /* enemy */
    if (!derrotado) {
      const xx = fugiu ? ex + (t2 - tGolpes) / 12 : ex;
      desenha(flash ? branco(inimigo[0]) : inimigo[f], xx, ey);
    } else if (t2 < tGolpes + 500) {
      const k = (t2 - tGolpes) / 500;
      for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; ctx.fillStyle = i % 2 ? '#FFFFFF' : '#FFE58A'; ctx.fillRect((ex + inimigo[0].w / 2 + Math.cos(a) * k * 18) * E, (ey + inimigo[0].h / 2 + Math.sin(a) * k * 14) * E, E * 2, E * 2); }
    }
    /* HP bar */
    if (!derrotado && !fugiu) { ctx.fillStyle = '#1B1D26'; ctx.fillRect(ex * E, (ey - 6) * E, 30 * E, 3 * E); ctx.fillStyle = hp > 0.4 ? '#5DD15D' : '#E8572A'; ctx.fillRect((ex + 0.5) * E, (ey - 5.5) * E, Math.max(0, 29 * hp) * E, 2 * E); }
    /* heroes */
    const entra = clamp(t2 / T0, 0, 1), hx = -24 + entra * (C.chefe ? 46 : 52), ataca = golpeAtual >= 0 && t2 < tGolpes && (t2 - T0 - 500) % TG < 260;
    const qh = t2 < T0 ? (f ? QH.anda0 : QH.anda1) : derrotado ? QH.vitoria : ataca ? QH.ataque : f ? QH.parado0 : QH.parado1;
    if (A) { const ax = hx - 20, ataA = golpeAtual >= 0 && t2 < tGolpes && (t2 - T0 - 500) % TG > 330 && (t2 - T0 - 500) % TG < 560; desenha(t2 < T0 ? (f ? QA.anda1 : QA.anda0) : derrotado ? QA.vitoria : ataA ? QA.ataque : QA.parado0, ax + (ataA ? 6 : 0), chao - 25); }
    desenha(qh, hx + (ataca ? 6 : 0), chao - 25);
    /* damage numbers */
    if (golpeAtual >= 0 && t2 < tGolpes) {
      const dentro = (t2 - T0 - 500) % TG, g = golpes[golpeAtual];
      if (dentro > 150) {
        ctx.font = `bold ${E * 7}px ui-monospace, monospace`; ctx.textAlign = 'center'; ctx.lineWidth = E * 1.6; ctx.strokeStyle = '#1B1D26'; ctx.fillStyle = '#FFE58A';
        const y = (ey - 8 - (dentro - 150) / 40) * E, x = (ex + inimigo[0].w / 2) * E, s = (g[0] ? t(g[0]) + ' ' : '') + '-' + g[2];
        ctx.strokeText(s, x, y); ctx.fillText(s, x, y);
      }
    }
    /* loot */
    if (derrotado && t2 > tGolpes + 400) {
      const k = clamp((t2 - tGolpes - 400) / 400, 0, 1), y = chao - 14 - Math.sin(k * Math.PI) * 10;
      desenha(C.final ? premio : bau, ex + 6, y);
      if (C.prs && !C.chefe) desenha(gema, ex + 22, y - 2 + (f ? 1 : 0));
    }
    if (t2 < T0) txt(C.chefe ? t('boss_hp') + ' · ' + L3(C.R.nome) : t('stage_n', { n: C.n }));
    else if (t2 < tGolpes) txt(C.chefe ? golpes.map(g => `${t(g[0])} ${g[1]}`).join(' · ') : A ? t('duo_attack') : t('stage_n', { n: C.n }));
    else txt(C.chefe ? (venceu ? t('boss_won') + (C.final ? ' ' + L3(P.nome) + '!' + ((perfil(C.pid) || {}).premio ? ' ' + t('prize_real_show', { x: perfil(C.pid).premio }) : '') : '') : t('boss_fled')) : t('stage_won', { n: C.n }) + (C.prs ? ' ' + t('rare_loot') : ''));
    if (t2 >= TFIM && Batalha.fim) cancelAnimationFrame(Batalha.raf);
  };
  Batalha.raf = requestAnimationFrame(quadro);
}
