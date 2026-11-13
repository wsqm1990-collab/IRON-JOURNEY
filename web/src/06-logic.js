/* ---------- where each person is in their cycle ---------- */
function progresso(pid) {
  const pl = plano(pid);
  if (!pl || !pl.programa) return null;
  const pg = pl.programa, nD = pg.dias.length, nW = pg.semanas.length;
  const ss = sessoesDe(pid).filter(s => s.planoId === pl.id);
  const feitos = ss.length, total = nD * nW;
  const semanaIdx = Math.min(Math.floor(feitos / nD), nW - 1);
  const sem = pg.semanas[semanaIdx];
  const proxDia = ss.length ? ((Number(ss[0].dia) || 0) + 1) % nD : 0;
  return { pl, pg, nD, nW, feitos, total, completo: feitos >= total, semanaIdx, semana: semanaIdx + 1, sem, fase: sem.fase, proxDia, naSemana: clamp(feitos - semanaIdx * nD, 0, nD) };
}
function alvo(item, sem) {
  const ex = exInfo(item.id, item.nome);
  const series = ex.grupo === 'cardio' ? item.series : sem.deload ? Math.max(1, Math.ceil(item.series / 2)) : clamp(item.series + (sem.seriesExtra || 0), 1, 10);
  return { series, rmin: item.reps[0], rmax: item.reps[1], rir: sem.rir, desc: item.descanso, deload: !!sem.deload };
}
function ultimaVez(pid, exId, casa = false) {
  let reserva = null;
  for (const s of sessoesDe(pid)) {
    if (!!s.casa !== !!casa) continue;
    const x = (s.exs || []).find(e => e.id === exId && (e.sets || []).some(z => z.ok && z.reps > 0));
    if (!x) continue;
    if (!s.deload) return { s, x };
    if (!reserva) reserva = { s, x };
  }
  return reserva;
}
Object.assign(STR, {
  sug_first_load: ['First time: pick a weight that leaves about {n} reps in the tank.', 'Primeira vez: escolha um peso que deixe umas {n} repetições sobrando.', 'Primera vez: elige un peso que deje unas {n} repeticiones en reserva.'],
  sug_first: ['First time: log what you manage.', 'Primeira vez: registre o que você conseguir.', 'Primera vez: registra lo que consigas.'],
  sug_top: ['You hit the top of the range: try {n} {u} or more.', 'Bateu o topo da faixa: tente {n} {u} ou mais.', 'Llegaste al tope del rango: intenta {n} {u} o más.'],
  sug_top_bw: ['You hit the top of the range: try {n} {u} or more, or add load.', 'Bateu o topo da faixa: tente {n} {u} ou mais, ou acrescente carga.', 'Llegaste al tope del rango: intenta {n} {u} o más, o añade carga.'],
  sug_beat: ['Goal: beat {n} {u}.', 'Meta: passar de {n} {u}.', 'Meta: superar {n} {u}.'],
  sug_log_load: ['Log the load this time.', 'Registre a carga desta vez.', 'Registra la carga esta vez.'],
  sug_deload: ['Light week: same load (or up to 10% less), stopping well short of failure.', 'Semana leve: mesma carga (ou até 10% menos), parando bem longe da falha.', 'Semana ligera: misma carga (o hasta 10% menos), parando lejos del fallo.'],
  sug_up: ['Add {step} kg: you hit {r} reps on every set.', 'Subir {step} kg: você fechou {r} repetições em todas as séries.', 'Sube {step} kg: hiciste {r} repeticiones en todas las series.'],
  sug_down: ['Drop {step} kg and focus on technique: you fell below {r} reps.', 'Baixar {step} kg e caprichar na técnica: ficou abaixo de {r} repetições.', 'Baja {step} kg y cuida la técnica: quedaste por debajo de {r} repeticiones.'],
  sug_same: ['Same load: aim for 1 more rep than last time.', 'Mesma carga: busque 1 repetição a mais que da última vez.', 'Misma carga: busca 1 repetición más que la última vez.'],
});
/* double progression: hit the top of the range on every set -> add the smallest jump.
   The advice is stored as a key + numbers so it shows in whatever language is active. */
