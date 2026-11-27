/* ---------- Periodic re-assessments: the trainer's calendar of tests ----------
   Each quality changes at its own pace, and testing too soon makes a plan that works look like it doesn't
   (ACE: formal retests every 4–12 weeks; strength can move within a month, waist and cardio need longer).
   Strength rises first through the nervous system and muscle growth shows within about 6 weeks (ACSM 2009
   position stand on progression in resistance training); people who have trained longer progress more
   slowly, so their tests are further apart. Fat loss is best at 0.5–1% of body weight a week to keep muscle
   (Helms, Aragon & Fitschen 2014), so the body is measured every 2 weeks when that is the goal.
   A test that falls near the plan's light week is done in it: rested, the numbers are honest.
   A re-assessment is short: only what is due, done like last time, then before × now against what is
   expected for the person's level in that time. */
const REAV_COMPS = ['corpo', 'forca', 'resist', 'folego', 'mobil'];
const REAV_SEM = {
  corpo: { iniciante: 4, intermediario: 4, avancado: 4 },
  forca: { iniciante: 4, intermediario: 6, avancado: 8 },
  resist: { iniciante: 4, intermediario: 6, avancado: 8 },
  folego: { iniciante: 6, intermediario: 8, avancado: 10 },
  mobil: { iniciante: 6, intermediario: 8, avancado: 12 },
};
/* what matters most for each goal; the rest is tested half as often again */
const REAV_FOCO = { hipertrofia: ['corpo', 'forca'], forca: ['forca', 'resist'], emagrecer: ['corpo', 'folego', 'forca'], saude: ['folego', 'resist', 'mobil', 'corpo'] };
const REAV_MIN = { corpo: 3, forca: 10, resist: 5, folego: 8, mobil: 3 };
/* on the light-tests-only path, cardio is just the resting heart rate */
const minComp = (k, leve) => (k === 'folego' && leve ? 2 : REAV_MIN[k]);
/* which saved results belong to each quality (push-ups are strength at home, endurance anywhere) */
const REAV_TEM = {
  forca: (r, av) => (r.forca || []).length > 0 || !!r.barra || (av.onde === 'casa' && !!r.flexoes),
  resist: r => !!(r.flexoes || r.prancha || r.agach),
  folego: r => !!(r.degrau || r.vo2 || r.caminhada || r.repouso),
  mobil: r => !!(r.alcance || r.costas || r.agachObs),
};
const SEMANA_MS = 7 * 864e5;

