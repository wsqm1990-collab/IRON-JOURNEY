/* ---------- AI coach: runs on the viewer's own Claude account ---------- */
const AI = { fn: null, off: false, get on() { return !!this.fn && !this.off; } };
function aiErrorText(e) {
  switch (e && e.code) {
    case 'not_granted': case 'sampling_disabled': case 'not_declared': case 'capability_disabled': case 'capability_removed':
      AI.off = true; return t('ai_off');
    case 'rate_limited': return t('ai_rate');
    case 'session_expired': return t('ai_session');
    case 'refused': return t('ai_refused');
    case 'invalid_json': return t('ai_json');
    case 'prompt_too_large': return t('ai_big');
    case 'empty_completion': return t('ai_empty');
    case 'no_key': return t('ai_need_key');
    case 'no_workspace': return t('ai_workspace');
    case 'bad_key': return t('ai_bad_key');
    case 'no_credit': return t('ai_credit');
    case 'busy': return t('ai_busy');
    case 'offline': return t('ai_offline');
    case 'cancelled': return '';
    default: return t('ai_net');
  }
}
function aiJSON(prompt, opts) { return AI.on ? AI.fn.json(prompt, opts) : Promise.reject({ code: 'not_granted' }); }
function aiText(input, opts) { return AI.on ? AI.fn(input, opts) : Promise.reject({ code: 'not_granted' }); }
const idioma = () => `Write every piece of text meant for the person in ${LANG_IA()}.`;

