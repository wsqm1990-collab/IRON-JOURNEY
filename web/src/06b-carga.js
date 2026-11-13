/* ---------- load calculator ----------
   Exact weight for every set, plates per side, dumbbell per hand, machine pin, warm-ups.
   Set 1 of each exercise is the day's test: from what you actually do, the next sets are
   recalculated (estimated 1RM with reps in reserve, Epley) and rounded to what your gym has. */
const PESOS_PADRAO = { anilhas: [20, 15, 10, 5, 2.5, 1.25], barra: 20, barraW: 10, smith: 15, halterMax: 40, halterPasso: 2, maquina: 5, polia: 5 };
const ANILHAS_OPC = [25, 20, 15, 10, 5, 4, 3, 2.5, 2, 1.25, 1, 0.5];
const pesosGym = () => ({ ...PESOS_PADRAO, ...((S.gym && S.gym.pesos) || {}) });

/* how the weight is made: plates on a bar, plates on a machine (both sides or one), dumbbells, a pin */
const CARGA2 = ['leg_press', 'hack', 'pendulo', 'pant_leg'];
const CARGA1 = ['pant_sentado', 'remada_cavalinho'];
const HALTER1 = ['goblet', 'agach_sumo', 'serrote', 'stiff_unilateral', 'triceps_frances'];
const BARRA_W = ['triceps_testa', 'rosca_scott'];
const MOCHILA = ['remada_mochila', 'rosca_mochila', 'agach_mochila'], KETTLE = ['kb_swing'];
function tipoCarga(ex) {
  if (MOCHILA.includes(ex.id)) return 'mochila';
  if (KETTLE.includes(ex.id)) return 'kettle';
  if (CARGA2.includes(ex.id)) return 'carga2';
  if (CARGA1.includes(ex.id)) return 'carga1';
  if (HALTER1.includes(ex.id)) return 'halter1';
  return { b: 'barra', h: 'halter', m: 'maquina', p: 'polia' }[ex.carga] || null;
}
function barraDe(ex, P) {
  if (/smith/.test(ex.id)) return P.smith;
  if (BARRA_W.includes(ex.id) && equipSet(S.gym).has('barra_w')) return P.barraW;
  return P.barra;
}