Object.assign(STR, {
  rv_eyebrow: ['Re-assessment', 'Reavaliação', 'Reevaluación'],
  rv_title: ['Time to measure your progress', 'Hora de medir sua evolução', 'Hora de medir tu progreso'],
  rv_why_weeks: ['{w} since your last {x} test: enough time for real change to show.', 'Já se passaram {w} desde o último teste de {x}: tempo suficiente para a mudança aparecer.', 'Pasaron {w} desde tu última prueba de {x}: tiempo suficiente para que el cambio se note.'],
  rv_why_light: ['Light week in your plan: the best time to test, because you are rested.', 'Semana leve do plano: o melhor momento para testar, porque você está descansado.', 'Semana ligera del plan: el mejor momento para medirte, porque estás descansado.'],
  rv_why_chapter: ['Chapter complete: see what this block did for you before the next one.', 'Capítulo concluído: veja o que este bloco fez por você antes do próximo.', 'Capítulo completado: mira lo que este bloque hizo por ti antes del siguiente.'],
  rv_why_first: ['A first test of this quality, to have a starting point.', 'Um primeiro teste dessa qualidade, para ter um ponto de partida.', 'Una primera prueba de esta cualidad, para tener un punto de partida.'],
  rv_do: ['Do it now', 'Fazer agora', 'Hacerla ahora'], rv_later: ['Later', 'Depois', 'Después'],
  rv_later_ok: ['OK, I\'ll remind you in 3 days.', 'Combinado, eu lembro de novo em 3 dias.', 'De acuerdo, te lo recuerdo en 3 días.'],
  rv_do_n: ['Do the re-assessment (≈ {n} min)', 'Fazer a reavaliação (≈ {n} min)', 'Hacer la reevaluación (≈ {n} min)'],
  rv_schedule: ['Your re-assessments', 'Suas reavaliações', 'Tus reevaluaciones'],
  rv_before_next: ['Re-assess first (≈ {n} min)', 'Reavaliar antes (≈ {n} min)', 'Reevaluar antes (≈ {n} min)'],
  rv_before_next_d: ['A personal trainer tests at the end of each block: the next chapter then starts from your new numbers.', 'Um personal testa no fim de cada bloco: assim o próximo capítulo já começa com os seus números novos.', 'Un entrenador personal mide al final de cada bloque: así el próximo capítulo empieza con tus números nuevos.'],
  rv_every: ['every {n} weeks', 'a cada {n} semanas', 'cada {n} semanas'],
  rv_last: ['last {d}', 'última {d}', 'última {d}'], rv_never: ['not tested yet', 'ainda não testado', 'aún sin probar'],
  rv_due_now: ['due now', 'está na hora', 'ya toca'], rv_next_on: ['next: {d}', 'próximo: {d}', 'próxima: {d}'], rv_blocked: ['after a doctor clears it', 'depois da liberação médica', 'tras la autorización médica'],
  rv_focus: ['your goal', 'seu objetivo', 'tu objetivo'],
  rv_c_corpo: ['Body measurements', 'Medidas do corpo', 'Medidas del cuerpo'], rv_c_forca: ['Strength', 'Força', 'Fuerza'], rv_c_resist: ['Endurance', 'Resistência', 'Resistencia'], rv_c_folego: ['Cardio', 'Fôlego', 'Aliento'], rv_c_mobil: ['Mobility', 'Mobilidade', 'Movilidad'],
  rv_d_corpo: ['weight and tape measure', 'peso e fita métrica', 'peso y cinta métrica'],
  rv_d_forca_g: ['your test weights, like last time', 'seus pesos de teste, como da última vez', 'tus pesos de prueba, como la última vez'],
  rv_d_forca_c: ['push-ups and pull-ups', 'flexões e barra', 'flexiones y dominadas'],
  rv_d_resist: ['push-ups, 1-minute squats and plank', 'flexões, agachamentos em 1 minuto e prancha', 'flexiones, sentadillas en 1 minuto y plancha'],
  rv_d_folego: ['resting heart rate and the same cardio test', 'batimentos em repouso e o mesmo teste de fôlego', 'pulso en reposo y la misma prueba de aliento'],
  rv_d_folego_leve: ['resting heart rate', 'batimentos em repouso', 'pulso en reposo'],
  rv_prev_m: ['Last measured on {d}: the numbers in grey.', 'Última medida em {d}: são os números em cinza.', 'Última medida el {d}: son los números en gris.'],
  rv_full: ['Redo the full assessment', 'Refazer a avaliação completa', 'Repetir la evaluación completa'],
  rv_next: ['Next tests', 'Próximos testes', 'Próximas pruebas'],
  tr_reav: ['Re-assessment: like a personal trainer, the app books short tests when there has been enough time for change to show at your level. Tap "{a}" to do it now, or "{b}" to leave it for another day.', 'Reavaliação: como um personal, o app marca testes curtos quando já deu tempo de a mudança aparecer para o seu nível. Toque em "{a}" para fazer agora, ou em "{b}" para deixar para outro dia.', 'Reevaluación: como un entrenador personal, la app agenda pruebas cortas cuando ya pasó tiempo suficiente para que el cambio se note en tu nivel. Toca "{a}" para hacerla ahora, o "{b}" para dejarla para otro día.'],
  rv_d_mobil: ['reach, shoulders and the watched squat', 'alcance, ombros e o agachamento observado', 'alcance, hombros y la sentadilla observada'],
  rv_why_h: ['Why these intervals?', 'Por que esses intervalos?', '¿Por qué estos intervalos?'],
  rv_sci_1: ['Each quality changes at its own pace, and testing too soon can make a plan that works look like it doesn\'t.', 'Cada qualidade do corpo muda num ritmo diferente, e testar cedo demais pode dar a impressão de que o treino não está funcionando.', 'Cada cualidad del cuerpo cambia a su ritmo, y medir demasiado pronto puede hacer parecer que un plan que funciona no funciona.'],
  rv_sci_2: ['Strength rises fast in the first weeks, as your nervous system learns the movements; later it grows more slowly.', 'Força: nas primeiras semanas ela sobe rápido, porque o sistema nervoso aprende o movimento; depois cresce mais devagar.', 'Fuerza: en las primeras semanas sube rápido, porque el sistema nervioso aprende el movimiento; después crece más despacio.'],
  rv_sci_3: ['Muscle growth starts to show at around 6 weeks; the tape measure shows it by comparing several measurements.', 'Músculo e medidas: o crescimento do músculo começa a aparecer por volta de 6 semanas, e a fita métrica mostra isso comparando várias medidas.', 'Músculo y medidas: el crecimiento del músculo empieza a notarse hacia las 6 semanas, y la cinta métrica lo muestra comparando varias medidas.'],
  rv_sci_4: ['Cardio and your heart take longer to change: 6 to 10 weeks. Mobility, 6 to 12.', 'Fôlego e coração costumam levar mais tempo: de 6 a 10 semanas. Mobilidade, de 6 a 12.', 'El aliento y el corazón tardan más en cambiar: de 6 a 10 semanas. La movilidad, de 6 a 12.'],
  rv_sci_5: ['To lose fat without losing muscle, the target is 0.5% to 1% of your body weight a week; with that goal, the body is measured every 2 weeks.', 'Para perder gordura sem perder músculo, o ideal é perder de 0,5% a 1% do peso por semana; por isso, quem quer emagrecer mede o corpo a cada 2 semanas.', 'Para perder grasa sin perder músculo, lo ideal es perder del 0,5% al 1% del peso por semana; por eso, con ese objetivo, el cuerpo se mide cada 2 semanas.'],
  rv_sci_lvl_iniciante: ['Beginner: your body answers fast, so strength and endurance are tested every 4 weeks.', 'Iniciante: o corpo responde rápido, então força e resistência são testadas a cada 4 semanas.', 'Principiante: el cuerpo responde rápido, así que fuerza y resistencia se prueban cada 4 semanas.'],
  rv_sci_lvl_intermediario: ['Intermediate: progress is slower, so strength tests are every 6 weeks.', 'Intermediário: a evolução é mais lenta, então os testes de força ficam a cada 6 semanas.', 'Intermedio: el progreso es más lento, así que las pruebas de fuerza son cada 6 semanas.'],
  rv_sci_lvl_avancado: ['Advanced: after years of training progress is slow; testing before 8 weeks would only show the margin of error.', 'Avançado: quem treina há anos evolui devagar; testar antes de 8 semanas mostraria só a margem de erro.', 'Avanzado: tras años de entrenamiento el progreso es lento; medir antes de 8 semanas solo mostraría el margen de error.'],
  rv_sci_goal: ['What matters most for your goal is tested at these intervals; the rest a little less often.', 'O que mais importa para o seu objetivo segue esses intervalos; o resto é testado um pouco menos.', 'Lo que más importa para tu objetivo sigue estos intervalos; lo demás se prueba un poco menos.'],
  rv_sci_light: ['Whenever possible the re-assessment falls in your plan\'s light week: rested, the result is more honest.', 'Sempre que der, a reavaliação cai na semana leve do plano: descansado, o resultado é mais honesto.', 'Siempre que se puede, la reevaluación cae en la semana ligera del plan: descansado, el resultado es más honesto.'],
  rv_sci_refs: ['References: ACSM position stand on progression in resistance training (2009); ACE on re-assessing every 4–12 weeks; Helms, Aragon & Fitschen (2014) on the pace of weight loss.', 'Referências: posicionamento do ACSM sobre progressão no treino de força (2009); ACE sobre reavaliar a cada 4–12 semanas; Helms, Aragon e Fitschen (2014) sobre o ritmo de perda de peso.', 'Referencias: posicionamiento del ACSM sobre progresión en el entrenamiento de fuerza (2009); ACE sobre reevaluar cada 4–12 semanas; Helms, Aragon y Fitschen (2014) sobre el ritmo de pérdida de peso.'],
  rv_flow_h: ['Your re-assessment', 'Sua reavaliação', 'Tu reevaluación'],
  rv_flow_intro: ['Only the tests that are due, done like last time, so the comparison is fair. At the end you see before × now and what was expected for your level.', 'Só os testes que estão na hora, feitos como da última vez, para a comparação ser justa. No final você vê o antes × agora e o que era esperado para o seu nível.', 'Solo las pruebas que tocan, hechas como la última vez, para que la comparación sea justa. Al final ves el antes × ahora y lo esperado para tu nivel.'],
  rv_what: ['What will be tested', 'O que vai ser testado', 'Qué se va a probar'],
  rv_health_q: ['Since the last assessment, has anything changed in your health (a diagnosis, a medicine, a new pain)?', 'Desde a última avaliação, mudou algo na sua saúde (um diagnóstico, um remédio, uma dor nova)?', 'Desde la última evaluación, ¿cambió algo en tu salud (un diagnóstico, un medicamento, un dolor nuevo)?'],
  rv_same: ['For a fair comparison: same time of day, same machine and same way as last time, and not right after a hard workout.', 'Para comparar direito: mesmo horário, mesmo aparelho e do mesmo jeito da última vez, e não logo depois de um treino pesado.', 'Para comparar bien: misma hora, misma máquina y de la misma forma que la última vez, y no justo después de un entreno fuerte.'],
  rv_need_comp: ['Pick at least one test.', 'Escolha pelo menos um teste.', 'Elige al menos una prueba.'],
  rv_need_health: ['Answer the health question.', 'Responda a pergunta de saúde.', 'Responde la pregunta de salud.'],
  rv_prev: ['Last time: {x}', 'Última vez: {x}', 'La última vez: {x}'],
  rv_prev_lift: ['Last time: {kg} kg × {r} ({s} left)', 'Última vez: {kg} kg × {r} (sobraram {s})', 'La última vez: {kg} kg × {r} (quedaban {s})'],
  rv_result_h: ['Your progress', 'Sua evolução', 'Tu evolución'],
  rv_comp_h: ['Before × now', 'Antes × agora', 'Antes × ahora'],
  rv_comp_note: ['Approximate ranges for your level and the time since the last test. Small differences can be just the day (sleep, food, time of day).', 'Faixas aproximadas para o seu nível e o tempo desde o último teste. Diferenças pequenas podem ser só o dia (sono, alimentação, horário).', 'Rangos aproximados para tu nivel y el tiempo desde la última prueba. Diferencias pequeñas pueden ser solo el día (sueño, comida, horario).'],
  rv_from_logs: ['in your workouts (estimated max)', 'nos seus treinos (máximo estimado)', 'en tus entrenos (máximo estimado)'],
  rv_e1: ['estimated max', 'máximo estimado', 'máximo estimado'], rv_estimate: ['estimate', 'estimativa', 'estimación'],
  rv_exp: ['expected in {w}: {a} to {b}', 'esperado em {w}: {a} a {b}', 'esperado en {w}: {a} a {b}'],
  rv_wk: ['{n} weeks', '{n} semanas', '{n} semanas'], rv_wk1: ['1 week', '1 semana', '1 semana'],
  rv_exp_loss: ['ideal: lose 0.5% to 1% a week', 'ideal: perder de 0,5% a 1% por semana', 'ideal: perder del 0,5% al 1% por semana'],
  rv_exp_gain: ['ideal for your level: gain {a}% to {b}% a month', 'ideal para o seu nível: ganhar de {a}% a {b}% por mês', 'ideal para tu nivel: ganar del {a}% al {b}% al mes'],
  rv_v_above: ['Above expected', 'Acima do esperado', 'Por encima de lo esperado'], rv_v_in: ['As expected', 'Dentro do esperado', 'Dentro de lo esperado'],
  rv_v_below: ['Below expected', 'Abaixo do esperado', 'Por debajo de lo esperado'], rv_v_stable: ['No clear change', 'Sem mudança clara', 'Sin cambio claro'],
  rv_v_worse: ['Worse', 'Piorou', 'Empeoró'], rv_v_fast: ['Too fast', 'Rápido demais', 'Demasiado rápido'],
  rv_v_good: ['Good sign', 'Bom sinal', 'Buena señal'], rv_v_watch: ['Keep an eye on it', 'Fique de olho', 'Vigílalo'],
  rv_sum_good: ['Your plan is working: {a} of {b} results as expected or better.', 'Seu plano está funcionando: {a} de {b} resultados dentro ou acima do esperado.', 'Tu plan está funcionando: {a} de {b} resultados dentro o por encima de lo esperado.'],
  rv_sum_mixed: ['{a} of {b} results as expected or better.', '{a} de {b} resultados dentro ou acima do esperado.', '{a} de {b} resultados dentro o por encima de lo esperado.'],
  rv_sum_tips: ['Where it moved less: check your sleep (7–9 h), protein, and whether your sets get as close to the limit as the plan asks (RIR). If it repeats next time, adjust the plan.', 'Onde mudou menos: confira o sono (7 a 9 h), a proteína e se as séries chegam perto do limite que o plano pede (RIR). Se repetir na próxima reavaliação, ajuste o plano.', 'Donde cambió menos: revisa el sueño (7 a 9 h), la proteína y si tus series llegan tan cerca del límite como pide el plan (RIR). Si se repite en la próxima, ajusta el plan.'],
  rv_sum_fast_loss: ['You are losing weight faster than 1% a week: eat a bit more to keep your muscle.', 'Você está perdendo peso mais rápido que 1% por semana: coma um pouco mais para manter o músculo.', 'Estás perdiendo peso más rápido que el 1% semanal: come un poco más para mantener el músculo.'],
  rv_sum_fast_gain: ['Your weight is rising faster than muscle can grow: part of it may be fat; trim your food a little.', 'O peso está subindo mais rápido do que o músculo consegue crescer: parte pode ser gordura; reduza um pouco a comida.', 'Tu peso sube más rápido de lo que el músculo puede crecer: parte puede ser grasa; reduce un poco la comida.'],
  rv_sum_none: ['First time for these tests: next time you will see the comparison.', 'Primeira vez nesses testes: na próxima você vê a comparação.', 'Primera vez con estas pruebas: la próxima verás la comparación.'],
  bc_arm: ['Arm (cm)', 'Braço (cm)', 'Brazo (cm)'], bc_thigh: ['Thigh (cm)', 'Coxa (cm)', 'Muslo (cm)'],
  bc_how_more: ['Arm: relaxed, halfway between shoulder and elbow. Thigh: standing, halfway between hip and knee. Always the same side.', 'Braço: relaxado, no meio entre o ombro e o cotovelo. Coxa: em pé, no meio entre o quadril e o joelho. Sempre do mesmo lado.', 'Brazo: relajado, a mitad entre hombro y codo. Muslo: de pie, a mitad entre cadera y rodilla. Siempre del mismo lado.'],
  rv_vo2: ['VO2max', 'VO2máx', 'VO2máx'], rv_less_better: ['the lower, the better', 'quanto menos, melhor', 'cuanto menos, mejor'],
  rv_sum_lean: ['Your estimated lean mass dropped: keep protein high and keep lifting heavy, so the weight you lose is fat.', 'A massa magra estimada caiu: mantenha a proteína alta e o treino de força pesado, para o peso que sai ser gordura.', 'Tu masa magra estimada bajó: mantén la proteína alta y el entrenamiento de fuerza pesado, para que el peso que pierdes sea grasa.'],
  rv_sum_gain_loss: ['Your weight went up: check your food; if your waist went down, part of it may be muscle.', 'O peso subiu: confira a alimentação; se a cintura diminuiu, parte pode ser músculo.', 'Tu peso subió: revisa la comida; si la cintura bajó, parte puede ser músculo.'],
  rv_sum_eat_more: ['To build muscle your weight needs to rise slowly: eat a little more, with protein at every meal.', 'Para ganhar músculo o peso precisa subir devagar: coma um pouco mais, com proteína em todas as refeições.', 'Para ganar músculo tu peso tiene que subir despacio: come un poco más, con proteína en cada comida.'],
  rv_fat: ['Body fat', 'Gordura corporal', 'Grasa corporal'], rv_lean: ['Lean mass', 'Massa magra', 'Masa magra'], rv_weight: ['Weight', 'Peso', 'Peso'],
});
const nomeComp = k => t('rv_c_' + k);
const descComp = (k, onde, leve) => t(k === 'forca' ? (onde === 'casa' ? 'rv_d_forca_c' : 'rv_d_forca_g') : k === 'folego' && leve ? 'rv_d_folego_leve' : 'rv_d_' + k);
const dataCurta = ts => fmtDia(new Date(ts));
const semanasTxt = n => (n === 1 ? t('rv_wk1') : t('rv_wk', { n }));

