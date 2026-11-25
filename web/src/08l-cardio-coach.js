/* ---------- The coach's cardio for today ----------
   Three options, best first, chosen from what was trained today (legs, upper body or a day off), the
   cardio already done this week (what the plan still asks for, a hard session yesterday), the plan's
   week (a light week), the person (level, age, goal, joints, favorite machines) and the gym's machines.
   Each option is a whole guided session: method, machine, length and the machine numbers per part. */
const PERNAS_G = ['quadriceps', 'posteriores', 'gluteos', 'adutores', 'panturrilhas'];
const SUPERIOR_G = ['peito', 'costas', 'ombros', 'biceps', 'triceps'];
/* how much each machine loads the legs and the back, and how much impact it has */
const MAQ_INFO = {
  bike: { pernas: 1, costas: 0, impacto: 0 }, eliptico: { pernas: 0.7, costas: 0, impacto: 0 }, esteira_inclinada: { pernas: 0.8, costas: 0, impacto: 0.3 },
  remo: { pernas: 0.6, costas: 1, impacto: 0 }, escada: { pernas: 1, costas: 0, impacto: 0.2 }, corrida_esteira: { pernas: 1, costas: 0, impacto: 0.8 },
  corrida: { pernas: 1, costas: 0, impacto: 1 }, caminhada: { pernas: 0.4, costas: 0, impacto: 0.2 }, corda: { pernas: 0.9, costas: 0, impacto: 1 },
};
const classeProto = p => (p.nivel === 'easy' ? 'leve' : p.nivel === 'moderate' ? 'medio' : 'forte');
function classeCardio(c) {
  const p = PROTO[c.protocolo];
  if (p) return classeProto(p);
  const e = c.esforco || 0;
  return e >= 8 ? 'forte' : e >= 6 ? 'medio' : 'leve';
}
const nomeMaq = id => label4(CARDIO_MODOS, id);

Object.assign(STR, {
  sg_eyebrow: ['Coach\'s pick for today', 'Sugestão do treinador para hoje', 'Sugerencia del entrenador para hoy'],
  sg_n: ['Option {a} of {b}', 'Opção {a} de {b}', 'Opción {a} de {b}'],
  sg_how: ['How:', 'Como fazer:', 'Cómo hacerlo:'],
  sg_q: ['Do you like this one, or want another option?', 'Gostou desta ou quer outra opção?', '¿Te gusta esta o quieres otra opción?'],
  sg_q2: ['How about this one? Or another option?', 'E esta, gostou? Ou quer outra?', '¿Y esta? ¿O quieres otra?'],
  sg_yes: ['I like it, let\'s go', 'Gostei, vamos!', 'Me gusta, ¡vamos!'],
  sg_other: ['Another option', 'Outra opção', 'Otra opción'],
  sg_first: ['Back to the first', 'Voltar à 1ª', 'Volver a la 1.ª'],
  sg_line: ['Coach\'s cardio pick for today:', 'Cardio sugerido para hoje:', 'Cardio sugerido para hoy:'],
  sg_r_plan: ['Still due this week: {n} ({a} of {b} done).', 'Ainda falta na semana: {n} ({a} de {b} feitos).', 'Aún falta esta semana: {n} ({a} de {b} hechos).'],
  sg_r_extra: ['This week\'s planned cardio is done: this is an easy extra.', 'O cardio do plano desta semana já está feito: este é um extra leve.', 'El cardio del plan de esta semana ya está hecho: este es un extra suave.'],
  sg_r_legs_easy: ['You trained legs today: easy cardio helps you recover without tiring them more.', 'Hoje você treinou pernas: um cardio leve ajuda a recuperar sem cansar ainda mais.', 'Hoy entrenaste piernas: un cardio suave ayuda a recuperar sin cansarlas más.'],
  sg_r_noimpact: ['No impact on your joints.', 'Sem impacto nas articulações.', 'Sin impacto en las articulaciones.'],
  sg_r_upper_hiit: ['Today was upper body: your legs are fresh for intervals.', 'Hoje foi treino de superiores: as pernas estão descansadas para o intervalado.', 'Hoy fue tren superior: tus piernas están frescas para los intervalos.'],
  sg_r_rest_hiit: ['No strength training today: the best day for the hard session.', 'Dia sem musculação: o melhor dia para o treino forte.', 'Día sin pesas: el mejor día para la sesión fuerte.'],
  sg_r_next_legs: ['Your next workout is legs: better not to tire them today.', 'Seu próximo treino é de pernas: melhor não cansá-las hoje.', 'Tu próximo entreno es de piernas: mejor no cansarlas hoy.'],
  sg_r_after_hard: ['You did hard cardio yesterday: today is for taking it easy.', 'Você fez cardio forte ontem: hoje é para pegar leve.', 'Ayer hiciste cardio fuerte: hoy toca ir suave.'],
  sg_r_done_today: ['You already did cardio today: if you want more, keep it easy.', 'Você já fez cardio hoje: se quiser mais, que seja leve.', 'Ya hiciste cardio hoy: si quieres más, que sea suave.'],
  sg_r_deload: ['Light week in your plan: easy cardio to recover.', 'Semana leve do plano: cardio tranquilo para recuperar.', 'Semana ligera del plan: cardio tranquilo para recuperar.'],
  sg_r_fat: ['To lose fat, longer easy cardio adds up the most over the week.', 'Para perder gordura, o cardio leve e mais longo é o que mais soma na semana.', 'Para perder grasa, el cardio suave y más largo es lo que más suma en la semana.'],
  sg_r_health: ['The 4×4 is one of the best workouts for your heart and stamina.', 'O 4×4 é um dos treinos que mais melhoram o coração e o fôlego.', 'El 4×4 es de los entrenos que más mejoran el corazón y el aliento.'],
  sg_r_pref: ['{m} is one of your favorites.', '{m} está entre os seus favoritos.', '{m} está entre tus favoritos.'],
  sg_r_machine: ['This workout works best on this machine.', 'Esse treino funciona melhor neste aparelho.', 'Este entreno funciona mejor en esta máquina.'],
  sg_r_generic: ['It fits your plan and your level.', 'Combina com o seu plano e o seu nível.', 'Encaja con tu plan y tu nivel.'],
});

