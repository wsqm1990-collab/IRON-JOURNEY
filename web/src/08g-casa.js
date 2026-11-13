/* ---------- training somewhere else today: the coach adapts today's workout, for today only ----------
   Nothing in the plan changes. The adapted workout lives on this phone until the end of the day. The
   session is saved as that plan day (so the plan moves on) and marked "at home", and home sessions never
   feed the gym suggestions (light home weights must not lower the gym loads), and the reverse. */
Object.assign(STR, {
  home_btn: ['Training at home today', 'Hoje vou treinar em casa', 'Hoy entreno en casa'],
  home_title: ['Adapt today\'s workout', 'Adaptar o treino de hoje', 'Adaptar el entrenamiento de hoy'],
  home_intro: ['Your trainer adapts today\'s workout, {w}, so you can do it at home with the same muscles. It is for today only: your gym plan doesn\'t change, and next time this workout comes up it is the normal gym version.', 'O treinador adapta o treino de hoje, {w}, para você fazer em casa, com os mesmos músculos. Vale só para hoje: o seu plano da academia não muda, e na próxima vez esse treino vem normal, de academia.', 'Tu entrenador adapta el entrenamiento de hoy, {w}, para que lo hagas en casa con los mismos músculos. Es solo para hoy: tu plan del gimnasio no cambia, y la próxima vez este entrenamiento vuelve normal, de gimnasio.'],
  home_have: ['What do you have there?', 'O que você tem aí?', '¿Qué tienes ahí?'],
  home_body_only: ['Only my body weight', 'Só o peso do corpo', 'Solo mi peso corporal'],
  home_time: ['How much time do you have?', 'Quanto tempo você tem?', '¿Cuánto tiempo tienes?'],
  home_go_ai: ['Adapt with my trainer', 'Adaptar com o treinador', 'Adaptar con mi entrenador'], home_go: ['Adapt today\'s workout', 'Adaptar o treino de hoje', 'Adaptar mi entrenamiento'],
  home_making: ['Your trainer is adapting today\'s workout to your home…', 'O treinador está adaptando o treino de hoje para a sua casa…', 'Tu entrenador está adaptando el entrenamiento de hoy a tu casa…'],
  home_ready: ['Your home workout is ready', 'Seu treino em casa está pronto', 'Tu entrenamiento en casa está listo'],
  home_fallback: ['The AI trainer didn\'t answer, so the app adapted it with its own rules.', 'O treinador de IA não respondeu, então o app adaptou com as regras dele.', 'El entrenador de IA no respondió, así que la app lo adaptó con sus propias reglas.'],
  home_eyebrow: ['Today\'s workout · at home', 'Treino de hoje · em casa', 'Entrenamiento de hoy · en casa'],
  home_tag: ['at home', 'em casa', 'en casa'],
  home_body_tag: ['Body weight', 'Peso do corpo', 'Peso corporal'],
  home_from: ['Based on {w}', 'Baseado em: {w}', 'Basado en: {w}'],
  home_rest: ['rest {n} s', 'descanso {n} s', 'descanso {n} s'],
  home_exs: ['exercises', 'exercícios', 'ejercicios'],
  home_start: ['Start the home workout', 'Começar o treino em casa', 'Empezar el entrenamiento en casa'],
  home_redo: ['Change equipment or time', 'Mudar equipamento ou tempo', 'Cambiar equipo o tiempo'],
  home_back: ['Back to the gym workout', 'Voltar ao treino da academia', 'Volver al entrenamiento del gimnasio'],
  home_back_done: ['Back to your gym workout', 'De volta ao treino da academia', 'De vuelta al entrenamiento del gimnasio'],
  home_only_today: ['Only for today: your plan stays the same.', 'Só para hoje: o seu plano continua igual.', 'Solo para hoy: tu plan sigue igual.'],
  home_instead: ['Instead of {x}.', 'No lugar de {x}.', 'En lugar de {x}.'],
  home_same: ['Same exercise as in your plan.', 'O mesmo exercício do seu plano.', 'El mismo ejercicio de tu plan.'],
  home_tip_bw: ['Make it hard: 3 seconds down, a 1-second pause, then up.', 'Deixe difícil: 3 segundos descendo, 1 segundo parado e sobe.', 'Hazlo difícil: 3 segundos bajando, 1 segundo de pausa y sube.'],
  test_first_home: ['First time with your weight at home: use the weight you have. Set 1 is the test: do as many reps as you can while leaving {rir} in the tank (stop at {cap}). The app then sets the reps of the other sets, with the same weight.', 'Primeira vez com o seu peso de casa: use o peso que você tem. A série 1 é o teste: faça o máximo de repetições deixando {rir} sobrando (pare em {cap}). Depois o app ajusta as repetições das outras séries, com o mesmo peso.', 'Primera vez con tu peso de casa: usa el peso que tengas. La serie 1 es la prueba: haz el máximo de repeticiones dejando {rir} en reserva (para en {cap}). Luego la app ajusta las repeticiones de las demás series, con el mismo peso.'],
  home_expl_base: ['Same muscles as today\'s gym workout, with what you have at home.', 'Os mesmos músculos do treino de hoje, com o que você tem em casa.', 'Los mismos músculos del entrenamiento de hoy, con lo que tienes en casa.'],
  home_expl_load: ['Home weights are usually lighter, and they still build muscle when you get close to failure: set 1 is a test, then the app sets the reps of the other sets for your weight.', 'Peso de casa costuma ser mais leve, e mesmo assim faz crescer quando você chega perto da falha: a série 1 é um teste, depois o app ajusta as repetições das outras séries para o seu peso.', 'El peso de casa suele ser más ligero, y aun así hace crecer cuando llegas cerca del fallo: la serie 1 es una prueba y luego la app ajusta las repeticiones de las demás series a tu peso.'],
  home_expl_bw: ['Body weight only works when the last reps are hard: go slowly (3 seconds down), pause at the bottom and stop each set just a few reps short of failure.', 'Peso do corpo só funciona quando as últimas repetições ficam difíceis: vá devagar (3 segundos descendo), pare um instante embaixo e termine cada série a poucas repetições da falha.', 'El peso corporal solo funciona cuando las últimas repeticiones son duras: ve despacio (3 segundos bajando), pausa abajo y termina cada serie a pocas repeticiones del fallo.'],
});
const CASA_EQUIP = [
  ['cadeira', ['Sturdy chair or bench', 'Cadeira firme ou banco', 'Silla firme o banco'], ['Chair', 'Cadeira', 'Silla']],
  ['mesa', ['Sturdy table (for rows)', 'Mesa firme (para remada)', 'Mesa firme (para remo)'], ['Table', 'Mesa', 'Mesa']],
  ['mochila', ['Backpack with weight (books, bottles)', 'Mochila com peso (livros, garrafas)', 'Mochila con peso (libros, botellas)'], ['Backpack', 'Mochila', 'Mochila']],
  ['halteres', ['Dumbbells', 'Halteres', 'Mancuernas'], ['Dumbbells', 'Halteres', 'Mancuernas']],
  ['kettlebell', ['Kettlebell', 'Kettlebell', 'Kettlebell'], ['Kettlebell', 'Kettlebell', 'Kettlebell']],
  ['elastico', ['Resistance bands', 'Elásticos', 'Bandas elásticas'], ['Bands', 'Elásticos', 'Bandas']],
  ['barra_fixa', ['Pull-up bar', 'Barra fixa', 'Barra de dominadas'], ['Pull-up bar', 'Barra fixa', 'Barra']],
];
const CASA_TEMPOS = [20, 30, 45, 60];
const nomeCasaEquip = (id, curto) => { const r = CASA_EQUIP.find(e => e[0] === id); return r ? r[curto ? 2 : 1] : [id, id, id]; };