/* ---------- history: the latest of each result, and when each quality was last tested ---------- */
/* the cardio tests replace one another (a newer step test supersedes an older walk); the rest by key, lifts by exercise */
function avalCombinada(l) {
  const r = {}, ult = l[l.length - 1];
  let parq = null;
  for (const av of l) {
    const x = (av && av.r) || {};
    if (x.degrau || x.vo2 || x.caminhada) { delete r.degrau; delete r.vo2; delete r.caminhada; }
    for (const k of ['repouso', 'degrau', 'vo2', 'caminhada', 'flexoes', 'agach', 'prancha', 'barra', 'alcance', 'costas', 'agachObs']) if (x[k] != null) r[k] = x[k];
    if ((x.forca || []).length) { const m = new Map((r.forca || []).map(f => [f.id, f])); x.forca.forEach(f => m.set(f.id, f)); r.forca = [...m.values()]; }
    if (av.tipo !== 'reav' || av.saude) parq = { parqAlerta: !!x.parqAlerta, liberado: !!x.liberado };
    if (x.semNorma != null) r.semNorma = x.semNorma;
  }
  Object.assign(r, parq || { parqAlerta: false, liberado: false });
  r.atributos = atributosDe(r);
  return { ...ult, r };
}
function ultimoTeste(p, k) {
  if (k === 'corpo') {
    /* with a tape measure the body test is the tape; without one, the scale */
    const ms = p.medidas || [], fita = ms.some(x => x.cintura), m = ms.filter(x => (fita ? x.cintura : x.peso));
    return m.length ? m[m.length - 1].data : null;
  }
  const l = p.avaliacoes || [];
  for (let i = l.length - 1; i >= 0; i--) { const av = l[i] || {}; if ((!av.comps || av.comps.includes(k)) && REAV_TEM[k](av.r || {}, av)) return av.data; }
  return null;
}
function agendaReav(pid) {
  const p = perfil(pid), l = (p && p.avaliacoes) || [];
  if (!p || !l.length) return null;
  const nivel = REAV_SEM.forca[p.nivel] ? p.nivel : 'iniciante', obj = REAV_FOCO[p.objetivo] ? p.objetivo : 'saude', foco = REAV_FOCO[obj];
  const r = (ultimaAval(p) || {}).r || {}, leve = !!(r.parqAlerta && !r.liberado);
  const pr = progresso(pid), agora = Date.now();
  const leveSem = !!(pr && !pr.completo && pr.sem && pr.sem.deload), fimCap = !!(pr && pr.completo);
  const comps = REAV_COMPS.map(k => {
    let sem = REAV_SEM[k][nivel];
    if (k === 'corpo' && obj === 'emagrecer') sem = 2;
    else if (!foco.includes(k)) sem = Math.round(sem * 1.5);
    const ult = ultimoTeste(p, k), prox = (ult || l[0].data) + sem * SEMANA_MS;
    /* effort tests wait for the doctor when the health screening asked for it */
    const bloq = leve && (k === 'forca' || k === 'resist');
    let devido = !bloq && agora >= prox, cedo = false;
    /* near the light week or the end of the chapter: test then, rested */
    if (!bloq && !devido && (leveSem || fimCap) && prox - agora < 10 * 864e5) { devido = true; cedo = true; }
    return { k, sem, ult, prox, devido, cedo, bloq, foco: foco.includes(k) };
  });
  return { comps, devidos: comps.filter(c => c.devido), leveSem, fimCap, nivel, obj, leve };
}
const reavAdiado = pid => ((LS.get('ij_reav_depois') || {})[pid] || 0) > Date.now();
function adiarReav(pid) { const m = LS.get('ij_reav_depois') || {}; m[pid] = Date.now() + 3 * 864e5; LS.set('ij_reav_depois', m); }
const minTotal = (lista, leve) => lista.reduce((n, c) => n + minComp(c.k || c, leve), 0);