/* the strength sets done on a day: how much went to the legs and to the upper body */
function treinoDoDia(pid, ts) {
  const dk = dayKey(ts), ss = sessoesDe(pid).filter(s => !s.avaliacao && dayKey(s.inicio) === dk);
  if (S.live && S.live.pid === pid && dayKey(S.live.inicio) === dk && !ss.some(s => s.inicio === S.live.inicio)) ss.push(S.live);
  let pernas = 0, sup = 0, costas = 0, tot = 0;
  for (const s of ss) for (const x of s.exs || []) {
    if (x.pulado) continue;
    const n = (x.sets || []).filter(z => z.ok).length, g = exInfo(x.id, x.nome).grupo;
    if (!n || g === 'cardio') continue;
    tot += n;
    if (PERNAS_G.includes(g)) pernas += n;
    else if (SUPERIOR_G.includes(g)) { sup += n; if (g === 'costas') costas += n; }
  }
  return { feito: tot > 0, tot, pernas, sup, costas, fp: tot ? pernas / tot : 0, pesado: pernas >= 6 && tot && pernas / tot >= 0.4, superior: sup >= 6 && tot && sup / tot >= 0.6, casa: ss.some(s => s.casa) };
}
/* share of a planned day's sets that are legs */
function pernasDoDia(d) {
  let p = 0, tt = 0;
  for (const it of (d && d.exercicios) || []) { const n = it.series || 3, g = exInfo(it.id, it.nome).grupo; if (g === 'cardio') continue; tt += n; if (PERNAS_G.includes(g)) p += n; }
  return tt ? p / tt : 0;
}
function contextoCardio(pid) {
  const p = perfil(pid) || {}, pr = progresso(pid), ci = cardioSemanaInfo(pid), agora = Date.now();
  const hoje = treinoDoDia(pid, agora), ontem = treinoDoDia(pid, agora - 864e5);
  const hist = cardioDe(pid).slice().sort((a, b) => (b.inicio || 0) - (a.inicio || 0));
  const dkH = dayKey(agora), dkO = dayKey(agora - 864e5);
  /* what the plan still asks for this week: sessions logged from the plan count for theirs, the rest by how hard they were */
  const faltam = ci.sessoes.map(c => ({ c, feitos: 0, classe: classeProto(PROTO[c.protocolo] || PROTO.z2) }));
  const sobra = [];
  for (const d of ci.lista) { const f = faltam.find(x => x.c.nome === d.sessao && x.feitos < x.c.porSemana); if (f) f.feitos++; else sobra.push(d); }
  for (const d of sobra) {
    const k = classeCardio(d);
    const f = faltam.find(x => x.classe === k && x.feitos < x.c.porSemana) || (k === 'medio' ? faltam.find(x => x.classe === 'leve' && x.feitos < x.c.porSemana) : null);
    if (f) f.feitos++;
  }
  const lim = p.limites || [], set = equipSet(S.gym);
  return {
    pid, pr, faltam, hoje, ontemPernas: ontem.pesado,
    proxPernas: !!(pr && !pr.completo && pernasDoDia(pr.pg.dias[pr.proxDia]) >= 0.5),
    forteRecente: hist.some(c => classeCardio(c) === 'forte' && [dkH, dkO].includes(dayKey(c.inicio))),
    cardioHoje: hist.some(c => dayKey(c.inicio) === dkH),
    deload: !!(pr && pr.sem && pr.sem.deload),
    nivel: p.nivel || 'iniciante', idade: parseInt(p.idade, 10) || 0, obj: p.objetivo || '',
    joelho: lim.includes('joelho') || lim.includes('quadril'), lombar: lim.includes('lombar'),
    prefs: p.cardioModos || [], ultimo: hist[0] || null,
    usados: new Set(hist.filter(c => agora - (c.inicio || 0) < 14 * 864e5).map(c => c.modo)),
    pode: id => !set.size || !EX[id] || disponivel(EX[id], set),
  };
}
/* every workout × machine this person can do here today */
function candidatosCardio(ctx) {
  const out = [];
  for (const p of PROTOCOLOS) {
    if (p.oculto) continue;
    const doPlano = ctx.faltam.filter(x => x.c.protocolo === p.id).flatMap(x => x.c.opcoes || []);
    for (const maq of [...new Set([...doPlano, ...p.maq])]) {
      if (!EX[maq] || !ALVO_MAQS.includes(maq) || !ctx.pode(maq)) continue;
      if (ctx.hoje.casa && !['caminhada', 'corrida', 'corda'].includes(maq)) continue;
      if (ctx.joelho && ['corrida', 'corrida_esteira', 'corda'].includes(maq)) continue;
      out.push({ p, maq });
    }
  }
  return out;
}
function pontuarCardio(cand, ctx) {
  const p = cand.p, maq = cand.maq, cl = classeProto(p), max = p.nivel === 'max', mi = MAQ_INFO[maq] || { pernas: 0.7, costas: 0, impacto: 0.5 };
  let s = 0;
  const r = [];
  const add = (v, k, x) => { s += v; if (v > 0 && k) r.push([v, k, x || {}]); };
  /* 1. what the plan still asks for this week */
  const f = ctx.faltam.find(x => x.c.protocolo === p.id && x.feitos < x.c.porSemana);
  const fc = f || ctx.faltam.find(x => x.classe === cl && x.feitos < x.c.porSemana);
  if (f) add(40, 'sg_r_plan', { n: f.c.nome, a: f.feitos, b: f.c.porSemana });
  else if (fc) add(26, 'sg_r_plan', { n: fc.c.nome, a: fc.feitos, b: fc.c.porSemana });
  else if (ctx.faltam.length) add(cl === 'leve' ? 6 : -12, cl === 'leve' ? 'sg_r_extra' : '');
  else add(cl === 'leve' ? 16 : cl === 'medio' ? 10 : 6, '');
  /* 2. what was trained today, yesterday and next */
  const h = ctx.hoje;
  if (h.pesado) {
    if (cl === 'forte') add(-32 * (0.5 + mi.pernas / 2), ''); else if (cl === 'medio') add(-10, ''); else add(16, 'sg_r_legs_easy');
    if (mi.impacto >= 0.5) add(-14, ''); else if (cl === 'leve' && mi.impacto < 0.3) add(4, 'sg_r_noimpact');
  } else if (h.superior) {
    if (cl === 'forte') { add(12, 'sg_r_upper_hiit'); if (mi.costas && h.costas >= 4) add(-14, ''); }
  } else if (!h.feito) {
    if (cl === 'forte') add(9, 'sg_r_rest_hiit');
  } else if (h.fp >= 0.25) {
    add(max ? -12 : cl === 'forte' ? -5 : 0, '');
  }
  if (cl === 'forte' && ctx.ontemPernas) add(-8 * mi.pernas, '');
  if (ctx.proxPernas && !h.pesado) { if (cl === 'forte') add(-7 * mi.pernas, ''); else if (!h.feito) add(4, 'sg_r_next_legs'); }
  /* 3. recent cardio */
  if (ctx.forteRecente) add(cl === 'forte' ? -28 : cl === 'leve' ? 8 : 0, cl === 'leve' ? 'sg_r_after_hard' : '');
  if (ctx.cardioHoje) add(cl === 'leve' ? 2 : -20, cl === 'leve' ? 'sg_r_done_today' : '');
  /* 4. a light week in the plan */
  if (ctx.deload) add(cl === 'forte' ? -45 : cl === 'medio' ? -12 : 10, cl === 'leve' ? 'sg_r_deload' : '');
  /* 5. the person */
  if (ctx.nivel === 'iniciante') { if (max) add(-30, ''); else if (cl === 'forte' && !f) add(-12, ''); }
  if (ctx.idade >= 55 && max) add(-20, '');
  if (ctx.lombar && maq === 'remo') add(-20, '');
  if (ctx.joelho && maq === 'escada') add(-30, '');
  if (ctx.obj === 'emagrecer' && p.id === 'z2') add(6, 'sg_r_fat');
  if (ctx.obj === 'saude' && p.id === 'n4x4') add(6, 'sg_r_health');
  if ((ctx.obj === 'hipertrofia' || ctx.obj === 'forca') && cl === 'leve' && mi.impacto < 0.5) add(3, '');
  /* 6. favorite machines, the machine the workout suits best, a little variety */
  if (ctx.prefs.includes(maq)) add(8, 'sg_r_pref', { m: nomeMaq(maq) });
  if (f && (f.c.opcoes || [])[0] === maq) add(5, '');
  const ordem = p.maq.indexOf(maq);
  add(ordem === 0 ? 4 : ordem === 1 ? 2 : ordem > 1 ? 1 : 0, ordem === 0 && (p.id === 'sprint' || p.id === 'tabata') ? 'sg_r_machine' : '');
  if (ctx.ultimo && ctx.ultimo.protocolo === p.id && ctx.ultimo.modo === maq) add(-5, '');
  if (ctx.usados.has(maq)) add(2, '');
  return { s, r: r.sort((a, b) => b[0] - a[0]) };
}
/* how long: the plan's length for that session this week, or the workout's usual one */
function paramSugestao(p, ctx) {
  const c = (ctx.faltam.find(x => x.c.protocolo === p.id && x.feitos < x.c.porSemana) || {}).c;
  let param = c ? paramDe(p, cardioAlvo(c, ctx.pr && ctx.pr.sem).minutosAlvo) : p.def;
  if (!c && ctx.deload && p.modo === 'dur') param = Math.round((p.def * 0.7) / 5) * 5;
  if (ctx.cardioHoje && p.modo === 'dur') param = Math.min(param, 20);
  return { param: clamp(param, p.min, p.max), sessao: c ? c.nome : '' };
}
/* best first; the second on another machine (in case it's the machine you don't feel like), the third another
   kind of workout when it is still a good one for today, otherwise the best on a third machine */