/* the movement pattern of an exercise in the plan, to find its home version */
const PADRAO_ID = {
  crucifixo_halteres: 'peito_iso', crossover: 'peito_iso', voador: 'peito_iso', supino_fechado: 'triceps',
  puxada_frente: 'puxar_v', puxada_neutra: 'puxar_v', puxada_unilateral: 'puxar_v', barra_fixa: 'puxar_v', barra_graviton: 'puxar_v', pulldown_bracos: 'puxar_v',
  elev_lateral: 'ombro_lat', elev_lateral_polia: 'ombro_lat', elev_lateral_maquina: 'ombro_lat', crucifixo_inverso: 'ombro_post', crucifixo_inverso_h: 'ombro_post', face_pull: 'ombro_post',
  bulgaro: 'uni', afundo: 'uni', step_up: 'uni', extensora: 'quad_iso', mesa_flexora: 'flexora', cadeira_flexora: 'flexora',
  abdutora: 'abdutor', abducao_elastico: 'abdutor', agach_sumo: 'adutor', mergulho: 'mergulho',
};
function padraoDe(id) {
  if (PADRAO_ID[id]) return PADRAO_ID[id];
  return { peito: 'emp_h', costas: 'puxar_h', ombros: 'emp_v', biceps: 'biceps', triceps: 'triceps', quadriceps: 'agachar', posteriores: 'quadril', gluteos: 'gluteo', adutores: 'adutor', panturrilhas: 'pant', abdomen: 'core' }[exInfo(id).grupo] || 'core';
}
/* home options for each pattern, best first: [exercise, difficulty 1-3, what it needs ('' nothing, a|b either, a+b both)] */
const CASA_OPCOES = {
  emp_h: [['supino_chao', 2, 'halteres'], ['flexao_declinada', 3, 'cadeira'], ['flexao', 2, ''], ['flexao_inclinada', 1, 'cadeira|mesa']],
  peito_iso: [['flexao', 2, ''], ['flexao_inclinada', 1, 'cadeira|mesa']],
  emp_v: [['desenv_halteres', 2, 'halteres'], ['flexao_pike', 2, '']],
  puxar_v: [['barra_fixa', 3, 'barra_fixa'], ['puxada_elastico', 1, 'elastico'], ['remada_invertida', 2, 'mesa'], ['barra_supinada', 3, 'barra_fixa'], ['remada_halteres', 2, 'halteres'], ['remada_mochila', 2, 'mochila'], ['ytw', 1, ''], ['superman', 1, '']],
  puxar_h: [['remada_invertida', 2, 'mesa'], ['serrote', 2, 'halteres+cadeira'], ['remada_halteres', 2, 'halteres'], ['remada_mochila', 2, 'mochila'], ['remada_elastico', 1, 'elastico'], ['ytw', 1, ''], ['superman', 1, '']],
  ombro_lat: [['elev_lateral', 2, 'halteres'], ['elev_lateral_elastico', 1, 'elastico'], ['ytw', 1, '']],
  ombro_post: [['face_pull_elastico', 1, 'elastico'], ['crucifixo_inverso_h', 2, 'halteres'], ['ytw', 1, '']],
  biceps: [['rosca_alternada', 2, 'halteres'], ['rosca_martelo', 2, 'halteres'], ['rosca_elastico', 1, 'elastico'], ['rosca_mochila', 2, 'mochila'], ['barra_supinada', 3, 'barra_fixa'], ['rosca_toalha', 1, '']],
  triceps: [['triceps_frances', 2, 'halteres'], ['mergulho_cadeira', 2, 'cadeira'], ['flexao_diamante', 3, '']],
  mergulho: [['mergulho_cadeira', 2, 'cadeira'], ['flexao_diamante', 3, ''], ['flexao', 2, '']],
  agachar: [['goblet', 2, 'halteres|kettlebell'], ['agach_mochila', 2, 'mochila'], ['agach_livre', 1, ''], ['agach_salto', 3, '']],
  uni: [['bulgaro_cadeira', 3, 'cadeira'], ['afundo_reverso', 2, ''], ['afundo_lateral', 2, '']],
  quad_iso: [['sissy', 3, ''], ['agach_parede', 1, '']],
  quadril: [['kb_swing', 2, 'kettlebell'], ['stiff_unilateral', 2, 'halteres'], ['stiff_corpo', 1, ''], ['superman', 1, '']],
  flexora: [['flexora_toalha', 2, ''], ['ponte_unilateral', 1, '']],
  gluteo: [['ponte_unilateral', 2, ''], ['kb_swing', 2, 'kettlebell'], ['ponte_gluteo', 1, '']],
  abdutor: [['abducao_elastico', 1, 'elastico'], ['afundo_lateral', 2, ''], ['ponte_gluteo', 1, '']],
  adutor: [['afundo_lateral', 2, ''], ['agach_livre', 1, '']],
  pant: [['pant_unilateral', 1, '']],
  core: [['hollow', 2, ''], ['abd_bicicleta', 1, ''], ['prancha', 1, ''], ['prancha_lateral', 1, ''], ['perdigueiro', 1, ''], ['elev_pernas_solo', 2, ''], ['abd_supra', 1, ''], ['elev_pernas', 3, 'barra_fixa'], ['escalador', 2, '']],
};
const precisa = (req, set) => !req || req.split('|').some(alt => alt.split('+').every(e => set.has(e)));
/* home moves that usually bother each sore spot (the gym list is EVITAR, in the local plan) */
const EVITAR_CASA = {
  joelho: ['agach_salto', 'sissy', 'bulgaro_cadeira', 'afundo_reverso', 'afundo_lateral', 'goblet', 'agach_mochila'],
  lombar: ['kb_swing', 'superman', 'stiff_unilateral', 'remada_mochila'],
  ombro: ['flexao_pike', 'mergulho_cadeira', 'flexao_declinada', 'desenv_halteres'],
  quadril: ['agach_salto', 'bulgaro_cadeira', 'afundo_lateral', 'afundo_reverso'],
  punho: ['flexao', 'flexao_diamante', 'flexao_declinada', 'flexao_pike'],
  cotovelo: ['flexao_diamante', 'mergulho_cadeira', 'triceps_frances'],
  pescoco: ['abd_supra', 'abd_bicicleta', 'flexao_pike'],
};
const evitaCasa = p => new Set(((p && p.limites) || []).flatMap(l => [...(EVITAR_CASA[l] || []), ...((typeof EVITAR !== 'undefined' && EVITAR[l]) || [])]));
/* every exercise that can be done with what the person has at home */
function opcoesCasa(equip, p = perfil()) {
  const set = new Set(equip || []), ids = new Set(), evita = evitaCasa(p);
  for (const lista of Object.values(CASA_OPCOES)) for (const [id, , req] of lista) if (EX[id] && precisa(req, set) && !evita.has(id)) ids.add(id);
  return [...ids];
}
/* a plan exercise that already works at home (push-ups, plank, or dumbbell moves when there are dumbbells) stays as it is */
function ficaIgual(id, set) {
  const ex = EX[id];
  if (!ex || ex.grupo === 'cardio' || ['b', 'm', 'p'].includes(ex.carga)) return false;
  const casa = ex.req.filter(alt => alt.every(e => set.has(e)));
  if (!casa.length) return false;
  return !usaCarga(ex) || casa.some(alt => alt.length > 0);
}
const difCasa = id => { for (const l of Object.values(CASA_OPCOES)) { const o = l.find(x => x[0] === id); if (o) return o[1]; } return 2; };
function faixaCasa(id) {
  const ex = EX[id], dif = difCasa(id);
  if (ex.carga === 's') return ['prancha', 'prancha_lateral', 'agach_parede'].includes(id) ? [30, 60] : [20, 45];
  if (usaCarga(ex)) return [8, 20];
  return dif >= 3 ? [5, 15] : dif === 2 ? [8, 20] : [12, 25];
}
const descansoCasa = id => [60, 60, 75, 90][difCasa(id)] || 75;
/* keep the session inside the time: about 2 minutes per set plus a 5-minute warm-up */
function cabeNoTempo(exs, tempo) {
  const minutos = l => 5 + l.reduce((n, x) => n + x.series * (0.8 + x.descanso / 60), 0);
  while (exs.length > 3 && minutos(exs) > tempo) exs.pop();
  while (minutos(exs) > tempo && exs.some(x => x.series > 2)) { const x = exs.filter(e => e.series > 2).pop(); x.series--; }
  return exs;
}
/* the app's own adaptation (no AI key, or the AI didn't answer) */
function adaptarCasaLocal(pid, diaIdx, equip, tempo) {
  const p = perfil(pid) || {}, pr = progresso(pid), dia = pr.pg.dias[diaIdx], set = new Set(equip || []), ini = p.nivel === 'iniciante', evita = evitaCasa(p);
  const usados = new Set(), exs = [];
  const opcoes = padrao => {
    let ops = (CASA_OPCOES[padrao] || CASA_OPCOES.core).filter(o => EX[o[0]] && precisa(o[2], set) && !evita.has(o[0]) && !usados.has(o[0]));
    if (ini) ops = [...ops.filter(o => o[1] < 3).sort((a, b) => a[1] - b[1]), ...ops.filter(o => o[1] >= 3)];
    return ops[0] ? ops[0][0] : null;
  };
  const poe = (id, series, porque) => {
    const ex = EX[id];
    usados.add(id);
    exs.push({ id, series: clamp(series || 3, 2, 5), reps: faixaCasa(id), descanso: descansoCasa(id), porque,
      dica: ex.carga === 's' || usaCarga(ex) ? '' : t('home_tip_bw') });
  };
  for (const item of dia.exercicios) {
    const orig = exInfo(item.id, item.nome);
    if (orig.grupo === 'cardio' || usados.has(item.id)) continue;
    if (ficaIgual(item.id, set)) { poe(item.id, item.series, t('home_same')); continue; }
    const id = opcoes(padraoDe(item.id));
    if (id) poe(id, item.series, t('home_instead', { x: orig.nome }));
  }
  /* a day with only cardio (or nothing that maps): a simple full-body session */
  if (exs.length < 2) for (const pd of ['agachar', 'emp_h', 'puxar_h', 'uni', 'gluteo', 'core']) { const id = opcoes(pd); if (id) poe(id, 3, ''); }
  const lista = cabeNoTempo(exs, tempo), carga = lista.some(x => usaCarga(EX[x.id])), corpo = lista.some(x => !usaCarga(EX[x.id]) && EX[x.id].carga !== 's');
  return { nome: '', exercicios: lista, explicacao: [t('home_expl_base'), carga ? t('home_expl_load') : '', corpo ? t('home_expl_bw') : ''].filter(Boolean).join(' '), fonte: 'local' };
}
/* the AI trainer's adaptation */
async function adaptarCasaIA(pid, diaIdx, equip, tempo, signal) {
  const p = perfil(pid), pr = progresso(pid), dia = pr.pg.dias[diaIdx], set = new Set(equip);
  const ok = [...new Set([...dia.exercicios.map(x => x.id).filter(id => ficaIgual(id, set)), ...opcoesCasa(equip, p)])];
  const tem = equip.length ? equip.map(e => nomeCasaEquip(e)[0]).join(', ') : 'nothing: body weight only';
  const lista = ok.map(id => `${id} | ${EX[id].nomeEn} | ${en3(GRUPOS[EX[id].grupo])}`).join('\n');
  const plano = dia.exercicios.map(x => { const e = exInfo(x.id, x.nome); return `- ${e.nomeEn} (${en3(GRUPOS[e.grupo] || GRUPOS.outro)}): ${x.series} sets x ${x.reps[0]}-${x.reps[1]} reps, rest ${x.descanso || 90} s`; }).join('\n');
  const n = tempo <= 20 ? '3 or 4' : tempo <= 30 ? '4 or 5' : tempo <= 45 ? '5 or 6' : '6 or 7';
  const prompt = `You are ${p.nome}'s personal trainer. Today ${p.nome} cannot go to the gym and will train at home. Adapt TODAY's workout from the plan so it keeps its purpose (the same muscles and movement patterns, in a sensible order) using only what is available at home. This version is for today only: the plan itself does not change.

PERSON
${ctxPerfil(p)}

THIS WEEK
Week ${pr.semana} of ${pr.nW}, phase ${en3(FASES[pr.fase] || FASES.accum)}: every set should stop about ${pr.sem.rir} reps short of failure${pr.sem.deload ? ' (deload week: the app halves the sets by itself)' : ''}.

TODAY'S PLANNED WORKOUT: ${dia.nome} (${dia.foco})
${plano}

AVAILABLE AT HOME: ${tem}
TIME: about ${tempo} minutes including a 5-minute warm-up (count about 2 minutes per set with rest).

ALLOWED EXERCISES (use ONLY these ids; format id | name | muscle group)
${lista}

RULES
1. Cover the same muscles as the planned workout, big movements first. Usually ${n} exercises.
2. Body weight must still be hard: choose variations the person can do for about 6 to 20 reps (or 20 to 60 s holds) stopping about ${pr.sem.rir} reps short of failure. Beginners get easier variations (incline push-ups, bodyweight squats). If a movement is easy, use slow lowering (3 s), a pause at the bottom or one-leg versions, and say so in "dica". With light home weights, 15 to 25 reps close to failure also build muscle.
3. Rest 45 to 90 s. Sets per exercise like the plan (2 to 4).
4. Respect pain or injuries. Safety: only sturdy furniture; never hang from doors or door frames.
5. For timed holds (plank, side plank, wall sit, hollow hold, mountain climbers) "reps" are seconds.
6. "porque": which planned exercise it replaces and what it trains, in one sentence. "dica": the key technique cue with specifics.

LANGUAGE: ${idioma()} Ids stay exactly as listed.

ANSWER: only one JSON object: {"nome":"short name for today's home workout","explicacao":"2 or 3 sentences: how this matches today's plan and how to make it hard enough at home","exercicios":[{"id":"agach_livre","series":3,"reps":[12,20],"descanso":60,"porque":"...","dica":"..."}]}`;
  const raw = await aiJSON(prompt, { modelTier: 'default', signal, cache: false });
  const res = normalizarCasa(raw, ok);
  res.exercicios = cabeNoTempo(res.exercicios, tempo + 5);
  return res;
}
function normalizarCasa(raw, ok) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.exercicios)) throw { code: 'invalid_json' };
  const permitidos = new Set(ok), vistos = new Set();
  const exs = raw.exercicios.filter(x => x && permitidos.has(x.id) && !vistos.has(x.id) && vistos.add(x.id)).slice(0, 8).map(x => {
    const r = Array.isArray(x.reps) ? x.reps.map(v => Math.round(Number(v))) : [];
    const a = clamp(r[0] || faixaCasa(x.id)[0], 1, 90), b = clamp(r[1] || a, a, 90);
    return { id: x.id, series: clamp(Math.round(Number(x.series)) || 3, 1, 6), reps: [a, b], descanso: clamp(Math.round(Number(x.descanso)) || 60, 20, 180),
      porque: String(x.porque || '').slice(0, 300), dica: String(x.dica || '').slice(0, 300) };
  });
  if (exs.length < 2) throw { code: 'invalid_json' };
  return { nome: String(raw.nome || '').slice(0, 60), exercicios: exs, explicacao: String(raw.explicacao || '').slice(0, 600), fonte: 'ia' };
}