/* ---------- on Today and on the Plan ---------- */
function reavLembreteHTML(pid) {
  if (pid !== S.me || S.live) return '';
  const ag = agendaReav(pid);
  if (!ag || !ag.devidos.length || reavAdiado(pid)) return '';
  const velho = ag.devidos.filter(c => c.ult).sort((a, b) => a.ult - b.ult)[0];
  const porque = ag.leveSem ? t('rv_why_light') : ag.fimCap ? t('rv_why_chapter') : velho ? t('rv_why_weeks', { w: semanasTxt(Math.max(1, Math.round((Date.now() - velho.ult) / SEMANA_MS))), x: nomeComp(velho.k).toLowerCase() }) : t('rv_why_first');
  return `<div class="card pad stack rv-card" id="reavCard">
    <div class="sg-top"><span class="sg-ic" aria-hidden="true">${I.crono}</span><p class="eyebrow">${t('rv_eyebrow')}</p></div>
    <h2 class="h3">${t('rv_title')}</h2>
    <p class="small">${esc(porque)}</p>
    <div class="casa-tags">${ag.devidos.map(c => `<span class="pill acc">${esc(nomeComp(c.k))}</span>`).join('')}<span class="pill num">≈ ${minTotal(ag.devidos, ag.leve)} min</span></div>
    <div class="grid2"><button class="btn" data-a="reavAbrir">${t('rv_do')}</button><button class="btn ghost" data-a="reavDepois">${t('rv_later')}</button></div>
  </div>`;
}
/* the calendar, with why: on the Plan, and after a re-assessment (then without the button) */
function agendaHTML(pid, depois) {
  const ag = agendaReav(pid);
  if (!ag) return '';
  const linhas = ag.comps.map(c => `<div class="rv-row"><span class="rv-n"><b>${esc(nomeComp(c.k))}${c.foco ? ` <span class="pill acc">${t('rv_focus')}</span>` : ''}</b><span class="xs muted">${esc(t('rv_every', { n: c.sem }))} · ${esc(c.ult ? t('rv_last', { d: dataCurta(c.ult) }) : t('rv_never'))}</span></span><span class="rv-q num${c.devido ? ' due' : ''}">${esc(c.bloq ? t('rv_blocked') : c.devido ? t('rv_due_now') : t('rv_next_on', { d: dataCurta(c.prox) }))}</span></div>`).join('');
  return `<div class="stack rv-agenda"><p class="eyebrow">${t(depois ? 'rv_next' : 'rv_schedule')}</p><div class="rv-list">${linhas}</div>
    ${ag.devidos.length && !depois ? `<button class="btn block" data-a="reavAbrir">${t('rv_do_n', { n: minTotal(ag.devidos, ag.leve) })}</button>` : ''}
    <details class="bc-how"><summary>${t('rv_why_h')}</summary><div class="stack" style="gap:8px;margin-top:8px">${['rv_sci_1', 'rv_sci_2', 'rv_sci_3', 'rv_sci_4', 'rv_sci_5', 'rv_sci_lvl_' + ag.nivel, 'rv_sci_goal', 'rv_sci_light'].map(k => `<p class="small">${t(k)}</p>`).join('')}<p class="xs muted">${t('rv_sci_refs')}</p></div></details>
  </div>`;
}