function escolherTres(lista) {
  const ord = lista.slice().sort((a, b) => b.s - a.s);
  const out = [];
  const melhor = ok => ord.find(c => !out.includes(c) && ok(c));
  const poe = x => { if (x) out.push(x); return x; };
  if (!poe(melhor(() => true))) return out;
  const a = out[0];
  poe(melhor(c => c.maq !== a.maq) || melhor(c => c.p.id !== a.p.id) || melhor(() => true));
  const outroTipo = melhor(c => out.every(o => o.p.id !== c.p.id) && c.maq !== a.maq);
  const outraMaq = melhor(c => out.every(o => o.maq !== c.maq));
  poe(outroTipo && (!outraMaq || outroTipo.s >= outraMaq.s - 15) ? outroTipo : outraMaq || melhor(() => true));
  return out;
}
let SG_CACHE = { k: '', v: [] };
function sugestoesCardio(pid) {
  pid = pid || S.me;
  const p = perfil(pid);
  if (!p) return [];
  const k = [pid, dayKey(Date.now()), S.sessoes.length, S.cardio.length, p.atualizadoEm || 0, S.live ? contagem(S.live).ok : -1, (S.gym && (S.gym.itens || []).length) || 0, LANG()].join('|');
  if (SG_CACHE.k === k) return SG_CACHE.v;
  const ctx = contextoCardio(pid);
  const lista = candidatosCardio(ctx).map(c => ({ ...c, ...pontuarCardio(c, ctx) }));
  const v = escolherTres(lista).map(c => {
    const { param, sessao } = paramSugestao(c.p, ctx);
    const motivos = c.r.slice(0, 3).map(([, key, x]) => t(key, x));
    return { p: c.p, maq: c.maq, param, sessao, s: c.s, segs: c.p.build(param), motivos: motivos.length ? motivos : [t('sg_r_generic')] };
  });
  SG_CACHE = { k, v };
  return v;
}

