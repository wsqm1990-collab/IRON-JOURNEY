/* ---------- when an exercise stops progressing: what a personal trainer changes ----------
   Double progression adds reps, then weight. When an exercise shows no progress for 3 workouts in a row
   (the estimated max, which already counts the reps left in reserve, not up by more than 1.5%: one more
   rep is about 2.5%), or drops more than 5% in the last 2, insisting does not help. A trainer changes
   something, in this order:
   1. the light week is next week: keep the weight, the light week often unlocks it;
   2. 10% lighter, then double progression climbs back (reps first, then weight) and past the old best;
   3. stalled again within 10 weeks of that: swap for a variation of the movement. Planned variation helps
      strength and regional growth, while swapping too often gets in the way (Kassiano et al. 2022,
      systematic review); a period of less training stress lets fatigue clear (deloading consensus,
      Bell et al. 2023).
   Light weeks and assessments don't count; gym and home are counted apart (different weights). */
Object.assign(STR, {
  tv_pill: ['Stalled for {n} workouts', 'Travado há {n} treinos', 'Estancado hace {n} entrenos'],
  tv_pill_drop: ['Dropping lately', 'Caindo nos últimos treinos', 'Bajando en los últimos entrenos'],
  tv_reset_h: ['Today {kg} kg: 10% lighter to break through.', 'Hoje {kg} kg: 10% a menos para destravar.', 'Hoy {kg} kg: 10% menos para desatascarte.'],
  tv_reset_d: ['You stayed at the same level for the last {n} workouts. With less weight every rep comes out clean, and the app adds weight again each workout until you pass your old best.', 'Você ficou no mesmo nível nos últimos {n} treinos. Com menos peso, cada repetição sai perfeita, e o app sobe o peso de novo a cada treino até você passar do seu melhor de antes.', 'Te quedaste en el mismo nivel en los últimos {n} entrenos. Con menos peso cada repetición sale perfecta, y la app vuelve a subir el peso en cada entreno hasta que superes tu mejor marca.'],
  tv_drop_d: ['Your performance dropped in the last 2 workouts: that is usually accumulated fatigue. With less weight your body recovers, and the app adds weight again each workout. Check your sleep (7 to 9 hours) and your food.', 'Seu desempenho caiu nos últimos 2 treinos: costuma ser cansaço acumulado. Com menos peso o corpo se recupera, e o app sobe o peso de novo a cada treino. Confira o sono (7 a 9 horas) e a alimentação.', 'Tu rendimiento bajó en los últimos 2 entrenos: suele ser cansancio acumulado. Con menos peso el cuerpo se recupera, y la app vuelve a subir el peso en cada entreno. Revisa el sueño (7 a 9 horas) y la comida.'],
  tv_swap_h: ['Time to swap for a variation.', 'Hora de trocar por uma variação.', 'Hora de cambiar por una variante.'],
  tv_swap_d: ['It stalled again even after the lighter weight. A similar exercise (another machine or grip) usually gets you moving again. If you would rather not swap, keep the weight and aim for 1 more rep.', 'Travou de novo mesmo depois de baixar o peso. Um exercício parecido (outro aparelho ou outra pegada) costuma destravar. Se preferir não trocar, mantenha o peso e busque 1 repetição a mais.', 'Se estancó otra vez incluso después de bajar el peso. Un ejercicio parecido (otra máquina u otro agarre) suele desatascarte. Si prefieres no cambiar, mantén el peso y busca 1 repetición más.'],
  tv_wait_h: ['Keep the weight: your light week is next week.', 'Mantenha o peso: a semana leve é na semana que vem.', 'Mantén el peso: tu semana ligera es la próxima.'],
  tv_wait_d: ['You stayed at the same level for the last {n} workouts. The light week usually unlocks it: after it your body comes back stronger.', 'Você ficou no mesmo nível nos últimos {n} treinos. A semana leve costuma destravar: depois dela o corpo volta mais forte.', 'Te quedaste en el mismo nivel en los últimos {n} entrenos. La semana ligera suele desatascarte: después de ella el cuerpo vuelve más fuerte.'],
  tv_wait_drop_d: ['Your performance dropped in the last 2 workouts: that is usually accumulated fatigue, and the light week next week is made for it.', 'Seu desempenho caiu nos últimos 2 treinos: costuma ser cansaço acumulado, e a semana leve da semana que vem existe para isso.', 'Tu rendimiento bajó en los últimos 2 entrenos: suele ser cansancio acumulado, y la semana ligera de la próxima semana existe para eso.'],
  tv_bw_h: ['Make it harder: lower in 3 seconds, or swap for a harder variation.', 'Deixe mais difícil: desça em 3 segundos, ou troque por uma variação mais difícil.', 'Hazlo más difícil: baja en 3 segundos, o cámbialo por una variante más difícil.'],
  tv_bw_d: ['You stayed at the same number for the last {n} workouts.', 'Você ficou no mesmo número nos últimos {n} treinos.', 'Te quedaste en el mismo número en los últimos {n} entrenos.'],
  tv_swap_btn: ['Swap for a variation', 'Trocar por uma variação', 'Cambiar por una variante'],
  tv_why: ['Why?', 'Por que isso?', '¿Por qué?'],
  tv_why_t: ['When an exercise stops improving for 2 or 3 workouts in a row, trainers change something instead of insisting: first they lighten the weight and climb back; if it stalls again, they swap for a variation. Reviews of studies show that planned exercise variation helps strength and muscle, while swapping too often gets in the way (Kassiano and colleagues, 2022). A while of lighter training also lets fatigue clear (consensus on light weeks, Bell and colleagues, 2023). Also check: 7 to 9 hours of sleep, protein at every meal and enough food overall.',
    'Quando um exercício para de evoluir por 2 ou 3 treinos seguidos, treinadores mudam algo em vez de insistir: primeiro aliviam o peso e sobem de novo; se travar outra vez, trocam por uma variação. Revisões de estudos mostram que variar exercícios de forma planejada ajuda a força e o músculo, mas trocar demais atrapalha (Kassiano e colegas, 2022). Um tempo de treino mais leve também ajuda o cansaço a passar (consenso sobre semanas leves, Bell e colegas, 2023). Confira também: sono de 7 a 9 horas, proteína em todas as refeições e comer o suficiente.',
    'Cuando un ejercicio deja de mejorar 2 o 3 entrenos seguidos, los entrenadores cambian algo en vez de insistir: primero aligeran el peso y vuelven a subir; si se estanca otra vez, lo cambian por una variante. Las revisiones de estudios muestran que variar ejercicios de forma planificada ayuda a la fuerza y al músculo, pero cambiar demasiado estorba (Kassiano y colegas, 2022). Un tiempo de entrenamiento más ligero también ayuda a que pase el cansancio (consenso sobre semanas ligeras, Bell y colegas, 2023). Revisa también: 7 a 9 horas de sueño, proteína en cada comida y comer lo suficiente.'],
  tv_tag: ['stalled', 'travou', 'estancado'],
  tv_today: ['Stalled: the app adjusted it to get you moving again. You will see how when you start.', 'Travou: o app ajustou para destravar. Você vê como quando começar o treino.', 'Estancado: la app lo ajustó para desatascarte. Verás cómo al empezar.'],
  sug_reset: ['10% lighter to break through: {kg} kg.', '10% a menos para destravar: {kg} kg.', '10% menos para desatascarte: {kg} kg.'],
  sug_stall_swap: ['Stalled again: swap for a variation, or keep the weight and aim for 1 more rep.', 'Travou de novo: troque por uma variação, ou mantenha o peso e busque 1 repetição a mais.', 'Estancado otra vez: cámbialo por una variante, o mantén el peso y busca 1 repetición más.'],
  sug_stall_wait: ['Stalled: keep the weight, the light week next week usually unlocks it.', 'Travou: mantenha o peso, a semana leve da semana que vem costuma destravar.', 'Estancado: mantén el peso, la semana ligera de la próxima semana suele desatascarte.'],
  sug_stall_bw: ['Stalled: lower in 3 seconds, or swap for a harder variation.', 'Travou: desça em 3 segundos, ou troque por uma variação mais difícil.', 'Estancado: baja en 3 segundos, o cámbialo por una variante más difícil.'],
  vs_reset: [', 10% lighter to break through', ', 10% a menos para destravar', ', 10% menos para desatascarte'],
  tt_trava: ['This exercise stalled: it stayed at the same level in the last workouts. Like a personal trainer, the app changes the plan: first a lighter weight to climb back up; if it stalls again, a variation of the exercise.', 'Este exercício travou: ficou no mesmo nível nos últimos treinos. Como um personal, o app muda a estratégia: primeiro um peso mais leve para subir de novo; se travar outra vez, uma variação do exercício.', 'Este ejercicio se estancó: quedó en el mismo nivel en los últimos entrenos. Como un entrenador personal, la app cambia la estrategia: primero un peso más ligero para volver a subir; si se estanca otra vez, una variante del ejercicio.'],
});
/* the reason chip in the swap sheet (the coach's pick reads it too) */
if (!MOTIVOS.some(m => m[0] === 'travou')) MOTIVOS.push(['travou', 'It stalled', 'Travou', 'Se estancó']);
const TV_N = 3, TV_GANHO = 1.015, TV_QUEDA = 0.95, TV_VARIAR_SEM = 10;
/* the real workouts with this exercise, newest first: no light weeks, no assessments, gym or home apart */
function exposicoes(pid, exId, casa, n) {
  const out = [];
  for (const s of sessoesDe(pid)) {
    if (s.avaliacao || s.deload || !!s.casa !== !!casa) continue;
    const x = (s.exs || []).find(e => e.id === exId && !e.pulado && (e.sets || []).some(z => z.ok && z.reps > 0));
    if (!x) continue;
    out.push({ s, x });
    if (out.length >= n) break;
  }
  return out;
}
/* how well it went: the estimated max with the reps left in reserve; reps (or seconds) without load */
function desempenhoEx(ex, s, x) {
  const ok = (x.sets || []).filter(z => z.ok && z.reps > 0);
  if (!ok.length) return 0;
  if (!usaCarga(ex)) return Math.max(...ok.map(z => z.reps));
  const rir = s.rir != null ? s.rir : x.alvo && x.alvo.rir != null ? x.alvo.rir : 2;
  const comKg = ok.filter(z => z.kg > 0);
  return comKg.length ? Math.max(...comKg.map(z => e1rmRIR(z.kg, z.reps, rir))) : 0;
}
/* null when it is progressing; otherwise what to do: reset | variacao | espera | bw */
function travaDe(pid, item, casa = false) {
  const ex = exInfo(item.id, item.nome);
  if (ex.grupo === 'cardio' || ex.carga === 'n') return null;
  const hs = exposicoes(pid, item.id, casa, 12);
  /* a lighter restart begins a new count */
  const k = hs.findIndex(h => h.x.trava === 'reset');
  const jan = k >= 0 ? hs.slice(0, k) : hs;
  if (jan.length < TV_N) return null;
  const tres = jan.slice(0, TV_N);
  /* body weight with extra load: reps alone don't tell */
  if (ex.carga === 'c' && tres.some(h => (h.x.sets || []).some(z => z.kg > 0))) return null;
  if (tres[0].s.inicio - tres[TV_N - 1].s.inicio < 5 * 864e5) return null;
  const [c, b, a] = tres.map(h => desempenhoEx(ex, h.s, h.x));
  if (!(a > 0)) return null;
  const caiu = b < a * TV_QUEDA && c < a * TV_QUEDA, parado = Math.max(b, c) <= a * TV_GANHO;
  if (!parado && !caiu) return null;
  const base = { n: TV_N, caiu };
  const pr = progresso(pid), prox = pr && !pr.completo ? pr.pg.semanas[pr.semanaIdx + 1] : null;
  if (prox && prox.deload) return { ...base, tipo: 'espera' };
  if (!usaCarga(ex)) return { ...base, tipo: 'bw' };
  const ok = (tres[0].x.sets || []).filter(z => z.ok && z.kg > 0 && z.reps > 0), w = ok.length ? Math.max(...ok.map(z => z.kg)) : 0;
  if (!w) return null;
  if (k >= 0 && Date.now() - hs[k].s.inicio < TV_VARIAR_SEM * 7 * 864e5) return { ...base, tipo: 'variacao', kg: w };
  const novo = arredondar(ex, w * 0.9, -1);
  /* already at the lightest weight there is: a variation instead */
  if (!(novo > 0 && novo < w)) return { ...base, tipo: 'variacao', kg: w };
  return { ...base, tipo: 'reset', de: w, kg: novo };
}
/* what the workout card says, in place of the usual line about today's weight */
function travaHTML(x, i) {
  const tv = x.sug.trava;
  const h = tv.tipo === 'reset' ? t('tv_reset_h', { kg: fmtKg(tv.kg) }) : tv.tipo === 'espera' ? t('tv_wait_h') : tv.tipo === 'bw' ? t('tv_bw_h') : t('tv_swap_h');
  const d = tv.tipo === 'reset' ? t(tv.caiu ? 'tv_drop_d' : 'tv_reset_d', { n: tv.n }) : tv.tipo === 'espera' ? t(tv.caiu ? 'tv_wait_drop_d' : 'tv_wait_d', { n: tv.n })
    : tv.tipo === 'bw' ? t('tv_bw_d', { n: tv.n }) : t('tv_swap_d');
  const troca = (tv.tipo === 'variacao' || tv.tipo === 'bw') && !x.pulado;
  return `<div class="trava" id="trava-${i}">
    <span class="pill warn">${esc(tv.caiu ? t('tv_pill_drop') : t('tv_pill', { n: tv.n }))}</span>
    <p class="small"><b>${esc(h)}</b></p>
    <p class="small muted">${esc(d)}</p>
    ${troca ? `<button class="btn ghost small" data-a="travaTrocar" data-i="${i}">${I.troca}${t('tv_swap_btn')}</button>` : ''}
    <details class="bc-how"><summary>${t('tv_why')}</summary><p class="small">${esc(t('tv_why_t'))}</p></details>
  </div>`;
}
/* the swap sheet, open on the stall: the reason already chosen and the swap kept in the plan */
function travaTrocar(i) {
  abrirTroca({ scope: 'live', i, familia: true });
  if (!S.swap) return;
  S.swap.motivo = 'travou';
  if (!(S.live && S.live.casa)) S.swap.escopo = 'plano';
  sheetBody(swapHTML());
}
/* for the AI coach: which plan exercises are stalled now, and what the app is doing about it */
function travasPlanoEn(pid) {
  const pr = progresso(pid);
  if (!pr) return '';
  const vistos = new Set(), linhas = [];
  for (const d of pr.pg.dias) for (const item of d.exercicios || []) {
    if (vistos.has(item.id)) continue;
    vistos.add(item.id);
    let tv = null;
    try { tv = travaDe(pid, item, false); } catch { tv = null; }
    if (!tv) continue;
    const plano = { reset: `reset 10% (${tv.de} -> ${tv.kg} kg) and build back up with double progression`, variacao: 'swap for a variation (it stalled again after a reset)', espera: 'keep the weight until the light week next week', bw: 'slower lowering (3 s) or a harder variation' }[tv.tipo];
    linhas.push(`${exInfo(item.id, item.nome).nomeEn} (${tv.caiu ? 'dropping' : 'no progress'} in the last ${tv.n} sessions; the app's plan: ${plano})`);
  }
  return linhas.length ? 'Stalled exercises now: ' + linhas.join('; ') : '';
}