/* ---------- the short re-assessment: what is due, done like last time ---------- */
function abrirReaval(lista) {
  const p = perfil(), l = (p && p.avaliacoes) || [];
  if (!l.length) { abrirAval(); return; }
  const ag = agendaReav(S.me), comb = ultimaAval(p), r = comb.r || {};
  abrirAval();
  const a = S.aval;
  a.reav = true;
  a.leve = a.leveAnt = !!(r.parqAlerta && !r.liberado);
  a.liberado = a.liberadoAnt = !!r.liberado;
  a.parqAnt = !!r.parqAlerta;
  a.comps = (lista || (ag && ag.devidos.length ? ag.devidos.map(c => c.k) : REAV_COMPS)).filter(k => !(a.leve && (k === 'forca' || k === 'resist')));
  a.saudeMudou = null;
  a.onde = comb.onde || null;
  a.cardioTeste = r.degrau ? 'degrau' : r.vo2 || r.caminhada ? 'rockport' : null;
  /* measured again today: last time's numbers become the grey hints */
  for (const k of ['peso', 'cintura', 'pescoco', 'quadril', 'braco', 'coxa']) a.medidas[k] = '';
  /* the same lifts as last time, so the numbers compare */
  for (const f of a.forca) { const ant = (r.forca || []).find(x => f.ids.includes(x.id)); if (ant) f.id = ant.id; }
  render();
}
function reavInicioHTML(a) {
  const ag = agendaReav(S.me), info = k => (ag && ag.comps.find(c => c.k === k)) || {};
  const opc = k => {
    const c = info(k), bloq = a.leve && (k === 'forca' || k === 'resist');
    const quando = bloq ? t('rv_blocked') : c.prox ? (c.devido ? t('rv_due_now') : t('rv_next_on', { d: dataCurta(c.prox) })) : '';
    return `<button class="opt" data-a="avComp" data-v="${k}" aria-pressed="${a.comps.includes(k)}"${bloq ? ' disabled' : ''}><b>${esc(nomeComp(k))} · ≈ ${minComp(k, a.leve)} min</b><span>${esc(descComp(k, a.onde, a.leve))}${quando ? ' · ' + esc(quando) : ''}</span></button>`;
  };
  const min = minTotal(a.comps, a.leve);
  return `<div class="hero"><p class="eyebrow">${t('rv_eyebrow')}</p><h1 class="h-display h2">${t('rv_flow_h')}</h1><p class="muted">${t('rv_flow_intro')}</p></div>
    <div class="row between"><p class="eyebrow" style="margin:0">${t('rv_what')}</p>${min ? `<span class="pill num">≈ ${min} min</span>` : ''}</div>
    <div class="stack" style="gap:8px">${REAV_COMPS.map(opc).join('')}</div>
    <p class="eyebrow">${t('av_where')}</p><div class="seg">${[['academia', t('dif_gym')], ['casa', t('dif_home')]].map(([v, n]) => `<button data-a="avSet" data-k="onde" data-v="${v}" aria-pressed="${a.onde === v}">${esc(n)}</button>`).join('')}</div>
    <div class="av-q"><p class="small">${t('rv_health_q')}</p><div class="seg"><button data-a="avSaude" data-v="0" aria-pressed="${a.saudeMudou === false}">${t('av_no')}</button><button data-a="avSaude" data-v="1" aria-pressed="${a.saudeMudou === true}">${t('av_yes')}</button></div></div>
    <p class="tip">${t('rv_same')}</p>`;
}
/* "last time" under each test of a re-assessment, to aim at */
function antesTxt(a, k) {
  if (!a || !a.reav) return '';
  const r = (ultimaAval(perfil()) || {}).r || {};
  const v = { flexoes: r.flexoes && r.flexoes.n, agach: r.agach && r.agach.n, prancha: r.prancha && r.prancha.s + ' s', barra: r.barra && r.barra.n, fcRepouso: r.repouso && r.repouso.bpm + ' bpm', degrauFc: r.degrau && r.degrau.bpm + ' bpm',
    rpMin: r.vo2 ? fmtKg(Math.round(r.vo2.min * 10) / 10) + ' min' : r.caminhada ? fmtKg(Math.round(r.caminhada.min * 10) / 10) + ' min' : null,
    alcance: r.alcance && (r.alcance.cm > 0 ? '+' : '') + fmtKg(r.alcance.cm) + ' cm' }[k];
  return v != null && v !== '' ? `<p class="xs muted num">${esc(t('rv_prev', { x: v }))}</p>` : '';
}
function antesLift(a, f) {
  if (!a || !a.reav) return '';
  const x = (((ultimaAval(perfil()) || {}).r || {}).forca || []).find(y => y.id === f.id);
  return x ? `<p class="xs muted num">${esc(t('rv_prev_lift', { kg: fmtKg(x.kg), r: x.reps, s: x.rir }))}</p>` : '';
}