/* ---------- on screen ---------- */
function sugestaoCardHTML() {
  const sg = sugestoesCardio(S.me);
  if (!sg.length) return '';
  const i = clamp(S.sgIdx || 0, 0, sg.length - 1), o = sg[i], total = Math.round(totalSeg(o.segs) / 60), ult = i >= sg.length - 1;
  return `<div class="card pad stack sg-card" id="sgCard">
    <div class="sg-top"><span class="sg-ic" aria-hidden="true">${I.coach}</span><p class="eyebrow">${t('sg_eyebrow')}</p><span class="sg-n num">${t('sg_n', { a: i + 1, b: sg.length })}</span></div>
    <div class="sg-head"><div class="sg-nome"><h2 class="h3">${esc(L3(o.p.nome))} · ${esc(nomeMaq(o.maq))}</h2><span class="pill lvl-${o.p.nivel}">${esc(L3(NIVEL_LBL[o.p.nivel]))}</span></div><span class="sg-min num">${t('min_total', { n: total })}</span></div>
    <ul class="sg-why">${o.motivos.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
    <p class="small"><b>${t('sg_how')}</b> ${esc(L3(o.p.desc))}</p>
    ${alvosHTML(o.segs, o.maq, '', true)}
    <p class="sg-q">${t(i ? 'sg_q2' : 'sg_q')}</p>
    <div class="grid2"><button class="btn" data-a="sgIr">${t('sg_yes')}</button><button class="btn ghost" data-a="sgOutra">${t(ult ? 'sg_first' : 'sg_other')}</button></div>
  </div>`;
}
/* one line for the Today card and the reward after a workout */
function sugestaoLinhaHTML(pid) {
  const o = sugestoesCardio(pid)[0];
  if (!o) return '';
  return `<p class="sg-line small">${I.coach}<span><b>${t('sg_line')}</b> ${esc(L3(o.p.nome))} · ${esc(nomeMaq(o.maq))} · ${t('min_total', { n: Math.round(totalSeg(o.segs) / 60) })}</span></p>`;
}
/* "I like it": the usual setup sheet, already set to this option (same session, same numbers) */
function abrirSugestao() {
  const sg = sugestoesCardio(S.me), o = sg[clamp(S.sgIdx || 0, 0, sg.length - 1)];
  if (!o) return;
  const plano = (cardioSemanaInfo(S.me).sessoes.find(c => c.nome === o.sessao) || {}).opcoes || [];
  const maqs = [...new Set([o.maq, ...plano, ...o.p.maq])].filter(m => EX[m]);
  S.setup = { id: o.p.id, param: o.param, maq: o.maq, maqs, sessao: o.sessao, segs: o.segs, segsK: o.p.id + ':' + o.param };
  openSheet(L3(o.p.nome), setupHTML());
}