/* ---------- today's adaptation, kept on this phone until midnight ---------- */
const casaKey = pid => 'ij_casa_' + pid;
function casaHoje(pid) {
  const A = LS.get(casaKey(pid)), pr = progresso(pid);
  if (!A || !pr || A.data !== dayKey(Date.now()) || A.planoId !== pr.pl.id || A.dia !== pr.proxDia || !Array.isArray(A.exercicios)) return null;
  return A;
}
function limparCasa(pid) { LS.del(casaKey(pid)); }
function montarSessaoCasa(pid, A) {
  const pr = progresso(pid), d = pr.pg.dias[A.dia];
  return {
    pid, planoId: pr.pl.id, ciclo: pr.pl.ciclo, dia: A.dia, diaNome: `${d.nome} · ${t('home_tag')}`, foco: d.foco, semana: pr.semana, fase: pr.fase,
    deload: !!pr.sem.deload, nDias: pr.nD, total: pr.total, inicio: Date.now(), rir: pr.sem.rir, casa: { equip: A.equip || [], tempo: A.tempo, fonte: A.fonte || 'local' },
    exs: A.exercicios.map(item => itemDoTreino(pid, item, pr.sem, true)),
  };
}
const equipPills = equip => (equip && equip.length ? equip.map(e => `<span class="pill">${esc(L3(nomeCasaEquip(e, true)))}</span>`).join('') : `<span class="pill">${esc(t('home_body_tag'))}</span>`);