/* ---------- before × now ---------- */
/* expected improvement per week, by level: strength % (estimated max), reps %, plank %, VO2 %, step-test and resting bpm */
const REAV_TAXA = {
  e1: { iniciante: [1, 3], intermediario: [0.3, 1.2], avancado: [0.1, 0.5] },
  reps: { iniciante: [2, 6], intermediario: [1, 3], avancado: [0.3, 1.5] },
  prancha: { iniciante: [3, 8], intermediario: [1, 4], avancado: [0.5, 2] },
  vo2: { iniciante: [0.5, 1.5], intermediario: [0.3, 1], avancado: [0.1, 0.5] },
  degrau: { iniciante: [0.5, 2], intermediario: [0.3, 1], avancado: [0, 0.5] },
  repouso: { iniciante: [0.2, 0.8], intermediario: [0.1, 0.5], avancado: [0, 0.3] },
};
/* healthy muscle gain per month, % of body weight (a common coaching guide) */
const GANHO_MES = { iniciante: [1, 1.5], intermediario: [0.5, 1], avancado: [0.25, 0.5] };
const VERED = { acima: ['ok', 'rv_v_above'], dentro: ['ok', 'rv_v_in'], abaixo: ['warn', 'rv_v_below'], estavel: ['', 'rv_v_stable'], piorou: ['warn', 'rv_v_worse'], rapido: ['warn', 'rv_v_fast'], bom: ['ok', 'rv_v_good'], atencao: ['warn', 'rv_v_watch'] };
/* g: the change, positive = better, in the same unit as the range and the margin of error.
   Inside the expected range it is "as expected"; inside the margin of error, "no clear change"
   (or "as expected" when even the top of the range is within the margin: nothing much was expected) */