/* plates: which per-side totals can be made, and the fewest plates for each (any number of each plate) */
const PLACAS_CACHE = {};
function placas(lista) {
  const chave = lista.join(',');
  if (PLACAS_CACHE[chave]) return PLACAS_CACHE[chave];
  const U = 4, max = 250 * U, tam = lista.map(p => Math.round(p * U)).filter(p => p > 0).sort((a, b) => b - a);
  const cont = new Array(max + 1).fill(Infinity), de = new Array(max + 1).fill(0);
  cont[0] = 0;
  for (let s = 1; s <= max; s++) for (const p of tam) if (p <= s && cont[s - p] + 1 < cont[s]) { cont[s] = cont[s - p] + 1; de[s] = p; }
  return (PLACAS_CACHE[chave] = { U, max, cont, de });
}
/* with a standard plate set (has 1.25 kg) loads stay on 1.25 kg per side: 60, 62.5, 65... not 63.5 */
function ladoPossivel(kgLado, lista, dir) {
  const T = placas(lista), x = Math.max(0, kgLado) * T.U, st = lista.includes(1.25) ? Math.round(1.25 * T.U) : 1;
  const alvo = dir < 0 ? Math.floor(x + 1e-9) : dir > 0 ? Math.ceil(x - 1e-9) : Math.round(x);
  if (alvo <= 0) return 0;
  for (let d = 0; d <= T.max; d++) {
    const cands = dir < 0 ? [alvo - d] : dir > 0 ? [alvo + d] : [alvo - d, alvo + d];
    for (const c of cands) if (c >= 0 && c <= T.max && c % st === 0 && Number.isFinite(T.cont[c])) return c / T.U;
  }
  return 0;
}
function placasDoLado(kgLado, lista) {
  const T = placas(lista), out = [];
  let s = Math.round(kgLado * T.U);
  while (s > 0 && Number.isFinite(T.cont[s])) { out.push(T.de[s] / T.U); s -= T.de[s]; }
  return out;
}
function listaHalteres(P) {
  const out = [];
  for (let k = 1; k <= Math.min(10, P.halterMax); k++) out.push(k);
  for (let k = 10 + P.halterPasso; k <= P.halterMax; k += P.halterPasso) out.push(k);
  return out;
}
const arredPasso = (kg, passo, dir) => (dir < 0 ? Math.floor(kg / passo + 1e-9) : dir > 0 ? Math.ceil(kg / passo - 1e-9) : Math.round(kg / passo)) * passo;
/* nearest weight you can actually load (dir -1 = not above, +1 = not below) */
function arredondar(ex, kg, dir = 0) {
  const P = pesosGym(), tipo = tipoCarga(ex);
  if (kg == null || !Number.isFinite(kg)) return null;
  if (tipo === 'barra' || tipo === 'carga2') {
    const bar = tipo === 'barra' ? barraDe(ex, P) : 0;
    if (kg <= bar) return bar;
    return bar + 2 * ladoPossivel((kg - bar) / 2, P.anilhas, dir);
  }
  if (tipo === 'carga1') return ladoPossivel(kg, P.anilhas, dir);
  if (tipo === 'halter' || tipo === 'halter1') {
    const L = listaHalteres(P);
    const abaixo = L.filter(k => k <= kg + 1e-9), acima = L.filter(k => k >= kg - 1e-9);
    if (dir < 0) return abaixo.length ? abaixo[abaixo.length - 1] : L[0];
    if (dir > 0) return acima.length ? acima[0] : L[L.length - 1];
    return L.reduce((m, k) => (Math.abs(k - kg) < Math.abs(m - kg) ? k : m), L[0]);
  }
  if (tipo === 'maquina' || tipo === 'polia') { const passo = tipo === 'polia' ? P.polia : P.maquina; return Math.max(passo, arredPasso(kg, passo, dir)); }
  if (tipo === 'mochila') return Math.max(1, arredPasso(kg, 1, dir));
  if (tipo === 'kettle') return Math.max(4, arredPasso(kg, 2, dir));
  return Math.round(kg * 2) / 2;
}
/* "20 + 10 + 2.5 each side" and friends */
function comoMontar(ex, kg) {
  if (kg == null) return '';
  const P = pesosGym(), tipo = tipoCarga(ex), f = fmtKg;
  if (tipo === 'barra' || tipo === 'carga2') {
    const bar = tipo === 'barra' ? barraDe(ex, P) : 0, lado = Math.max(0, (kg - bar) / 2), pl = placasDoLado(lado, P.anilhas);
    const barTxt = tipo === 'barra' ? t(/smith/.test(ex.id) ? 'mt_smith' : BARRA_W.includes(ex.id) && bar === P.barraW ? 'mt_barw' : 'mt_bar', { b: f(bar) }) : '';
    if (!pl.length) return tipo === 'barra' ? t('mt_only_bar', { b: f(bar) }) : t('mt_no_plates');
    return [barTxt, t('mt_each_side', { p: pl.map(f).join(' + ') })].filter(Boolean).join(' · ');
  }
  if (tipo === 'carga1') { const pl = placasDoLado(kg, P.anilhas); return pl.length ? t('mt_plates', { p: pl.map(f).join(' + ') }) : ''; }
  if (tipo === 'halter') return t(ex.id === 'coice_caneleira' ? 'mt_ankle' : 'mt_db_each', { k: f(kg) });
  if (tipo === 'halter1') return t('mt_db_one', { k: f(kg) });
  if (tipo === 'maquina') return t('mt_pin', { k: f(kg) });
  if (tipo === 'polia') return t('mt_cable', { k: f(kg) });
  if (tipo === 'mochila') return t('mt_backpack', { k: f(kg) });
  if (tipo === 'kettle') return t('mt_kb', { k: f(kg) });
  return '';
}