function sugestao(pid, item, alv, casa = false) {
  const ex = exInfo(item.id, item.nome);
  const u = ultimaVez(pid, item.id, casa);
  if (!u) return usaCarga(ex) ? { kg: null, k: 'sug_first_load', v: { n: Math.max(alv.rir, 2) }, ult: [] } : { kg: null, k: 'sug_first', v: {}, ult: [] };
  const ok = u.x.sets.filter(z => z.ok && z.reps > 0);
  const ult = ok.map(z => [usaCarga(ex) ? z.kg || 0 : 0, z.reps]);
  if (!usaCarga(ex)) {
    const best = Math.max(...ok.map(z => z.reps));
    return { kg: null, k: best >= alv.rmax ? (ex.carga === 'c' ? 'sug_top_bw' : 'sug_top') : 'sug_beat', v: { n: best >= alv.rmax ? best + 1 : best, u: ex.carga }, ult };
  }
  const w = Math.max(...ok.map(z => z.kg || 0));
  if (!w) return { kg: null, k: 'sug_log_load', v: {}, ult };
  const pesadas = ok.filter(z => (z.kg || 0) === w);
  const step = passo(ex, w);
  if (alv.deload) return { kg: w, k: 'sug_deload', v: {}, ult };
  if (pesadas.every(z => z.reps >= alv.rmax)) return { kg: w + step, k: 'sug_up', v: { step, r: alv.rmax }, ult };
  if (pesadas[0].reps < alv.rmin) return { kg: Math.max(0, w - step), k: 'sug_down', v: { step, r: alv.rmin }, ult };
  return { kg: w, k: 'sug_same', v: {}, ult };
}
function textoSug(sug) {
  if (!sug || !sug.k) return (sug && sug.texto) || '';
  const v = { ...sug.v };
  if (v.u != null) v.u = unidade({ carga: v.u });
  if (v.step != null) v.step = fmtKg(v.step);
  return t(sug.k, v);
}
const textoUltima = sug => ((sug && sug.ult) || []).map(([kg, r]) => (kg ? fmtKg(kg) + ' kg × ' : '') + r).join(' · ');
function itemDoTreino(pid, item, sem, casa = false) {
  const ex = exInfo(item.id, item.nome);
  const alv = alvo(item, sem);
  const sug = sugestao(pid, item, alv, casa);
  const pc = planoCarga(pid, item, alv, sug, casa);
  return {
    id: item.id, nome: ex.nome, grupo: ex.grupo, alvo: alv, sug, dica: item.dica || '',
    carga: { tipo: pc.tipo, rir: pc.rir, teste: pc.teste, primeira: !!pc.primeira, e1: pc.e1, ...(casa && pc.tipo ? { fixo: true } : {}) },
    sets: pc.sets.map(s => ({ kg: s.kg, alvo: s.alvo, reps: null, ok: false })),
  };
}
function montarSessao(pid, diaIdx) {
  const pr = progresso(pid);
  const dia = pr.pg.dias[diaIdx];
  return {
    pid, planoId: pr.pl.id, ciclo: pr.pl.ciclo, dia: diaIdx, diaNome: dia.nome, foco: dia.foco, semana: pr.semana, fase: pr.fase,
    deload: !!pr.sem.deload, nDias: pr.nD, total: pr.total, inicio: Date.now(), rir: pr.sem.rir,
    exs: comAquecimento(dia.exercicios.map(item => itemDoTreino(pid, item, pr.sem))),
  };
}
/* the first heavy exercise for each muscle group gets warm-up sets with exact loads */
function comAquecimento(exs) {
  const vistos = new Set();
  for (const x of exs) {
    const ex = exInfo(x.id, x.nome);
    if (vistos.has(ex.grupo)) continue;
    const a = aquecimento(ex, x.sets[0] && x.sets[0].kg);
    if (a.length) { x.aquec = a; vistos.add(ex.grupo); }
  }
  return exs;
}

/* ---------- cardio ---------- */
function cardioAlvo(c, sem) {
  const minutosAlvo = sem && sem.deload ? Math.max(5, Math.round(c.minutos * 0.6)) : Math.max(5, c.minutos + ((sem && sem.cardioExtra) || 0));
  return { ...c, minutosAlvo };
}
function cardioSemanaInfo(pid) {
  const pr = progresso(pid);
  const sessoes = (pr && pr.pg.cardio && Array.isArray(pr.pg.cardio.sessoes)) ? pr.pg.cardio.sessoes : [];
  const meta = sessoes.reduce((n, c) => n + c.porSemana, 0);
  const wk = weekKey(Date.now());
  const lista = cardioDe(pid).filter(c => weekKey(c.inicio) === wk);
  return { pr, sessoes, meta, feitos: lista.length, minutos: lista.reduce((n, c) => n + (c.minutos || 0), 0), lista };
}