/* ---------- the Today screen while today's workout is the home version ---------- */
function hojeCasaHTML(pid, pr, A, topo, rodape) {
  const dia = pr.pg.dias[A.dia], vistas = new Set();
  const lista = A.exercicios.map(item => {
    const ex = exInfo(item.id), alv = alvo(item, pr.sem), sg = sugestao(pid, item, alv, true);
    const dica = item.dica && !vistas.has(item.dica) ? (vistas.add(item.dica), item.dica) : '';
    return `<div class="exitem"><span class="nm">${esc(ex.nome)}</span><span class="sg num">${sg.kg != null ? fmtKg(sg.kg) + ' kg' : ''}</span><span class="mt num">${alv.series} × ${alv.rmin}${alv.rmax !== alv.rmin ? '–' + alv.rmax : ''} ${unidade(ex)} · ${t('home_rest', { n: alv.desc })}</span>${item.porque ? `<span class="why">${esc(item.porque)}</span>` : ''}${dica ? `<span class="cue">${esc(dica)}</span>` : ''}</div>`;
  }).join('');
  return `<section class="screen">
    <div class="hero">
      ${topo}
      <p class="eyebrow casa-eb">${I.casa} ${t('home_eyebrow')}</p>
      <h1 class="h-display h1">${esc(A.nome || dia.nome)}</h1>
      ${A.nome || dia.foco ? `<p class="muted">${esc([A.nome ? t('home_from', { w: dia.nome }) : '', dia.foco].filter(Boolean).join(' · '))}</p>` : ''}
      <div class="casa-tags">${equipPills(A.equip)}<span class="pill acc num">${A.tempo} min</span></div>
      ${A.explicacao ? `<p class="tip">${esc(A.explicacao)}</p>` : ''}
      <p class="small muted">${t('effort_week', { n: pr.sem.rir, d: pr.sem.deload ? t('effort_half') : '' })}</p>
      <button class="btn big block" data-a="casaComecar">${t('home_start')}</button>
      <p class="xs muted">${t('home_only_today')}</p>
      <div class="casa-acts"><button class="btn quiet small" data-a="casaAbrir">${t('home_redo')}</button><button class="btn quiet small" data-a="casaVoltar">${t('home_back')}</button></div>
    </div>
    <div class="card pad"><div class="row between"><h2 class="h3">${t('coming_up')}</h2><span class="xs muted">${A.exercicios.length} ${t('home_exs')}</span></div><div class="exlist">${lista}</div></div>
    ${rodape}
  </section>`;
}
function iniciarTreinoCasa() {
  if (!S.canWrite) { toast(t('read_only_short')); return; }
  const A = casaHoje(S.me);
  if (!A) { render(); return; }
  closeSheet();
  S.live = montarSessaoCasa(S.me, A); S.liveFor = S.me;
  S.tab = 'hoje'; LS.set('td_tab', 'hoje');
  unlockAudio(); startWakeLock(); saveLiveNow();
  render(); window.scrollTo(0, 0);
}