/* the same, drawn: plates as little blocks sized and coloured by weight (competition colours) */
const COR_PLACA = { 25: 'k25', 20: 'k20', 15: 'k15', 10: 'k10', 5: 'k5' };
function montarHTML(ex, kg) {
  if (kg == null) return '';
  const P = pesosGym(), tipo = tipoCarga(ex);
  if (!['barra', 'carga2', 'carga1'].includes(tipo)) return esc(comoMontar(ex, kg));
  const bar = tipo === 'barra' ? barraDe(ex, P) : 0, lado = tipo === 'carga1' ? kg : Math.max(0, (kg - bar) / 2), pl = placasDoLado(lado, P.anilhas);
  if (!pl.length) return esc(comoMontar(ex, kg));
  const barTxt = tipo === 'barra' ? t(/smith/.test(ex.id) ? 'mt_smith' : BARRA_W.includes(ex.id) && bar === P.barraW ? 'mt_barw' : 'mt_bar', { b: fmtKg(bar) }) + ' · ' : '';
  const blocos = pl.map(p => `<i class="${COR_PLACA[p] || ''}" style="--h:${Math.round(13 + 15 * Math.sqrt(Math.min(p, 25) / 25))}">${fmtKg(p)}</i>`).join('');
  return `${esc(barTxt)}${esc(t(tipo === 'carga1' ? 'mt_plates_l' : 'mt_each_side_l'))} <span class="plates" role="img" aria-label="${esc(pl.map(fmtKg).join(' + '))} kg">${blocos}</span>`;
}

/* strength estimates: 1RM from a set with reps in reserve (Epley), and back */
const e1rmRIR = (kg, reps, rir) => kg * (1 + (reps + (rir || 0)) / 30);
const kgPara = (e1, reps, rir) => e1 / (1 + (reps + (rir || 0)) / 30);
const repsPara = (e1, kg, rir) => Math.floor(30 * (e1 / kg - 1) - (rir || 0) + 1e-6);

/* first time ever: a deliberately light start from body weight, sex and level (typical gym ratios) */
const RAZAO = {
  supino_reto_barra: 1, supino_inclinado_barra: 0.85, supino_reto_smith: 0.95, supino_inclinado_smith: 0.8, supino_reto_halteres: 0.38, supino_inclinado_halteres: 0.32, supino_maquina: 0.9, crucifixo_halteres: 0.16, crossover: 0.25, voador: 0.6,
  puxada_frente: 0.85, puxada_neutra: 0.85, puxada_unilateral: 0.4, remada_curvada: 0.85, serrote: 0.4, remada_apoiada: 0.3, remada_baixa: 0.85, remada_maquina: 0.85, remada_cavalinho: 0.7, pulldown_bracos: 0.35,
  desenv_halteres: 0.25, desenv_barra: 0.6, desenv_smith: 0.6, desenv_maquina: 0.6, elev_lateral: 0.1, elev_lateral_polia: 0.08, elev_lateral_maquina: 0.35, crucifixo_inverso: 0.4, crucifixo_inverso_h: 0.08, face_pull: 0.35,
  rosca_barra: 0.45, rosca_alternada: 0.18, rosca_martelo: 0.2, rosca_inclinada: 0.15, rosca_scott: 0.35, rosca_polia: 0.4, rosca_bayesian: 0.15,
  triceps_corda: 0.35, triceps_barra_polia: 0.45, triceps_overhead: 0.35, triceps_frances: 0.3, triceps_testa: 0.4, supino_fechado: 0.85,
  agachamento: 1.25, agachamento_smith: 1.15, hack: 1.5, pendulo: 1.3, leg_press: 2.5, leg_horizontal: 1.8, bulgaro: 0.25, afundo: 0.25, goblet: 0.45, extensora: 0.9, step_up: 0.2,
  stiff: 1.1, stiff_unilateral: 0.35, terra: 1.5, mesa_flexora: 0.5, cadeira_flexora: 0.6,
  hip_thrust: 1.4, hip_thrust_smith: 1.3, hip_thrust_maq: 1.3, coice_polia: 0.2, gluteo_maquina: 0.5, abdutora: 0.8, coice_caneleira: 0.05, agach_sumo: 0.5, adutora: 0.8,
  pant_pe: 1.3, pant_sentado: 0.9, pant_leg: 1.8, pant_smith: 1.1, abd_polia: 0.6,
};
const INFERIOR = ['quadriceps', 'posteriores', 'gluteos', 'adutores', 'panturrilhas'];
function e1Inicial(ex, p) {
  const r = RAZAO[ex.id];
  if (!r) return null;
  const peso = parseNum(p.peso) || (p.sexo === 'f' ? 62 : p.sexo === 'm' ? 75 : 70);
  const sexo = p.sexo === 'f' ? (INFERIOR.includes(ex.grupo) ? 0.75 : 0.55) : 1;
  const nivel = { iniciante: 0.6, intermediario: 1, avancado: 1.3 }[p.nivel] || 0.8;
  return peso * r * sexo * nivel;
}