/* ---------- personal records ---------- */
function melhorDe(x) {
  const ex = exInfo(x.id, x.nome);
  let top = 0, set = null;
  for (const z of x.sets || []) {
    if (!z.ok || !(z.reps > 0)) continue;
    const v = usaCarga(ex) ? e1rm(z.kg || 0, z.reps) : z.reps;
    if (v > top) { top = v; set = z; }
  }
  return { top, set, ex };
}
function recordes(pid, extra) {
  const best = {}, prs = [];
  const asc = sessoesDe(pid).slice().reverse();
  if (extra) asc.push(extra);
  for (const s of asc) for (const x of s.exs || []) {
    const m = melhorDe(x);
    if (!m.top) continue;
    if (best[x.id] != null && m.top > best[x.id] + 1e-6) prs.push({ sess: s._id || 'novo', inicio: s.inicio, exId: x.id, nomeX: x.nome, kg: m.set.kg, reps: m.set.reps, carga: usaCarga(m.ex) });
    if (best[x.id] == null || m.top > best[x.id]) best[x.id] = m.top;
  }
  return { best, prs };
}

/* ---------- hero's journey: XP, levels, relics ---------- */
const TITULOS = [[1, ['Apprentice', 'Aprendiz', 'Aprendiz']], [3, ['Recruit', 'Recruta', 'Recluta']], [5, ['Fighter', 'Combatente', 'Combatiente']], [8, ['Athlete', 'Atleta', 'Atleta']], [12, ['Titan', 'Titã', 'Titán']], [16, ['Legend', 'Lenda', 'Leyenda']]];
const xpPara = n => 125 * n * (n - 1);
function nivelDe(xp) {
  let n = 1;
  while (xpPara(n + 1) <= xp) n++;
  return { n, titulo: L3(TITULOS.filter(x => n >= x[0]).pop()[1]), base: xpPara(n), prox: xpPara(n + 1) };
}
const XP = { treino: 100, serie: 5, recorde: 50, semana: 150, deload: 150, ciclo: 500, juntos: 50, cardio: 50, cardioMin: 1, cardioSemana: 100 };
function jornadaDados(pid, extra, extraCardio) {
  const ss = sessoesDe(pid).slice().reverse();
  if (extra) ss.push({ ...extra, _id: 'novo' });
  const { prs } = recordes(pid, extra ? { ...extra, _id: 'novo' } : null);
  const prsPorSess = {};
  prs.forEach(r => { prsPorSess[r.sess] = (prsPorSess[r.sess] || 0) + 1; });
  const outrosDias = new Set(S.sessoes.filter(s => s.pid !== pid).map(s => dayKey(s.inicio)));
  const diasJuntos = new Set(), porPlano = {}, porSemana = {};
  let xp = 0, series = 0;
  for (const s of ss) {
    const ok = (s.exs || []).reduce((n, x) => n + (x.sets || []).filter(z => z.ok).length, 0);
    series += ok;
    xp += XP.treino + Math.min(ok, 40) * XP.serie + Math.min(prsPorSess[s._id] || 0, 3) * XP.recorde;
    const dk = dayKey(s.inicio);
    if (outrosDias.has(dk) && !diasJuntos.has(dk)) { diasJuntos.add(dk); xp += XP.juntos; }
    if (s.planoId) {
      const p = porPlano[s.planoId] || (porPlano[s.planoId] = { n: 0, deload: 0, nDias: s.nDias || 0, total: s.total || 0 });
      p.n++; if (s.deload) p.deload++;
    }
    const wk = weekKey(s.inicio); porSemana[wk] = (porSemana[wk] || 0) + 1;
  }
  let semanas = 0, deloads = 0, ciclos = 0;
  for (const p of Object.values(porPlano)) {
    if (p.nDias) { semanas += Math.floor(p.n / p.nDias); if (p.deload >= p.nDias) deloads++; }
    if (p.total && p.n >= p.total) ciclos++;
  }
  xp += semanas * XP.semana + deloads * XP.deload + ciclos * XP.ciclo;
  // cardio: each session of 10+ minutes, plus a bonus for every week that hit the planned number of sessions
  const cs = cardioDe(pid).slice();
  if (extraCardio) cs.push(extraCardio);
  let cardioMin = 0, cardioKm = 0, cardioSemanas = 0;
  const cardioPorSemana = {};
  for (const c of cs) {
    const m = c.minutos || 0;
    cardioMin += m; cardioKm += c.km || 0;
    if (m >= 10) xp += XP.cardio + Math.min(m, 60) * XP.cardioMin;
    const wk = weekKey(c.inicio);
    porSemana[wk] = (porSemana[wk] || 0) + 1;
    const w = cardioPorSemana[wk] || (cardioPorSemana[wk] = { n: 0, meta: 0 });
    w.n++; w.meta = Math.max(w.meta, c.meta || 0);
  }
  for (const w of Object.values(cardioPorSemana)) if (w.meta && w.n >= w.meta) cardioSemanas++;
  xp += cardioSemanas * XP.cardioSemana;
  let seq = 0, melhorSeq = 0;
  const wks = Object.keys(porSemana).sort();
  if (wks.length) {
    const fim = weekKey(Date.now());
    const d = new Date(wks[0] + 'T12:00:00');
    for (let guard = 0; guard < 600; guard++) {
      const w = weekKey(d.getTime());
      if (w > fim) break;
      if ((porSemana[w] || 0) >= 2) { seq++; melhorSeq = Math.max(melhorSeq, seq); } else if (w !== fim) seq = 0;
      d.setDate(d.getDate() + 7);
    }
  }
  return { xp, nivel: nivelDe(xp), treinos: ss.length, series, prs: prs.length, juntos: diasJuntos.size, semanas, deloads, ciclos, seq, melhorSeq, temPlano: !!plano(pid), cardioN: cs.length, cardioMin, cardioKm, cardioSemanas };
}
const RELIQUIAS = [
  { id: 'chamado', nome: ['Map of the Call', 'Mapa do Chamado', 'Mapa de la Llamada'], desc: ['Accepted the journey', 'Aceitou a jornada', 'Aceptaste la jornada'], cor: 'var(--plate-green)', ok: () => true },
  { id: 'mentor', nome: ['Mentor\'s Scroll', 'Pergaminho do Mentor', 'Pergamino del Mentor'], desc: ['Built the first plan', 'Montou o primeiro plano', 'Creaste el primer plan'], cor: 'var(--plate-blue)', ok: d => d.temPlano || d.treinos > 0 },
  { id: 'bota', nome: ['Traveler\'s Boots', 'Bota do Viajante', 'Botas del Viajero'], desc: ['First workout done', 'Primeiro treino concluído', 'Primer entrenamiento hecho'], cor: 'var(--plate-green)', ok: d => d.treinos >= 1 },
  { id: 'bronze', nome: ['Bronze Plate', 'Anilha de Bronze', 'Disco de Bronce'], desc: ['10 workouts', '10 treinos', '10 entrenamientos'], cor: 'var(--bronze)', ok: d => d.treinos >= 10, meta: d => [d.treinos, 10] },
  { id: 'prata', nome: ['Silver Plate', 'Anilha de Prata', 'Disco de Plata'], desc: ['25 workouts', '25 treinos', '25 entrenamientos'], cor: 'var(--silver)', ok: d => d.treinos >= 25, meta: d => [d.treinos, 25] },
  { id: 'ouro', nome: ['Gold Plate', 'Anilha de Ouro', 'Disco de Oro'], desc: ['50 workouts', '50 treinos', '50 entrenamientos'], cor: 'var(--plate-yellow)', ok: d => d.treinos >= 50, meta: d => [d.treinos, 50] },
  { id: 'lendaria', nome: ['Legendary Plate', 'Anilha Lendária', 'Disco Legendario'], desc: ['100 workouts', '100 treinos', '100 entrenamientos'], cor: 'var(--plate-red)', ok: d => d.treinos >= 100, meta: d => [d.treinos, 100] },
  { id: 'cinturao', nome: ['First Record Belt', 'Cinturão do Primeiro Recorde', 'Cinturón del Primer Récord'], desc: ['First personal record', 'Primeiro recorde pessoal', 'Primer récord personal'], cor: 'var(--plate-yellow)', ok: d => d.prs >= 1 },
  { id: 'campeao', nome: ['Champion\'s Belt', 'Cinturão de Campeão', 'Cinturón de Campeón'], desc: ['10 personal records', '10 recordes pessoais', '10 récords personales'], cor: 'var(--plate-red)', ok: d => d.prs >= 10, meta: d => [d.prs, 10] },
  { id: 'amuleto', nome: ['Amulet of Consistency', 'Amuleto da Constância', 'Amuleto de la Constancia'], desc: ['4 weeks in a row with 2+ sessions', '4 semanas seguidas com 2+ treinos', '4 semanas seguidas con 2+ sesiones'], cor: 'var(--plate-blue)', ok: d => d.melhorSeq >= 4, meta: d => [d.melhorSeq, 4] },
  { id: 'coroa', nome: ['Crown of Discipline', 'Coroa da Disciplina', 'Corona de la Disciplina'], desc: ['8 weeks in a row with 2+ sessions', '8 semanas seguidas com 2+ treinos', '8 semanas seguidas con 2+ sesiones'], cor: 'var(--plate-yellow)', ok: d => d.melhorSeq >= 8, meta: d => [d.melhorSeq, 8] },
  { id: 'calice', nome: ['Chalice of Rest', 'Cálice do Descanso', 'Cáliz del Descanso'], desc: ['Completed a deload week', 'Cumpriu uma semana leve (deload)', 'Cumpliste una semana de descarga'], cor: 'var(--plate-white)', ok: d => d.deloads >= 1 },
  { id: 'elixir', nome: ['Elixir of Return', 'Elixir do Retorno', 'Elixir del Regreso'], desc: ['Finished a whole chapter', 'Concluiu um capítulo inteiro', 'Terminaste un capítulo entero'], cor: 'var(--plate-green)', ok: d => d.ciclos >= 1 },
  { id: 'folego', nome: ['Iron Lungs', 'Fôlego de Ferro', 'Pulmones de Hierro'], desc: ['10 cardio sessions', '10 sessões de cardio', '10 sesiones de cardio'], cor: 'var(--plate-blue)', ok: d => d.cardioN >= 10, meta: d => [d.cardioN, 10] },
  { id: 'coracao', nome: ['Brave Heart', 'Coração Valente', 'Corazón Valiente'], desc: ['500 minutes of cardio', '500 minutos de cardio', '500 minutos de cardio'], cor: 'var(--plate-red)', ok: d => d.cardioMin >= 500, meta: d => [Math.round(d.cardioMin), 500] },
  { id: 'maratona', nome: ['Marathon in Pieces', 'Maratona Acumulada', 'Maratón Acumulado'], desc: ['42 km of cardio in total', '42 km somados no cardio', '42 km sumados de cardio'], cor: 'var(--plate-yellow)', ok: d => d.cardioKm >= 42, meta: d => [Math.floor(d.cardioKm), 42] },
  { id: 'selo', casal: true, nome: ['Allies\' Seal', 'Selo dos Aliados', 'Sello de los Aliados'], desc: ['Trained on the same day', 'Treinaram no mesmo dia', 'Entrenaron el mismo día'], cor: 'var(--plate-red)', ok: d => d.juntos >= 1 },
  { id: 'laco', casal: true, nome: ['Unbreakable Bond', 'Laço Inquebrável', 'Lazo Inquebrantable'], desc: ['10 days training on the same day', '10 dias treinando no mesmo dia', '10 días entrenando el mismo día'], cor: 'var(--plate-blue)', ok: d => d.juntos >= 10, meta: d => [d.juntos, 10] },
];
const reliquiasAtivas = () => RELIQUIAS.filter(r => !r.casal || S.ordem.length > 1);
const ETAPAS = {
  chamado: [['The Call', 'O Chamado', 'La Llamada'], ['You created your profile and accepted the adventure.', 'Você criou seu perfil e aceitou a aventura.', 'Creaste tu perfil y aceptaste la aventura.']],
  mentor: [['The Mentor', 'O Mentor', 'El Mentor'], ['The coach draws the map for this chapter.', 'O treinador desenha o mapa do capítulo.', 'El entrenador traza el mapa de este capítulo.']],
  travessia: [['The Threshold', 'A Travessia', 'El Umbral'], ['The first workout of the chapter.', 'O primeiro treino do capítulo.', 'El primer entrenamiento del capítulo.']],
  provas: [['The Trials', 'As Provas', 'Las Pruebas'], ['Base weeks: technique, consistency and loads going up.', 'Semanas de base: técnica, constância e cargas subindo.', 'Semanas de base: técnica, constancia y cargas en aumento.']],
  provacao: [['The Ordeal', 'A Provação', 'La Prueba Suprema'], ['The hardest week of the chapter. High effort, flawless technique.', 'A semana mais pesada do capítulo. Esforço alto, técnica impecável.', 'La semana más dura del capítulo. Esfuerzo alto, técnica impecable.']],
  recompensa: [['The Reward', 'A Recompensa', 'La Recompensa'], ['Hit at least one personal record this chapter.', 'Bater pelo menos um recorde pessoal neste capítulo.', 'Logra al menos un récord personal en este capítulo.']],
  volta: [['The Road Back', 'O Caminho de Volta', 'El Camino de Regreso'], ['Light week: your body recovers and grows. Rest is part of the journey too.', 'Semana leve: o corpo se recupera e cresce. Descansar também é parte da jornada.', 'Semana ligera: el cuerpo se recupera y crece. Descansar también es parte de la jornada.']],
  retorno: [['The Return', 'O Retorno', 'El Regreso'], ['Chapter complete. The next one starts stronger.', 'Capítulo concluído. O próximo começa mais forte.', 'Capítulo completado. El siguiente empieza con más fuerza.']],
};
Object.assign(STR, {
  of_workouts: ['{a} of {b} workouts', '{a} de {b} treinos', '{a} de {b} entrenamientos'],
  n_record: ['{n} record', '{n} recorde', '{n} récord'],
  n_records: ['{n} records', '{n} recordes', '{n} récords'],
});
function etapas(pid) {
  const pr = progresso(pid);
  const st = (id, extra) => ({ id, nome: L3(ETAPAS[id][0]), txt: L3(ETAPAS[id][1]), ...extra });
  const E = [st('chamado', { feito: true }), st('mentor', { feito: !!pr })];
  if (!pr) return { E, atual: 1, pr: null };
  const fim = idx => (idx + 1) * pr.nD;
  const ultimo = test => { let i = -1; pr.pg.semanas.forEach((w, k) => { if (test(w)) i = k; }); return i; };
  const iBase = ultimo(w => !w.deload && w.fase !== 'intens');
  let iInt = ultimo(w => w.fase === 'intens');
  const iDel = ultimo(w => w.deload);
  if (iInt < 0) iInt = iDel > 0 ? iDel - 1 : pr.nW - 1;
  const iB = Math.min(iBase, iInt - 1);
  const ini = idx => idx * pr.nD;
  const cont = (a, b) => t('of_workouts', { a: clamp(pr.feitos - a, 0, b - a), b: b - a });
  E.push(st('travessia', { feito: pr.feitos >= 1 }));
  if (iB >= 0) E.push(st('provas', { feito: pr.feitos >= fim(iB), prog: cont(0, fim(iB)) }));
  const iniInt = iB >= 0 ? fim(iB) : ini(iInt);
  E.push(st('provacao', { feito: pr.feitos >= fim(iInt), prog: cont(iniInt, fim(iInt)) }));
  const sessCiclo = new Set(sessoesDe(pid).filter(s => s.planoId === pr.pl.id).map(s => s._id));
  const prsCiclo = recordes(pid).prs.filter(r => sessCiclo.has(r.sess)).length;
  E.push(st('recompensa', { feito: prsCiclo >= 1, lateral: true, prog: prsCiclo ? tn(prsCiclo, 'n_record', 'n_records') : '' }));
  if (iDel >= 0) E.push(st('volta', { feito: pr.feitos >= fim(iDel), prog: cont(ini(iDel), fim(iDel)) }));
  E.push(st('retorno', { feito: pr.completo }));
  const atual = E.findIndex(e => !e.feito && !e.lateral);
  return { E, atual: atual < 0 ? E.length - 1 : atual, pr };
}