/* ---------- context the coach reads (in English; answers come in the person's language) ---------- */
const en3 = a => (Array.isArray(a) ? a[0] : a);
const focoEn = p => (p.foco || []).map(id => { const r = FOCOS.find(x => x[0] === id); return r ? r[1] : id; });
const limitesEn = p => [...(p.limites || []).map(id => { const r = LIMITES.find(x => x[0] === id); return r ? r[1] : id; }), p.limitesTxt].filter(Boolean).join('; ');
const objEn = id => { const o = OBJETIVOS.find(x => x.id === id); return o ? o.nome[0] : '—'; };
const nivelEn = id => { const o = NIVEIS.find(x => x.id === id); return o ? o.nome[0] : '—'; };
function ctxPerfil(p) {
  const l = [
    `Name: ${p.nome}`,
    `Main goal: ${objEn(p.objetivo)}`,
    `Priority muscles: ${focoEn(p).join(', ') || 'none in particular'}`,
    `Experience: ${nivelEn(p.nivel)}`,
    `Availability: ${p.dias} strength days per week, about ${p.minutos} minutes each`,
  ];
  const sexo = { f: 'female', m: 'male' }[p.sexo];
  const corpo = [sexo, p.idade && p.idade + ' years old', p.peso && p.peso + ' kg', p.altura && p.altura + ' cm'].filter(Boolean).join(', ');
  if (corpo) l.push('Body: ' + corpo);
  l.push('Pain or injuries: ' + (limitesEn(p) || 'none reported'));
  if (p.gosta) l.push('Likes: ' + p.gosta);
  if (p.evita) l.push('Prefers to avoid: ' + p.evita);
  const modos = (p.cardioModos || []).map(id => exInfo(id).nomeEn).join(', ');
  const quando = { apos: 'after lifting', separado: 'on separate days', tanto: 'any day' }[p.cardioQuando] || '';
  l.push('Cardio: ' + [p.cardioVezes ? p.cardioVezes + ' sessions per week' : 'does not want cardio sessions', modos && 'prefers ' + modos, quando].filter(Boolean).join('; '));
  const z = zonasFC(p.idade);
  if (z) l.push(`Estimated heart rate: max ~${z.max} bpm; easy (zone 2) ${z.leve[0]}-${z.leve[1]} bpm; hard ${z.forte[0]}-${z.forte[1]} bpm`);
  return l.join('\n');
}
function ctxAcademia() {
  const nomes = [...equipSet(S.gym)].map(k => (EQUIP_NOMES[k] ? EQUIP_NOMES[k][0] : '')).filter(Boolean);
  let s = 'Gym equipment: ' + (nomes.length ? nomes.join(', ') : 'not provided');
  if (S.gym && S.gym.outros) s += '\nOther equipment: ' + S.gym.outros;
  return s;
}
function ctxPlano(pid) {
  const pr = progresso(pid);
  if (!pr) return 'Current plan: not created yet.';
  const dias = pr.pg.dias.map(d => `${d.nome} (${d.foco}): ` + d.exercicios.map(x => `${exInfo(x.id, x.nome).nomeEn} ${x.series}x${x.reps[0]}-${x.reps[1]}`).join('; ')).join('\n');
  const cs = (pr.pg.cardio && pr.pg.cardio.sessoes) || [];
  const cardio = cs.length ? '\nPlanned cardio: ' + cs.map(c => `${c.nome} (protocol ${c.protocolo || c.tipo}) ${c.porSemana}x/week, ${cardioAlvo(c, pr.sem).minutosAlvo} min this week, ${c.intensidade}`).join('; ') : '\nPlanned cardio: none.';
  return `Current plan: ${pr.pg.nome}, chapter ${pr.pl.ciclo}, week ${pr.semana} of ${pr.nW} (${en3(FASES[pr.fase] || FASES.accum)}, RIR ${pr.sem.rir})\n${dias}${cardio}`;
}
/* a one-day change of the plan's workout (the plan itself stayed the same) */
function ajusteEn(s) {
  const a = s.ajuste || (s.casa ? { onde: 'casa', modo: 'mesmos' } : null);
  if (!a) return '';
  const onde = a.onde === 'casa' ? 'at home (' + (((s.casa && s.casa.equip) || []).join(', ') || 'body weight only') + ')' : 'at the gym';
  const musc = (a.musc || (a.modo === 'foco' ? a.foco : null) || []).join(', ');
  const obj = a.objetivo || (a.modo === 'leve' ? 'leve' : '');
  return ` [one-day change, plan unchanged: ${onde}${obj ? ', goal ' + obj : ''}${a.tipo && a.tipo !== 'tradicional' ? ', ' + a.tipo : ''}${musc ? ', muscles: ' + musc : ''}]`;
}
function linhaSessao(s) {
  const exs = (s.exs || []).filter(x => (x.sets || []).some(z => z.ok)).map(x => {
    const ex = exInfo(x.id, x.nome);
    return ex.nomeEn + ' ' + x.sets.filter(z => z.ok).map(z => (usaCarga(ex) && z.kg ? z.kg + 'kg×' : '') + z.reps).join(', ');
  }).join('; ');
  return `${dayKey(s.inicio)} ${fmtHoraEn(s.inicio)}${s.fim ? '-' + fmtHoraEn(s.fim) : ''} ${s.diaNome}${ajusteEn(s)}${s.sensacao ? ' (felt: ' + en3((SENSACOES.find(x => x[0] === s.sensacao) || [0, s.sensacao]).slice(1)) + ')' : ''}${s.nota ? ' - note: ' + s.nota : ''}: ${exs}`;
}
const fmtHoraEn = ts => { const d = new Date(ts); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
const linhaCardio = c => `${dayKey(c.inicio)} ${fmtHoraEn(c.inicio)} ${exInfo(c.modo, c.nome).nomeEn}${c.protocolo ? ' (' + c.protocolo + ')' : ''} ${c.minutos} min${c.km ? ', ' + c.km + ' km' : ''}${c.esforco ? ', effort ' + c.esforco + '/10' : ''}${c.fc ? ', avg HR ' + c.fc : ''}${c.nota ? ' - note: ' + c.nota : ''}`;
function ctxHistorico(pid, n = 8) {
  const ss = sessoesDe(pid).slice(0, n), cs = cardioDe(pid).slice(0, 8);
  if (!ss.length && !cs.length) return 'History: nothing logged yet.';
  let s = ss.length ? 'Latest strength sessions (newest first):\n' + ss.map(linhaSessao).join('\n') : 'No strength sessions logged yet.';
  if (cs.length) s += '\n\nLatest cardio:\n' + cs.map(linhaCardio).join('\n');
  return s.slice(0, 6000);
}
function resumoCiclo(pid) {
  const pl = plano(pid);
  const ss = sessoesDe(pid).filter(s => s.planoId === pl.id).slice().reverse();
  const porEx = {};
  for (const s of ss) for (const x of s.exs || []) {
    const ex = exInfo(x.id, x.nome);
    const ok = (x.sets || []).filter(z => z.ok && z.reps > 0);
    if (!ok.length) continue;
    const top = ok.reduce((a, z) => (e1rm(z.kg || 0, z.reps) >= e1rm(a.kg || 0, a.reps) ? z : a), ok[0]);
    const txt = (usaCarga(ex) && top.kg ? top.kg + 'kg×' : '') + top.reps;
    if (!porEx[ex.nomeEn]) porEx[ex.nomeEn] = { ini: txt, fim: txt }; else porEx[ex.nomeEn].fim = txt;
  }
  const notas = ss.filter(s => s.nota).map(s => s.nota).slice(-5);
  const cs = cardioDe(pid).filter(c => c.planoId === pl.id);
  return `Strength sessions done: ${ss.length} of ${pl.programa.dias.length * pl.programa.semanas.length}\nProgress (best set, start -> end):\n` +
    Object.entries(porEx).map(([n, v]) => `- ${n}: ${v.ini} -> ${v.fim}`).join('\n') +
    (notas.length ? '\nPerson\'s notes: ' + notas.join(' | ') : '') +
    `\nCardio this cycle: ${cs.length} sessions, ${cs.reduce((n, c) => n + (c.minutos || 0), 0)} minutes`;
}

/* ---------- what the coach knows, and how it explains ---------- */
const EVIDENCIAS = `EVIDENCE BASE (apply what fits this person's goal, level and schedule)
- Building muscle: about 10-20 hard sets per muscle per week (beginners 6-10; more only for priority muscles of advanced lifters), each muscle trained at least twice a week, sets ending 0-3 reps short of failure, mostly 6-15 reps (5-30 works when close to failure), full range of motion with emphasis on the stretched position, 2-3 min rest on compounds and 1-2 min on isolation, progressive overload with double progression.
- Getting stronger: specificity. The main barbell lifts (squat, bench press, deadlift, overhead press) or their closest available versions 2-3 times a week, mostly 1-6 reps at about 75-90% of the 1RM with 1-3 reps in reserve, 3-5 min rest, technique practice with submaximal sets, plus accessory muscle-building work at 8-12 reps; undulating or block periodization.
- Losing fat: the calorie deficit removes fat; strength training keeps heavy loads and enough volume (never swap to light "toning" sets) so muscle is kept; daily steps; mostly easy zone 2 cardio with at most 1-2 interval sessions a week; slightly less volume if recovery suffers.
- Health and fitness: 150-300 min a week of moderate cardio (or 75-150 vigorous) plus strength training for all major muscles at least twice a week; full-body sessions; for non-beginners one interval session a week (e.g. Norwegian 4x4) to raise VO2max, a strong marker of long-term health.
- Beginners: full body 2-3 times a week, few exercises, learn technique 3-4 reps short of failure; machines and dumbbells build muscle as well as barbells.
- Women: the same principles; often recover well from a bit more volume and reps; glute focus only if asked.
- Pain or injuries: pain-free variations and ranges of motion; never train through sharp pain.
When you mention research, say it in plain words (e.g. "studies comparing 1 and 3 minutes of rest found more growth with longer rest"); never invent authors, years, study names or numbers.`;
const REGRAS_EXPLICACAO = `EXPLANATIONS (this is what makes you a real personal trainer)
Write for someone who has never trained. Define every technical word the first time you use it, in a few plain words (set, rep, RIR, 1RM, deload, progressive overload, compound, isolation, zone 2). Be concrete: numbers, examples, what to feel. No filler.
- "resumo": 2 or 3 sentences with the logic of the plan.
- "explicacao": 6 or 7 sections {"titulo","texto"}, each texto 3 to 6 sentences, in this order: how this plan works (the big picture); why this split and how often each muscle is trained; sets, reps, effort (RIR) and rest, and why; how to pick the weight and how it goes up (the test set and the app's calculator); the weeks of the block (phases and deload) and why; cardio (what, how hard, why; or why only steps); what to expect and how to recover (sleep, protein in general terms, soreness).
- Every exercise: "porque" (1 or 2 sentences: what it trains and why it is in this person's plan) and "dica" (the most important technique cue with specifics, e.g. grip width relative to the shoulders, foot position, bench angle, where to stop).`;

/* ---------- program design ---------- */
function promptPrograma(pid, extra) {
  const p = perfil(pid), set = equipSet(S.gym);
  const ok = Object.values(EX).filter(ex => !CASA_IDS.has(ex.id) && disponivel(ex, set));
  const forca = ok.filter(ex => ex.grupo !== 'cardio').map(ex => `${ex.id} | ${ex.nomeEn} | ${en3(GRUPOS[ex.grupo])}`).join('\n');
  const cardio = ok.filter(ex => ex.grupo === 'cardio').map(ex => `${ex.id} | ${ex.nomeEn}`).join('\n');
  const protos = PROTOCOLOS.map(pr => `${pr.id} | ${pr.nome[0]} | ${pr.desc[0]} | intensity: ${pr.nivel}`).join('\n');
  return `You are an elite personal trainer and strength, hypertrophy and conditioning coach. You apply the best-supported scientific evidence together with what works in practice in real gyms. Design one periodized, individualized training block (mesocycle) of strength training and cardio for this person, and explain it so that someone who has never trained understands every choice.

PERSON
${ctxPerfil(p)}

GYM
${ctxAcademia()}

ALLOWED STRENGTH EXERCISES (use ONLY these ids in "dias"; format id | name | muscle group)
${forca}

ALLOWED CARDIO MODALITIES (use ONLY these ids in cardio.sessoes[].opcoes; format id | name)
${cardio}

CARDIO PROTOCOLS THE APP CAN GUIDE (use ONLY these ids in cardio.sessoes[].protocolo)
${protos}
${extra ? '\n' + extra + '\n' : ''}
${EVIDENCIAS}

PRINCIPLES
1. Split: choose the best split for ${p.dias} days per week and the goal (full body, upper/lower, push/pull/legs or hybrid). Train each muscle twice a week whenever the days allow. "dias" must contain exactly ${p.dias} workouts.
2. Weekly sets per muscle (hard sets): beginner 6-10; intermediate 10-16; advanced 12-20. Priority muscles near the top of the range; the rest in the middle or at maintenance.
3. Effort is set by RIR (reps in reserve). Beginners start at RIR 3. No failure on heavy compound lifts for beginners.
4. Rep ranges for double progression: compounds 5-10 (strength goal: 3-6), accessories 8-15, isolation and calves 10-20.
5. Prefer stable exercises with a full range of motion and favor loading the muscle in the lengthened position (seated leg curl, overhead triceps extension, incline curl, cable lateral raise, Romanian deadlift), without redundant variations. Compounds first; priority muscles early in the session.
6. Rest: 120-180 s on heavy compounds, 60-120 s on isolation.
7. Each workout must fit ${p.minutos} minutes including warm-up (count 2-3 min per set with rest). Usually 4-7 exercises.
8. Injuries: avoid what could aggravate the reported problem and choose safe alternatives.
9. Periodization over 4-6 weeks: effort rises week to week (e.g. RIR 3, 2, 1, 1) and, if it makes sense, +1 set on priority muscles at the end (seriesExtra). The last week is always a deload: deload true and rir 4 (the app halves the sets by itself).
10. Fat loss: keep heavy strength training to preserve muscle; easy cardio and daily steps as a complement. Strength goal: more heavy work on the main lifts.
11. The app has a load calculator: on every exercise the first set is a test, and from it the app gives the exact weight (plates per side, dumbbell, machine pin) and the exact reps of the other sets, and it raises the weight when the person beats the top of the rep range. Count on it and explain it.
12. Cardio is part of the plan, in the "cardio" field (never inside "dias"). Respect how many sessions per week the person wants, their favorite modalities and when they prefer to do it; if they want no cardio, leave "sessoes" empty and recommend daily steps in the summary. The base is easy continuous cardio (protocol z2). Use high-intensity protocols (h3030, h4020, tabata, n4x4, piramide, sprint) only for intermediate or advanced people, at most once a week, away from the heavy leg day; beginners can use fartlek or ladeira for variety. For fat loss cardio complements strength training and daily steps, never replaces them. With knee or hip pain prefer bike, elliptical or incline walking over running and jump rope. On strength days cardio comes after lifting. Raise minutes gradually with "cardioExtra" per week (the app shortens cardio in the deload week by itself). In "intensidade" use plain language (talk test and effort from 0 to 10).

${REGRAS_EXPLICACAO}

LANGUAGE: ${idioma()} Ids and the "fase" codes stay exactly as specified.

ANSWER: only one JSON object, no text outside it, in this shape:
{"nome":"short plan name","resumo":"2 or 3 simple sentences explaining the logic of the plan","explicacao":[{"titulo":"How this plan works","texto":"3 to 6 sentences"}],"semanas":[{"fase":"adapt","rir":3,"seriesExtra":0,"cardioExtra":0,"deload":false,"nota":"short guidance for the week"}],"dias":[{"nome":"Workout A","foco":"Upper body","exercicios":[{"id":"supino_reto_halteres","series":3,"reps":[8,12],"descanso":120,"porque":"what it trains and why it is here","dica":"key technique cue with specifics"}]}],"cardio":{"resumo":"1 or 2 sentences about this block's cardio","sessoes":[{"nome":"Easy cardio","protocolo":"z2","opcoes":["bike","esteira_inclinada"],"minutos":30,"porSemana":2,"intensidade":"you can hold a conversation, effort 5 of 10","quando":"after Workout B and Workout D"}]},"dicas":["up to 3 practical, personal tips"]}
"fase" must be one of: adapt, accum, intens, deload.`;
}
const FASE_ALIAS = { adapt: 'adapt', adaptation: 'adapt', 'adaptação': 'adapt', adaptacao: 'adapt', 'adaptación': 'adapt', accum: 'accum', accumulation: 'accum', 'acumulação': 'accum', acumulacao: 'accum', 'acumulación': 'accum', intens: 'intens', intensification: 'intens', 'intensificação': 'intens', intensificacao: 'intens', 'intensificación': 'intens', deload: 'deload', descarga: 'deload' };
function normalizarPrograma(raw, pid) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.dias) || !raw.dias.length) throw { code: 'invalid_json' };
  const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
  const dias = raw.dias.slice(0, 7).map((d, i) => {
    const exs = (Array.isArray(d && d.exercicios) ? d.exercicios : []).slice(0, 10).map(x => {
      if (!x) return null;
      const id = String(x.id || '').trim(), known = EX[id] && EX[id].grupo !== 'cardio';
      const r = Array.isArray(x.reps) ? x.reps : [x.reps, x.reps];
      let a = clamp(toInt(r[0], 8), 1, 120), b = clamp(toInt(r[1] ?? r[0], a), 1, 120);
      if (b < a) [a, b] = [b, a];
      const item = { id: known ? id : 'x_' + slug(x.nome || id || 'exercise'), series: clamp(toInt(x.series, 3), 1, 8), reps: [a, b], descanso: clamp(toInt(x.descanso, 90), 20, 300) };
      if (!known) item.nome = String(x.nome || id || 'Exercise').slice(0, 60);
      if (x.dica) item.dica = String(x.dica).slice(0, 300);
      if (x.porque) item.porque = String(x.porque).slice(0, 300);
      return item;
    }).filter(Boolean);
    return { nome: String((d && d.nome) || 'Workout ' + 'ABCDEFG'[i]).slice(0, 40), foco: String((d && d.foco) || '').slice(0, 70), exercicios: exs };
  }).filter(d => d.exercicios.length);
  if (!dias.length) throw { code: 'invalid_json' };
  let semanas = (Array.isArray(raw.semanas) ? raw.semanas : []).slice(0, 8).filter(Boolean).map(w => {
    const f = FASE_ALIAS[String(w.fase || '').toLowerCase()] || 'accum';
    const deload = !!w.deload || f === 'deload';
    return { fase: deload ? 'deload' : f, rir: clamp(toInt(w.rir, deload ? 4 : 2), 0, 5), seriesExtra: clamp(toInt(w.seriesExtra, 0), -2, 2), cardioExtra: clamp(toInt(w.cardioExtra, 0), -30, 30), deload, nota: String(w.nota || '').slice(0, 220) };
  });
  if (!semanas.length) semanas = ['adapt', 'accum', 'intens', 'deload'].map((f, i) => ({ fase: f, rir: [3, 2, 1, 4][i], seriesExtra: 0, cardioExtra: 0, deload: f === 'deload', nota: '' }));
  const cardioIds = new Set(Object.values(EX).filter(e => e.grupo === 'cardio').map(e => e.id));
  const p = pid ? perfil(pid) : null;
  const fallback = ((p && p.cardioModos) || []).filter(id => cardioIds.has(id)).slice(0, 3);
  const cardio = { resumo: '', sessoes: [] };
  if (typeof raw.cardio === 'string') cardio.resumo = raw.cardio.slice(0, 300);
  else if (raw.cardio && typeof raw.cardio === 'object') {
    cardio.resumo = String(raw.cardio.resumo || '').slice(0, 300);
    cardio.sessoes = (Array.isArray(raw.cardio.sessoes) ? raw.cardio.sessoes : []).filter(Boolean).slice(0, 4).map(c => {
      const opcoes = (Array.isArray(c.opcoes) ? c.opcoes : []).map(String).filter(id => cardioIds.has(id)).slice(0, 5);
      const proto = PROTO[c.protocolo] ? c.protocolo : c.tipo === 'intervalado' ? 'h3030' : 'z2';
      return {
        nome: String(c.nome || 'Cardio').slice(0, 40), protocolo: proto, tipo: PROTO[proto].nivel === 'easy' ? 'continuo' : 'intervalado',
        opcoes: opcoes.length ? opcoes : fallback.length ? fallback : ['caminhada'],
        minutos: clamp(toInt(c.minutos, 30), 5, 120), porSemana: clamp(toInt(c.porSemana, 1), 1, 7),
        intensidade: String(c.intensidade || '').slice(0, 160), quando: String(c.quando || '').slice(0, 120),
      };
    });
  }
  const explicacao = (Array.isArray(raw.explicacao) ? raw.explicacao : []).filter(e => e && (e.texto || e.text)).slice(0, 8)
    .map(e => ({ titulo: String(e.titulo || e.title || '').slice(0, 90), texto: String(e.texto || e.text || '').slice(0, 1400) }));
  return {
    nome: String(raw.nome || 'My plan').slice(0, 60), resumo: String(raw.resumo || '').slice(0, 600), explicacao, semanas, dias, cardio,
    dicas: (Array.isArray(raw.dicas) ? raw.dicas : []).slice(0, 3).map(s => String(s).slice(0, 220)), lang: LANG(),
  };
}
async function gerarPrograma(pid, modo, pedido, signal) {
  if (!AI.on) return { prog: normalizarPrograma(programaLocal(pid, modo), pid), mudancas: [] };
  let prompt;
  if (modo === 'ajuste') {
    prompt = promptPrograma(pid, `CURRENT PLAN (JSON)\n${JSON.stringify(plano(pid).programa)}\n\nTHE PERSON'S CHANGE REQUEST: "${pedido}"\nMake the requested change and keep what doesn't need to change. If the request changes how many strength days per week, use the new number instead of rule 1. If the request isn't safe, make the safe version and explain.`) +
      '\nAlso include "mudancas": a list of up to 5 short sentences saying what changed (in the person\'s language).';
  } else {
    prompt = promptPrograma(pid, modo === 'proximo' ? `PREVIOUS CHAPTER (${plano(pid).programa.nome})\n${resumoCiclo(pid)}\nDesign the NEXT block: keep what worked, swap or vary what stalled, adjust volume to how the person felt, and progress from the previous block.` : '');
  }
  const raw = await aiJSON(prompt, { modelTier: 'complex', signal, cache: false });
  const prog = normalizarPrograma(raw, pid);
  const mudancas = Array.isArray(raw.mudancas) ? raw.mudancas.slice(0, 5).map(s => String(s).slice(0, 220)) : [];
  return { prog, mudancas };
}