/* the plan for one exercise today: weight and exact reps for every set, test-set rules */
function planoCarga(pid, item, alv, sug, casa = false) {
  const ex = exInfo(item.id, item.nome), tipo = tipoCarga(ex), p = perfil(pid) || {};
  const rir = alv.deload ? Math.max(alv.rir, 3) : alv.rir;
  const meio = Math.round((alv.rmin + alv.rmax) / 2);
  /* same weight on every set: about one rep less every two sets from fatigue */
  const cansaco = (base, j) => clamp(base - Math.floor(j / 2), alv.rmin, alv.rmax);
  if (!tipo) {
    const ult = sug && sug.ult && sug.ult.length ? Math.max(...sug.ult.map(u => u[1])) : null;
    const alvoR = ult ? clamp(ult + 1, alv.rmin, alv.rmax) : alv.rmax;
    return { tipo: null, rir, sets: Array.from({ length: alv.series }, (_, j) => ({ kg: null, alvo: cansaco(alvoR, j) })), teste: true, primeira: !ult, e1: null };
  }
  let e1 = null, kg = null, primeira = false;
  const u = ultimaVez(pid, item.id, casa);
  if (u) {
    const feitos = u.x.sets.filter(z => z.ok && z.reps > 0 && z.kg > 0);
    if (feitos.length) e1 = Math.max(...feitos.map(z => e1rmRIR(z.kg, z.reps, z.rir != null ? z.rir : (u.s.rir != null ? u.s.rir : rir))));
  }
  if (sug && sug.kg != null) kg = arredondar(ex, sug.kg, 0);
  else if (e1) kg = arredondar(ex, kgPara(e1, meio, rir), -1);
  else { const e = e1Inicial(ex, p); primeira = true; if (e) { e1 = null; kg = arredondar(ex, kgPara(e, alv.rmax, rir) * 0.8, -1); } }
  if (alv.deload && kg != null) kg = arredondar(ex, kg * 0.9, -1);
  const base = e1 && kg ? clamp(repsPara(e1, kg, rir), alv.rmin, alv.rmax) : alv.rmax;
  return { tipo, rir, teste: true, primeira, e1, sets: Array.from({ length: alv.series }, (_, j) => ({ kg, alvo: cansaco(base, j) })) };
}