function veredito(g, lo, hi, erro) {
  if (g >= hi && g > erro) return 'acima';
  if (g >= lo * 0.7 && g > 0) return 'dentro';
  if (Math.abs(g) <= erro) return hi <= erro ? 'dentro' : 'estavel';
  return g < 0 ? 'piorou' : 'abaixo';
}
const sinal = (v, casas = 0) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmtKg(Math.abs(Math.round(v * 10 ** casas) / 10 ** casas));
/* the expected change for the weeks between tests (rates stop adding up after 12 weeks), in the test's own unit */
const faixaSem = (faixa, s, base) => { const k = Math.min(s, 12), f = base != null ? base / 100 : 1; return [faixa[0] * k * f, faixa[1] * k * f]; };
const espTxt = (lohi, s, un, casas, menor) => { const f = v => (menor ? '−' : '+') + fmtKg(Math.round(v * 10 ** casas) / 10 ** casas) + un; return t('rv_exp', { w: semanasTxt(Math.max(1, Math.round(s))), a: f(lohi[0]), b: f(lohi[1]) }); };
/* the strongest lift of each movement in the workouts, start of the period × end, from the sets logged */
function forcaTreinos(pid, desde, ate) {
  const ss = sessoesDe(pid).filter(s => !s.avaliacao && s.inicio >= desde - 14 * 864e5 && s.inicio <= ate).sort((a, b) => a.inicio - b.inicio);
  const porEx = {};
  for (const s of ss) for (const x of s.exs || []) {
    const ex = exInfo(x.id, x.nome);
    if (x.pulado || !usaCarga(ex)) continue;
    const m = melhorDe(x);
    if (m.top > 0) (porEx[x.id] = porEx[x.id] || []).push({ ts: s.inicio, e1: m.top });
  }
  const out = [];
  for (const reg of ['agachar', 'empurrar', 'puxar', 'quadril']) {
    const c = Object.entries(porEx).filter(([id, pts]) => REGIAO[exInfo(id).grupo] === reg && pts.length >= 3 && pts[pts.length - 1].ts - pts[0].ts >= 21 * 864e5).sort((a, b) => b[1].length - a[1].length)[0];
    if (!c) continue;
    const [id, pts] = c, t0 = pts[0].ts, t1 = pts[pts.length - 1].ts;
    const antes = Math.max(...pts.filter(q => q.ts <= t0 + 14 * 864e5).map(q => q.e1)), depois = Math.max(...pts.filter(q => q.ts >= t1 - 14 * 864e5).map(q => q.e1));
    out.push({ id, antes, depois, semanas: (t1 - t0) / SEMANA_MS });
  }
  return out;
}
/* novo: the assessment just done; hist: the ones before it; medidas: the body measurements over time */
function comparacaoReav(p, novo, hist, medidas) {
  const nivel = REAV_SEM.forca[p.nivel] ? p.nivel : 'iniciante', obj = p.objetivo || 'saude', r = (novo && novo.r) || {}, agora = (novo && novo.data) || Date.now(), itens = [];
  const antes = f => { for (let i = hist.length - 1; i >= 0; i--) { const v = f((hist[i] && hist[i].r) || {}); if (v != null) return { v, data: hist[i].data }; } return null; };
  const sem = d => Math.max(1, (agora - d) / SEMANA_MS);
  /* strength: the same lifts as last time, as the estimated max (±4% is the estimate itself) */
  for (const f of r.forca || []) {
    const a = antes(x => { const y = (x.forca || []).find(z => z.id === f.id); return y ? y.e1 : null; });
    if (!a || !(a.v > 0)) continue;
    const s = sem(a.data), fx = faixaSem(REAV_TAXA.e1[nivel], s, a.v), d = f.e1 - a.v;
    itens.push({ k: 'e1', nome: exInfo(f.id).nome, sub: t('rv_e1'), antes: fmtKg(Math.round(a.v)) + ' kg', depois: fmtKg(Math.round(f.e1)) + ' kg', delta: sinal(d) + ' kg', v: veredito(d, fx[0], fx[1], a.v * 0.04), esp: espTxt(fx, s, ' kg', 0) });
  }
  /* counts and the plank: the margin is one rep, or 10% of the plank */
  const reps = (k, nome, campo, taxa, un) => {
    if (!r[k]) return;
    const a = antes(x => (x[k] ? x[k][campo] : null));
    if (!a || !(a.v > 0)) return;
    const s = sem(a.data), fx = faixaSem(taxa, s, a.v), d = r[k][campo] - a.v, erro = k === 'prancha' ? Math.max(3, a.v * 0.1) : Math.max(1, a.v * 0.05);
    itens.push({ k, nome, antes: a.v + un, depois: r[k][campo] + un, delta: sinal(d) + un, v: veredito(d, fx[0], fx[1], erro), esp: espTxt(fx, s, un, 0) });
  };
  reps('flexoes', t('av_pushups'), 'n', REAV_TAXA.reps[nivel], '');
  reps('agach', t('av_squats'), 'n', REAV_TAXA.reps[nivel], '');
  reps('prancha', t('av_plank'), 's', REAV_TAXA.prancha[nivel], ' s');
  if (r.barra) { const a = antes(x => (x.barra ? x.barra.n : null)); if (a) itens.push({ k: 'barra', nome: t('av_pullups'), antes: String(a.v), depois: String(r.barra.n), delta: sinal(r.barra.n - a.v), v: r.barra.n > a.v ? 'bom' : r.barra.n < a.v ? 'piorou' : 'estavel' }); }
  /* heart: fewer beats is better; ±3 bpm is the day itself */
  const bpm = (k, nome, taxa) => {
    if (!r[k]) return;
    const a = antes(x => (x[k] ? x[k].bpm : null));
    if (!a) return;
    const s = sem(a.data), fx = faixaSem(taxa, s), g = a.v - r[k].bpm;
    itens.push({ k, nome, sub: t('rv_less_better'), antes: a.v + ' bpm', depois: r[k].bpm + ' bpm', delta: sinal(-g) + ' bpm', v: veredito(g, fx[0], fx[1], 3), esp: espTxt(fx, s, ' bpm', 0, true) });
  };
  bpm('repouso', t('av_rest_h'), REAV_TAXA.repouso[nivel]);
  bpm('degrau', t('av_step_test'), REAV_TAXA.degrau[nivel]);
  if (r.vo2) {
    const a = antes(x => (x.vo2 ? x.vo2.v : null));
    if (a) { const s = sem(a.data), fx = faixaSem(REAV_TAXA.vo2[nivel], s, a.v), d = r.vo2.v - a.v; itens.push({ k: 'vo2', nome: t('rv_vo2'), sub: t('av_rockport'), antes: fmtKg(Math.round(a.v * 10) / 10), depois: fmtKg(Math.round(r.vo2.v * 10) / 10), delta: sinal(d, 1), v: veredito(d, fx[0], fx[1], a.v * 0.03), esp: espTxt(fx, s, '', 1) }); }
  } else if (r.caminhada) {
    const a = antes(x => (x.caminhada ? x.caminhada.min : x.vo2 ? x.vo2.min : null));
    if (a) { const d = r.caminhada.min - a.v; itens.push({ k: 'caminhada', nome: t('av_rockport'), sub: t('rv_less_better'), antes: fmtKg(Math.round(a.v * 10) / 10) + ' min', depois: fmtKg(Math.round(r.caminhada.min * 10) / 10) + ' min', delta: sinal(d, 1) + ' min', v: d < -0.2 ? 'bom' : d > 0.2 ? 'piorou' : 'estavel' }); }
  }
  if (r.alcance) { const a = antes(x => (x.alcance ? x.alcance.cm : null)); if (a) { const d = r.alcance.cm - a.v; itens.push({ k: 'alcance', nome: t('av_reach'), antes: sinal(a.v) + ' cm', depois: sinal(r.alcance.cm) + ' cm', delta: sinal(d) + ' cm', v: d >= 2 ? 'bom' : d <= -2 ? 'piorou' : 'estavel' }); } }
  /* the body: what was measured today × the same measure about two weeks ago or more (the day-to-day swing hides less) */
  const mi = (medidas || []).filter(m => m.data <= agora + 6e4), m1 = mi[mi.length - 1];
  if (m1 && Math.abs(m1.data - agora) < 864e5) {
    const prev = k => { const c = mi.filter(m => m !== m1 && m[k] && m.data < m1.data - 864e5); return c.filter(m => m.data <= m1.data - 13 * 864e5).pop() || c.pop() || null; };
    const mp = m1.peso && prev('peso');
    if (mp) {
      const d = m1.peso - mp.peso, s = sem(mp.data), porSem = (d / mp.peso) * 100 / s, ruido = Math.abs(d) <= 0.5;
      let v = '', esp = '';
      if (obj === 'emagrecer') { esp = t('rv_exp_loss'); v = d >= 0.5 ? 'atencao' : -porSem > 1.2 ? 'rapido' : ruido ? 'estavel' : -porSem >= 0.5 ? 'dentro' : 'abaixo'; }
      else if (obj === 'hipertrofia') { const fx = GANHO_MES[nivel], mes = porSem * 4.35; esp = t('rv_exp_gain', { a: fmtKg(fx[0]), b: fmtKg(fx[1]) }); v = d <= -0.5 ? 'piorou' : mes > fx[1] * 1.5 ? 'rapido' : ruido ? 'estavel' : mes >= fx[0] * 0.7 ? 'dentro' : 'abaixo'; }
      itens.push({ k: 'peso', nome: t('rv_weight'), antes: fmtKg(mp.peso) + ' kg', depois: fmtKg(m1.peso) + ' kg', delta: sinal(d, 1) + ' kg', v, esp, peso: true });
    }
    /* tape measures: ±1 cm is the tape itself (half for the arm) */
    const cm = (k, rot, erro, bom) => { const m0 = m1[k] && prev(k); if (!m0) return; const d = m1[k] - m0[k]; itens.push({ k, nome: t(rot).replace(/ \(cm\)$/, ''), antes: fmtKg(m0[k]) + ' cm', depois: fmtKg(m1[k]) + ' cm', delta: sinal(d, 1) + ' cm', v: bom(d, erro, sem(m0.data)) }); };
    const cresce = (d, e) => (d >= e ? 'bom' : d <= -e ? 'piorou' : 'estavel');
    cm('cintura', 'bc_waist', 1, (d, e, s) => (obj === 'emagrecer' ? (d <= -e ? 'bom' : d >= e ? 'piorou' : 'estavel') : obj === 'saude' ? (d <= -e ? 'bom' : d >= e ? 'atencao' : 'estavel') : d >= 1.5 * Math.max(1, s / 4) ? 'atencao' : ''));
    cm('braco', 'bc_arm', 0.5, (d, e) => (obj === 'hipertrofia' || obj === 'forca' ? cresce(d, e) : ''));
    cm('coxa', 'bc_thigh', 1, (d, e) => (obj === 'hipertrofia' || obj === 'forca' ? cresce(d, e) : ''));
    /* body fat from the tape: only the same formula on both days compares */
    const mc = m1.cintura && prev('cintura');
    if (mc) {
      const c0 = composicao({ ...p, ...mc }), c1 = composicao({ ...p, ...m1 });
      if (c0.gordura != null && c1.gordura != null && c0.metodo !== 'imc' && c0.metodo === c1.metodo) {
        const d = c1.gordura - c0.gordura;
        itens.push({ k: 'gordura', nome: t('rv_fat'), sub: t('rv_estimate'), antes: fmtKg(r1(c0.gordura)) + '%', depois: fmtKg(r1(c1.gordura)) + '%', delta: t('bc_points', { n: sinal(d, 1) }), v: obj === 'emagrecer' ? (d <= -1 ? 'bom' : d >= 1 ? 'piorou' : 'estavel') : obj === 'hipertrofia' && d >= 1.5 ? 'atencao' : '' });
        if (c0.magraKg && c1.magraKg) { const dm = c1.magraKg - c0.magraKg; itens.push({ k: 'magra', nome: t('rv_lean'), sub: t('rv_estimate'), antes: fmtKg(r1(c0.magraKg)) + ' kg', depois: fmtKg(r1(c1.magraKg)) + ' kg', delta: sinal(dm, 1) + ' kg', v: obj === 'emagrecer' ? (dm <= -1.5 ? 'atencao' : '') : dm >= 0.5 ? 'bom' : dm <= -1 ? 'atencao' : '' }); }
      }
    }
  }
  /* strength in the workouts themselves, for the movements not tested here */
  if (!novo || !novo.comps || novo.comps.includes('forca')) {
    const ultF = antes(x => ((x.forca || []).length ? 1 : null));
    for (const f of forcaTreinos(p._pid || S.me, ultF ? ultF.data : agora - 8 * SEMANA_MS, agora)) {
      if ((r.forca || []).some(x => x.id === f.id)) continue;
      const fx = faixaSem(REAV_TAXA.e1[nivel], f.semanas, f.antes), d = f.depois - f.antes;
      itens.push({ k: 'treino', nome: exInfo(f.id).nome, sub: t('rv_from_logs'), antes: fmtKg(Math.round(f.antes)) + ' kg', depois: fmtKg(Math.round(f.depois)) + ' kg', delta: sinal(d) + ' kg', v: veredito(d, fx[0], fx[1], f.antes * 0.04), esp: espTxt(fx, f.semanas, ' kg', 0) });
    }
  }
  return itens;
}
/* the verdict in one line, then the trainer's advice, apart */
function resumoComparacao(itens, obj) {
  const julg = itens.filter(i => i.v);
  if (!julg.length) return { linha: t('rv_sum_none'), dicas: [] };
  const ok = julg.filter(i => ['acima', 'dentro', 'bom'].includes(i.v)).length, tem = (k, vs) => julg.some(i => i.k === k && vs.includes(i.v)), dicas = [];
  if (julg.some(i => ['abaixo', 'estavel', 'piorou'].includes(i.v) && !['peso', 'cintura', 'gordura', 'magra'].includes(i.k))) dicas.push(t('rv_sum_tips'));
  if (obj === 'emagrecer' && tem('peso', ['rapido'])) dicas.push(t('rv_sum_fast_loss'));
  if (obj === 'emagrecer' && tem('magra', ['atencao'])) dicas.push(t('rv_sum_lean'));
  if (obj === 'emagrecer' && tem('peso', ['atencao'])) dicas.push(t('rv_sum_gain_loss'));
  if (obj === 'hipertrofia' && (tem('peso', ['rapido']) || tem('cintura', ['atencao']) || tem('gordura', ['atencao']))) dicas.push(t('rv_sum_fast_gain'));
  if (obj === 'hipertrofia' && tem('peso', ['piorou', 'abaixo', 'estavel'])) dicas.push(t('rv_sum_eat_more'));
  return { linha: t(ok / julg.length >= 0.7 ? 'rv_sum_good' : 'rv_sum_mixed', { a: ok, b: julg.length }), dicas };
}
function comparacaoHTML(itens, obj) {
  const rs = resumoComparacao(itens, obj);
  return `<div class="card pad stack rv-comp"><h2 class="h3">${t('rv_comp_h')}</h2><p class="small"><b>${esc(rs.linha)}</b></p>${rs.dicas.map(d => `<p class="tip">${esc(d)}</p>`).join('')}
    ${itens.length ? `<div class="rv-cs">${itens.map(i => `<div class="rv-c"><div class="rv-c-n"><b>${esc(i.nome)}</b>${i.sub ? `<span class="xs muted">${esc(i.sub)}</span>` : ''}</div>
      <div class="rv-c-v num"><span class="muted">${esc(i.antes)}</span><span aria-hidden="true">→</span><b>${esc(i.depois)}</b>${i.delta ? `<span class="rv-d">${esc(i.delta)}</span>` : ''}</div>
      ${i.v || i.esp ? `<div class="rv-c-x">${i.v ? `<span class="pill ${VERED[i.v][0]}">${t(VERED[i.v][1])}</span>` : ''}${i.esp ? `<span class="xs muted num">${esc(i.esp)}</span>` : ''}</div>` : ''}</div>`).join('')}</div>
    <p class="xs muted">${t('rv_comp_note')}</p>` : ''}</div>`;
}

/* ---------- for the AI coach ---------- */
function ctxReavEn(p, pid) {
  const ag = agendaReav(pid);
  if (!ag) return '';
  const linhas = ['Re-assessment calendar (weeks between tests for this level and goal): ' + ag.comps.map(c => `${c.k} every ${c.sem} wk, last ${c.ult ? dayKey(c.ult) : 'never'}${c.bloq ? ' (waiting for medical clearance)' : c.devido ? ' (due now)' : ', next ' + dayKey(c.prox)}`).join('; ')];
  const l = p.avaliacoes || [];
  if (l.length >= 2) {
    const it = comparacaoReav({ ...p, _pid: pid }, l[l.length - 1], l.slice(0, -1), p.medidas || []);
    if (it.length) linhas.push(`Latest re-assessment (${dayKey(l[l.length - 1].data)}) vs before: ` + it.map(i => `${i.nome}${i.sub ? ' (' + i.sub + ')' : ''} ${i.antes} -> ${i.depois}${i.v ? ' [' + STR[VERED[i.v][1]][0].toLowerCase() + ']' : ''}`).join('; '));
  }
  return linhas.join('\n');
}