/* plans made before the explanations existed: the coach explains them now */
async function explicarPlano(pid, signal) {
  const p = perfil(pid), pg = plano(pid).programa;
  const ids = [...new Set(pg.dias.flatMap(d => d.exercicios.map(x => x.id)))];
  const prompt = `You are ${p.nome}'s personal trainer. Explain the training plan below so that someone who has never trained understands every choice.

PERSON
${ctxPerfil(p)}

PLAN (JSON)
${JSON.stringify({ nome: pg.nome, semanas: pg.semanas, dias: pg.dias.map(d => ({ nome: d.nome, foco: d.foco, exercicios: d.exercicios.map(x => ({ id: x.id, nome: exInfo(x.id, x.nome).nomeEn, series: x.series, reps: x.reps, descanso: x.descanso })) })), cardio: pg.cardio })}

${EVIDENCIAS}

${REGRAS_EXPLICACAO}

LANGUAGE: ${idioma()}

ANSWER: only one JSON object: {"explicacao":[{"titulo":"...","texto":"..."}],"exercicios":{"exercise id":{"porque":"...","dica":"..."}}} with one entry in "exercicios" for each of these ids: ${ids.join(', ')}.`;
  const raw = await aiJSON(prompt, { modelTier: 'complex', signal, cache: false });
  const exp = normalizarPrograma({ dias: [{ exercicios: [{ id: ids[0] }] }], explicacao: raw && raw.explicacao }, pid).explicacao;
  if (!exp.length) throw { code: 'invalid_json' };
  const pl = clone(plano(pid)), info = (raw && raw.exercicios) || {};
  pl.programa.explicacao = exp;
  for (const d of pl.programa.dias) for (const x of d.exercicios) {
    const e = info[x.id];
    if (!e) continue;
    if (e.porque) x.porque = String(e.porque).slice(0, 300);
    if (e.dica) x.dica = String(e.dica).slice(0, 300);
  }
  return pl;
}