/* after a set: recalculate the next ones from what you really did */
function recalibrar(x, j) {
  const ex = exInfo(x.id, x.nome), pc = x.carga;
  if (!pc) return null;
  const z = x.sets[j], a = x.alvo;
  if (!pc.tipo) {
    /* body weight: the next sets aim at what you just did, minus a little fatigue */
    if (!(z.reps > 0)) return null;
    let k = 0;
    for (let i = j + 1; i < x.sets.length; i++) {
      const s = x.sets[i];
      if (s.ok) continue;
      k++;
      s.alvo = clamp(z.reps - Math.floor(k / 2), Math.min(a.rmin, z.reps), Math.max(a.rmax, z.reps));
    }
    x.calib = { k: 'cal_bw', v: { n: j + 1, r: z.reps, u: unidade(ex) } };
    return x.calib;
  }
  if (!(z.kg > 0 && z.reps > 0)) return null;
  const e1 = e1rmRIR(z.kg, z.reps, pc.rir);
  pc.e1 = e1;
  if (pc.fixo) {
    /* at home the weight is what you have: keep it and set the reps that give the planned effort */
    let k = 0;
    for (let i = j + 1; i < x.sets.length; i++) {
      const s = x.sets[i];
      if (s.ok || s.manual) continue;
      k++;
      s.kg = z.kg;
      s.alvo = clamp(repsPara(e1, z.kg, pc.rir) - Math.floor(k / 2), a.rmin, Math.max(a.rmax, 30));
    }
    x.calib = { k: 'cal_home', v: { n: j + 1, r: z.reps, kg: fmtKg(z.kg) } };
    return x.calib;
  }
  let novo = z.kg, motivo = 'cal_keep';
  const prevista = repsPara(e1, z.kg, pc.rir) - 1;
  if (z.reps > a.rmax || prevista > a.rmax) { novo = arredondar(ex, kgPara(e1, Math.max(a.rmin, a.rmax - 1), pc.rir), -1); motivo = novo > z.kg ? 'cal_up' : 'cal_keep'; }
  else if (z.reps < a.rmin) { novo = arredondar(ex, kgPara(e1, Math.min(a.rmax, a.rmin + 1), pc.rir) * 0.97, -1); motivo = novo < z.kg ? 'cal_down' : 'cal_keep'; }
  let k = 0;
  for (let i = j + 1; i < x.sets.length; i++) {
    const s = x.sets[i];
    if (s.ok || s.manual) continue;
    k++;
    s.kg = novo;
    s.alvo = clamp(repsPara(e1, novo, pc.rir) - Math.floor(k / 2), a.rmin, a.rmax);
  }
  x.calib = { k: motivo, v: { n: j + 1, r: z.reps, kg: fmtKg(z.kg), novo: fmtKg(novo) } };
  return x.calib;
}

/* warm-up before the first heavy exercise of each muscle group */
function aquecimento(ex, kg) {
  const tipo = tipoCarga(ex);
  if (!kg || ex.tipo !== 'C' || !['barra', 'carga2', 'maquina', 'halter'].includes(tipo)) return [];
  const P = pesosGym(), bar = tipo === 'barra' ? barraDe(ex, P) : 0;
  const passos = tipo === 'barra' ? [[0.5, 8], [0.7, 4], [0.85, 2]] : [[0.5, 10], [0.75, 5]];
  const out = [];
  if (tipo === 'barra' && kg >= bar * 2) out.push({ kg: bar, reps: 10 });
  for (const [f, r] of passos) {
    const w = arredondar(ex, kg * f, -1);
    if (w && w < kg && (!out.length || w > out[out.length - 1].kg)) out.push({ kg: w, reps: r });
  }
  return kg < (tipo === 'barra' ? bar + 10 : 10) ? [] : out;
}