/* ---------- the sheet: what you have, how long ---------- */
function abrirCasa() {
  const pid = S.me, A = casaHoje(pid), p = perfil(pid) || {};
  const tempo = A ? A.tempo : LS.get('ij_casa_tempo') || (CASA_TEMPOS.find(m => m >= (Number(p.minutos) || 45)) || 60);
  S.casa = { equip: A ? (A.equip || []).slice() : (LS.get('ij_casa_equip') || []), tempo, carregando: false, ctl: null };
  openSheet(t('home_title'), casaHTML(), () => { if (S.casa && S.casa.ctl) S.casa.ctl.abort(); S.casa = null; });
}
function casaHTML() {
  const c = S.casa, pr = progresso(S.me);
  if (!c || !pr) return '';
  if (c.carregando) return `<div class="stack"><p class="msg think">${t('home_making')}</p></div>`;
  const dia = pr.pg.dias[pr.proxDia];
  const chip = (on, nome, a, v) => `<button class="chip" data-a="${a}" data-v="${v}" aria-pressed="${on}">${esc(nome)}</button>`;
  return `<div class="stack">
    <p class="small">${esc(t('home_intro', { w: dia.nome }))}</p>
    <p class="eyebrow">${t('home_have')}</p>
    <div class="chips">${chip(!c.equip.length, t('home_body_only'), 'casaNada', '')}${CASA_EQUIP.map(([id, n]) => chip(c.equip.includes(id), L3(n), 'casaEquip', id)).join('')}</div>
    <p class="eyebrow">${t('home_time')}</p>
    <div class="seg">${CASA_TEMPOS.map(m => `<button data-a="casaTempo" data-v="${m}" aria-pressed="${c.tempo === m}">${m} min</button>`).join('')}</div>
    <button class="btn big block" data-a="casaGerar">${AI.on ? t('home_go_ai') : t('home_go')}</button>
  </div>`;
}
async function gerarCasa() {
  const c = S.casa, pid = S.me, pr = progresso(pid);
  if (!c || c.carregando || !pr) return;
  LS.set('ij_casa_equip', c.equip); LS.set('ij_casa_tempo', c.tempo);
  let res = null, falhou = false;
  if (AI.on) {
    c.carregando = true; c.ctl = new AbortController(); sheetBody(casaHTML());
    try { res = await adaptarCasaIA(pid, pr.proxDia, c.equip, c.tempo, c.ctl.signal); } catch (e) { if (e && e.code === 'cancelled') return; falhou = true; }
    if (!S.casa) return;
  }
  if (!res) res = adaptarCasaLocal(pid, pr.proxDia, c.equip, c.tempo);
  LS.set(casaKey(pid), { data: dayKey(Date.now()), planoId: pr.pl.id, dia: pr.proxDia, equip: c.equip.slice(), tempo: c.tempo, ...res });
  closeSheet(); S.tab = 'hoje'; render(); window.scrollTo(0, 0);
  toast(falhou ? t('home_fallback') : t('home_ready'));
}