/* ---------- swaps, technique, chat ---------- */
async function aiTroca(pid, exId, motivo, candidatos, signal) {
  const p = perfil(pid), ex = exInfo(exId);
  const lista = candidatos.map(c => `${c.id} | ${c.nomeEn} | ${en3(GRUPOS[c.grupo])}`).join('\n');
  const mot = motivo ? (MOTIVOS.find(m => m[0] === motivo) || [0, motivo])[1] : '';
  const prompt = `You are a personal trainer. ${p.nome} needs to replace "${ex.nomeEn}" (${en3(GRUPOS[ex.grupo] || GRUPOS.outro)})${mot ? '. Reason: ' + mot : ''}.
Goal: ${objEn(p.objetivo)}. Level: ${nivelEn(p.nivel)}. Pain or injuries: ${limitesEn(p) || 'none'}.
Options available at this gym (id | name | group):
${lista}
Pick the 3 best replacements that keep the stimulus of the original exercise and respect the reason and the injuries. For each, say in up to 14 words why it is a good swap. ${idioma()}
Answer only with JSON: [{"id":"...","motivo":"..."}]`;
  const r = await aiJSON(prompt, { modelTier: 'quick', signal });
  return (Array.isArray(r) ? r : []).filter(x => x && candidatos.some(c => c.id === x.id)).slice(0, 3).map(x => ({ id: x.id, motivo: String(x.motivo || '').slice(0, 160) }));
}
function promptTecnica(pid, exId, nomeFallback) {
  const p = perfil(pid) || { nome: 'the person' }, ex = exInfo(exId, nomeFallback), lim = limitesEn(p);
  const sexo = p.sexo === 'f' ? 'woman' : p.sexo === 'm' ? 'man' : 'not stated';
  return `You are an expert personal trainer. Teach ${p.nome} (level: ${nivelEn(p.nivel).toLowerCase()}; sex: ${sexo}; goal: ${objEn(p.objetivo).toLowerCase()}) exactly how to perform "${ex.nomeEn}" so that a beginner could do it perfectly from your text alone. Base every cue on biomechanics and on what experienced coaches use in practice. Be precise and measurable: e.g. "hands about one and a half times shoulder width, so your forearms are vertical when the bar touches your chest", "feet shoulder-width apart, toes turned out 15 to 30 degrees", "bench at about 30 degrees", "seat high enough that the handles line up with the middle of your chest". No introduction. ${idioma()}
Use exactly these bold headings, translated to that language, each followed by short sentences or a list:
**Setup**: adjustments before the first rep (seat, bench angle, pads, pulley height, pin, safety bars, collars). Skip what doesn't apply.
**Grip**: grip type (overhand, underhand or neutral), width with a body reference, thumbs, wrist position. If the hands don't hold anything, say where they go.
**Stance and body position**: feet (width, angle, where on the floor or platform), back, chest, shoulder blades, head and neck, how to brace the core.
**Step by step**: numbered steps from the starting position to the end of one rep.
**Range of motion**: where each rep starts and stops, and how to know you got there.
**Tempo and breathing**: seconds down, pause and up; when to breathe in and out (and bracing on heavy compound lifts).
**What you should feel**: the muscles that should work, and what you should not feel.
**Common mistakes**: 3 or 4 items, each with its fix.
**Weight and reps**: how to pick the weight using the app's test set (set 1: as many reps as you can while leaving the planned reps in reserve; the app calculates the rest) and the signs that the weight is too heavy.
${lim ? `The person reported: ${lim}. If any of it matters for this exercise, add a bold **Caution** heading with what to change.\n` : ''}Between 300 and 450 words. Never invent study names or numbers.`;
}
function regrasCoach(pid) {
  const p = perfil(pid);
  return `You are ${p.nome}'s personal trainer inside "Iron Journey", a strength and cardio app. Talk like an experienced, caring personal trainer who explains everything: direct, warm, motivating without exaggeration, grounded in the best current evidence on strength training, hypertrophy, conditioning, fat loss and periodization, and in what works in practice in the gym.
Rules:
- ${idioma()} Assume the person is a layperson: define technical words the first time in plain terms, give the reason behind every recommendation, and be concrete (numbers, positions, what to feel, examples from their own data).
- Start with the direct answer in 1 or 2 sentences, then the details in short steps or bullets. Usually 120-300 words; up to 600 for "how" or "why" questions, technique or planning; shorter for simple yes or no questions. **Bold** is fine.
- Technique questions: cover the grip (type and width relative to the shoulders), stance and feet, body position, range of motion, tempo, breathing, what they should feel, and the most common mistake with its fix.
- The app calculates the exact weight for every set: set 1 of each exercise is a test, and from it the app gives the weight (plates per side, dumbbell or machine pin) and the exact reps of the other sets. Mention it when they ask about weights.
- When you mention research, describe it in plain words; never invent authors, years, study names or numbers.
- Personalize with the data below. Only suggest exercises and cardio that this gym allows (outdoor walking and running always work).
- For cardio, explain intensity simply (talk test, effort 0-10 and the heart rate range from the data, if any). The app has a Cardio Studio with guided protocols (zone 2, tempo, HIIT 30/30 and 40/20, Tabata, Norwegian 4x4, pyramid, sprints, fartlek, incline walk) and Watch and Listen modes for training while watching a show or listening to music; recommend them when they fit.
- If the person wants to change the plan (swap exercises, change days, change focus), explain what you would do and tell them to tap "Adjust my plan" to apply it.
- Strong or worsening pain, chest pain, dizziness, shortness of breath or a suspected injury: tell them to stop and see a doctor or physical therapist. Never diagnose.
- Food and supplements: general, safe guidance; for an individual diet, refer to a dietitian.
- Never invent numbers that aren't in the data.
- The app has a hero's journey with XP, levels and relics. If they bring it up, play along lightly, but health comes before points.

DATA
${ctxPerfil(p)}

${ctxAcademia()}

${ctxPlano(pid)}

${ctxHistorico(pid)}`;
}
function md(s) {
  const inline = x => x.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  let html = '', inList = '';
  for (const ln of esc(s).split('\n')) {
    const li = ln.match(/^\s*(?:([-•*])|\d+[.)])\s+(.*)$/);
    if (li) {
      const tipo = li[1] ? 'ul' : 'ol';
      if (inList !== tipo) { if (inList) html += '</' + inList + '>'; html += '<' + tipo + '>'; inList = tipo; }
      html += '<li>' + inline(li[2]) + '</li>'; continue;
    }
    if (inList) { html += '</' + inList + '>'; inList = ''; }
    const h = ln.match(/^\s*#{1,4}\s+(.*)$/);
    if (h) html += '<h4>' + inline(h[1]) + '</h4>';
    else if (ln.trim()) html += '<p>' + inline(ln) + '</p>';
  }
  if (inList) html += '</' + inList + '>';
  return html;
}