Object.assign(STR, {
  mt_bar: ['Bar {b} kg', 'Barra de {b} kg', 'Barra de {b} kg'], mt_barw: ['EZ bar {b} kg', 'Barra W de {b} kg', 'Barra Z de {b} kg'], mt_smith: ['Smith bar {b} kg', 'Barra do Smith {b} kg', 'Barra del Smith {b} kg'],
  mt_only_bar: ['Just the bar ({b} kg)', 'Só a barra ({b} kg)', 'Solo la barra ({b} kg)'], mt_no_plates: ['No plates', 'Sem anilhas', 'Sin discos'],
  mt_each_side: ['each side: {p}', 'de cada lado: {p}', 'en cada lado: {p}'], mt_plates: ['plates: {p}', 'anilhas: {p}', 'discos: {p}'],
  mt_each_side_l: ['each side:', 'de cada lado:', 'en cada lado:'], mt_plates_l: ['plates:', 'anilhas:', 'discos:'],
  after_test: ['adjusts after the test', 'ajusta depois do teste', 'se ajusta tras la prueba'],
  mt_backpack: ['backpack with {k} kg (a 1 L water bottle = 1 kg)', 'mochila com {k} kg (garrafa de 1 L de água = 1 kg)', 'mochila con {k} kg (una botella de 1 L de agua = 1 kg)'],
  mt_kb: ['{k} kg kettlebell', 'kettlebell de {k} kg', 'kettlebell de {k} kg'],
  cal_home: ['Set {n}: {kg} kg × {r}. Same weight for the next sets; the reps are set to give the planned effort.', 'Série {n}: {kg} kg × {r}. Mesmo peso nas próximas séries; as repetições foram ajustadas para dar o esforço planejado.', 'Serie {n}: {kg} kg × {r}. Mismo peso en las próximas series; las repeticiones se ajustan para dar el esfuerzo planificado.'],
  mt_db_each: ['{k} kg dumbbell in each hand', 'halter de {k} kg em cada mão', 'mancuerna de {k} kg en cada mano'], mt_db_one: ['one {k} kg dumbbell', 'um halter de {k} kg', 'una mancuerna de {k} kg'],
  mt_ankle: ['{k} kg ankle weight', 'caneleira de {k} kg', 'tobillera de {k} kg'], mt_pin: ['pin at {k} kg', 'pino em {k} kg', 'pasador en {k} kg'], mt_cable: ['cable at {k} kg', 'polia em {k} kg', 'polea en {k} kg'],
  test_first: ['First time on this one: start light on purpose. Set 1 is the test: do as many reps as you can while leaving {rir} in the tank (stop at {cap}). The app then calculates the other sets.', 'Primeira vez neste exercício: comece leve de propósito. A série 1 é o teste: faça o máximo de repetições deixando {rir} sobrando (pare em {cap}). Depois o app calcula as outras séries.', 'Primera vez en este ejercicio: empieza ligero a propósito. La serie 1 es la prueba: haz todas las repeticiones que puedas dejando {rir} en reserva (para en {cap}). Luego la app calcula las demás series.'],
  test_day: ['Set 1 is today\'s test: do {r} reps and stop with {rir} left in the tank. If it feels easy, keep going (stop at {cap}). The next sets adjust by themselves.', 'A série 1 é o teste do dia: faça {r} repetições e pare com {rir} sobrando. Se estiver fácil, continue (pare em {cap}). As próximas séries se ajustam sozinhas.', 'La serie 1 es la prueba del día: haz {r} repeticiones y para con {rir} en reserva. Si es fácil, sigue (para en {cap}). Las siguientes series se ajustan solas.'],
  test_first_bw: ['First time on this one: set 1 is the test. Do as many {u} as you can while leaving {rir} in the tank, then type what you did. The next sets adjust to it.', 'Primeira vez neste exercício: a série 1 é o teste. Faça o máximo de {u} deixando {rir} sobrando e digite quantas fez. As próximas séries se ajustam a isso.', 'Primera vez en este ejercicio: la serie 1 es la prueba. Haz todas las {u} que puedas dejando {rir} en reserva y escribe cuántas hiciste. Las siguientes series se ajustan a eso.'],
  test_bw: ['Set 1 is today\'s test: do {r} {u} and stop with {rir} left in the tank. If it feels easy, keep going and type what you did. The next sets adjust by themselves.', 'A série 1 é o teste do dia: faça {r} {u} e pare com {rir} sobrando. Se estiver fácil, continue e digite quantas fez. As próximas séries se ajustam sozinhas.', 'La serie 1 es la prueba del día: haz {r} {u} y para con {rir} en reserva. Si es fácil, sigue y escribe cuántas hiciste. Las siguientes series se ajustan solas.'],
  cal_bw: ['Set {n}: {r} {u}. The next sets were set to match.', 'Série {n}: {r} {u}. As próximas séries foram ajustadas a isso.', 'Serie {n}: {r} {u}. Las siguientes series se ajustaron a eso.'],
  target_test: ['goal: as many as you can leaving {rir} (up to {cap})', 'meta: o máximo deixando {rir} sobrando (até {cap})', 'meta: el máximo dejando {rir} en reserva (hasta {cap})'],
  target_test_bw: ['goal: as many as you can leaving {rir}', 'meta: o máximo deixando {rir} sobrando', 'meta: el máximo dejando {rir} en reserva'],
  type_test_reps: ['This is the test set: type how many {u} you did, so the app can calculate the rest.', 'Esta é a série teste: digite quantas {u} você fez, para o app calcular o resto.', 'Esta es la serie de prueba: escribe cuántas {u} hiciste, para que la app calcule el resto.'],
  test_day_ph: ['max', 'máx', 'máx'],
  cal_keep: ['Set {n}: {r} reps with {kg} kg. Right on target: keep {novo} kg.', 'Série {n}: {r} repetições com {kg} kg. Na medida: mantenha {novo} kg.', 'Serie {n}: {r} repeticiones con {kg} kg. Justo: mantén {novo} kg.'],
  cal_up: ['Set {n}: {r} reps with {kg} kg was light. Next sets: {novo} kg.', 'Série {n}: {r} repetições com {kg} kg ficou leve. Próximas séries: {novo} kg.', 'Serie {n}: {r} repeticiones con {kg} kg fue ligero. Próximas series: {novo} kg.'],
  cal_down: ['Set {n}: {r} reps with {kg} kg was heavy. Next sets: {novo} kg.', 'Série {n}: {r} repetições com {kg} kg ficou pesado. Próximas séries: {novo} kg.', 'Serie {n}: {r} repeticiones con {kg} kg fue pesado. Próximas series: {novo} kg.'],
  gw_title: ['Your gym\'s weights', 'Pesos da sua academia', 'Pesos de tu gimnasio'],
  gw_note: ['The load calculator uses this to tell you exactly what to put on: plates per side, which dumbbell, where the pin goes.', 'A calculadora usa isto para dizer exatamente o que colocar: anilhas de cada lado, qual halter, onde vai o pino.', 'La calculadora usa esto para decirte exactamente qué poner: discos por lado, qué mancuerna, dónde va el pasador.'],
  gw_plates: ['Plates you have (tap to mark)', 'Anilhas que tem (toque para marcar)', 'Discos que hay (toca para marcar)'], gw_bar: ['Olympic bar weight', 'Peso da barra olímpica', 'Peso de la barra olímpica'], gw_barw: ['EZ bar weight', 'Peso da barra W', 'Peso de la barra Z'],
  gw_smith: ['Smith machine bar', 'Barra do Smith', 'Barra del Smith'], gw_dont_count: ['Don\'t count', 'Não contar', 'No contar'], gw_db_max: ['Heaviest dumbbell', 'Halter mais pesado', 'Mancuerna más pesada'],
  gw_db_step: ['Dumbbells above 10 kg go up', 'Halteres acima de 10 kg sobem', 'Mancuernas de más de 10 kg suben'], gw_every: ['every {n} kg', 'de {n} em {n} kg', 'de {n} en {n} kg'],
  gw_machine: ['Machine weight stacks go up', 'Placas das máquinas sobem', 'Las placas de las máquinas suben'], gw_cable: ['Cable stacks go up', 'Placas das polias sobem', 'Las placas de las poleas suben'],
  warmup: ['Warm-up (doesn\'t count)', 'Aquecimento (não conta)', 'Calentamiento (no cuenta)'], test_tag: ['test', 'teste', 'prueba'], target_reps: ['goal', 'meta', 'meta'],
});
