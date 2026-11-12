/* ---------- built-in plan (no AI key needed) ----------
   Evidence-based defaults: a split that hits each muscle about twice a week, compounds first,
   priority muscles early and with an extra set, double progression rep ranges, effort by RIR
   rising week to week, a deload at the end, and cardio built on easy zone 2 with at most one
   interval session for people who already train. Same output shape as the AI plan. */
const SLOTS = {
  squat: ['hack', 'pendulo', 'agachamento', 'agachamento_smith', 'leg_press', 'leg_horizontal', 'goblet', 'bulgaro'],
  legpress: ['leg_press', 'leg_horizontal', 'bulgaro', 'hack', 'agachamento_smith', 'goblet', 'step_up', 'afundo'],
  quad_iso: ['extensora', 'bulgaro', 'step_up'],
  hinge: ['stiff', 'stiff_unilateral', 'terra', 'hiperextensao', 'hip_thrust'],
  ham_curl: ['cadeira_flexora', 'mesa_flexora', 'stiff', 'hiperextensao'],
  glute: ['hip_thrust', 'hip_thrust_maq', 'hip_thrust_smith', 'agach_sumo', 'ponte_gluteo'],
  glute_iso: ['abdutora', 'coice_polia', 'gluteo_maquina', 'abducao_elastico', 'coice_caneleira'],
  calves: ['pant_pe', 'pant_sentado', 'pant_leg', 'pant_smith', 'pant_unilateral'],
  hpush: ['supino_reto_halteres', 'supino_reto_barra', 'supino_maquina', 'supino_reto_smith', 'flexao'],
  ipush: ['supino_inclinado_halteres', 'supino_inclinado_smith', 'supino_inclinado_barra', 'supino_maquina', 'flexao'],
  chest_iso: ['crossover', 'voador', 'crucifixo_halteres'],
  vpull: ['puxada_frente', 'barra_fixa', 'barra_graviton', 'puxada_neutra', 'puxada_unilateral', 'pulldown_bracos'],
  hrow: ['remada_apoiada', 'remada_baixa', 'remada_maquina', 'serrote', 'remada_cavalinho', 'remada_curvada'],
  vpush: ['desenv_halteres', 'desenv_maquina', 'desenv_smith', 'desenv_barra'],
  lateral: ['elev_lateral_polia', 'elev_lateral', 'elev_lateral_maquina'],
  reardelt: ['crucifixo_inverso', 'face_pull', 'crucifixo_inverso_h'],
  biceps: ['rosca_inclinada', 'rosca_bayesian', 'rosca_polia', 'rosca_alternada', 'rosca_barra', 'rosca_martelo', 'rosca_scott'],
  triceps: ['triceps_overhead', 'triceps_frances', 'triceps_corda', 'triceps_barra_polia', 'triceps_testa', 'supino_fechado', 'mergulho'],
  abs: ['abd_polia', 'elev_pernas', 'prancha', 'pallof', 'abd_supra', 'elev_pernas_solo', 'prancha_lateral'],
};
/* strength is specific to the lift: for a strength goal the barbell versions come first */
const FORCA_PRIMEIRO = { squat: ['agachamento'], hpush: ['supino_reto_barra'], ipush: ['supino_inclinado_barra'], hinge: ['terra', 'stiff'], vpush: ['desenv_barra'], hrow: ['remada_curvada'], vpull: ['barra_fixa'] };
const SLOT_FOCO = { squat: 'pernas', legpress: 'pernas', quad_iso: 'pernas', hinge: 'pernas', ham_curl: 'pernas', glute: 'gluteos', glute_iso: 'gluteos', calves: 'pernas',
  hpush: 'peito', ipush: 'peito', chest_iso: 'peito', vpull: 'costas', hrow: 'costas', vpush: 'ombros', lateral: 'ombros', reardelt: 'ombros', biceps: 'bracos', triceps: 'bracos', abs: 'abdomen' };
const EVITAR = {
  joelho: ['agachamento', 'bulgaro', 'afundo', 'step_up', 'pendulo', 'hack', 'goblet'],
  lombar: ['terra', 'remada_curvada', 'agachamento', 'desenv_barra', 'remada_cavalinho', 'stiff', 'stiff_unilateral', 'hiperextensao'],
  ombro: ['desenv_barra', 'desenv_smith', 'desenv_halteres', 'desenv_maquina', 'mergulho', 'supino_reto_barra', 'supino_inclinado_barra', 'crucifixo_halteres'],
  quadril: ['agachamento', 'bulgaro', 'afundo', 'agach_sumo', 'terra', 'pendulo'],
  punho: ['rosca_barra', 'supino_reto_barra', 'flexao', 'triceps_testa', 'desenv_barra', 'supino_fechado'],
  cotovelo: ['triceps_testa', 'triceps_frances', 'supino_fechado', 'rosca_barra', 'mergulho'],
  pescoco: ['agachamento', 'desenv_barra', 'abd_supra', 'remada_curvada', 'terra'],
};
const DIAS_TPL = {
  fbA: ['squat', 'hpush', 'vpull', 'ham_curl', 'lateral', 'triceps', 'calves', 'abs'],
  fbB: ['hinge', 'ipush', 'hrow', 'legpress', 'biceps', 'reardelt', 'abs', 'calves'],
  fbC: ['legpress', 'vpush', 'vpull', 'glute', 'chest_iso', 'ham_curl', 'biceps', 'triceps'],
  upA: ['hpush', 'hrow', 'vpush', 'vpull', 'lateral', 'triceps', 'biceps', 'abs'],
  upB: ['ipush', 'vpull', 'hrow', 'chest_iso', 'lateral', 'biceps', 'triceps', 'reardelt'],
  loA: ['squat', 'hinge', 'legpress', 'ham_curl', 'calves', 'abs', 'quad_iso', 'glute_iso'],
  loB: ['glute', 'legpress', 'ham_curl', 'quad_iso', 'hinge', 'calves', 'glute_iso', 'abs'],
  push: ['hpush', 'ipush', 'vpush', 'lateral', 'chest_iso', 'triceps', 'abs'],
  pull: ['vpull', 'hrow', 'reardelt', 'biceps', 'vpull', 'hrow', 'biceps'],
  legs: ['squat', 'hinge', 'legpress', 'ham_curl', 'glute_iso', 'calves', 'quad_iso', 'abs'],
};
const SPLITS = { 2: ['fbA', 'fbB'], 3: ['fbA', 'fbB', 'fbC'], 4: ['upA', 'loA', 'upB', 'loB'], 5: ['upA', 'loA', 'push', 'pull', 'legs'], 6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] };
const FOCO_DIA = {
  fbA: ['Full body', 'Corpo inteiro', 'Cuerpo completo'], fbB: ['Full body', 'Corpo inteiro', 'Cuerpo completo'], fbC: ['Full body', 'Corpo inteiro', 'Cuerpo completo'],
  upA: ['Upper body', 'Superiores', 'Tren superior'], upB: ['Upper body', 'Superiores', 'Tren superior'],
  loA: ['Lower body', 'Inferiores', 'Tren inferior'], loB: ['Lower body · glutes', 'Inferiores · glúteos', 'Tren inferior · glúteos'],
  push: ['Push: chest, shoulders, triceps', 'Empurrar: peito, ombros, tríceps', 'Empuje: pecho, hombros, tríceps'],
  pull: ['Pull: back, biceps', 'Puxar: costas, bíceps', 'Tirón: espalda, bíceps'],
  legs: ['Legs and glutes', 'Pernas e glúteos', 'Piernas y glúteos'],
};
const NOME_SPLIT = { 2: ['Full body 2×', 'Corpo inteiro 2×', 'Cuerpo completo 2×'], 3: ['Full body 3×', 'Corpo inteiro 3×', 'Cuerpo completo 3×'], 4: ['Upper / Lower', 'Superiores / Inferiores', 'Superior / Inferior'], 5: ['Upper / Lower + Push / Pull / Legs', 'Superiores / Inferiores + Empurrar / Puxar / Pernas', 'Superior / Inferior + Empuje / Tirón / Piernas'], 6: ['Push / Pull / Legs 2×', 'Empurrar / Puxar / Pernas 2×', 'Empuje / Tirón / Piernas 2×'] };
const SEMANAS_NIVEL = {
  iniciante: [['adapt', 3], ['accum', 3], ['accum', 2], ['intens', 2], ['deload', 4]],
  intermediario: [['accum', 3], ['accum', 2], ['intens', 1], ['intens', 1], ['deload', 4]],
  avancado: [['accum', 3], ['accum', 2], ['accum', 2], ['intens', 1], ['intens', 1], ['deload', 4]],
};
const NOTA_FASE = {
  adapt: ['Learn the movements. Stop each set with 3 good reps left.', 'Aprenda os movimentos. Pare cada série com 3 repetições boas sobrando.', 'Aprende los movimientos. Termina cada serie con 3 repeticiones buenas de sobra.'],
  accum: ['Build volume. Add reps first; when you hit the top of the range on every set, add weight.', 'Acumule volume. Suba as repetições primeiro; quando bater o topo da faixa em todas as séries, aumente a carga.', 'Acumula volumen. Sube repeticiones primero; cuando llegues al tope del rango en todas las series, sube el peso.'],
  intens: ['Push closer to failure, with clean technique. This is where records happen.', 'Vá mais perto da falha, com técnica limpa. É aqui que saem os recordes.', 'Acércate más al fallo, con técnica limpia. Aquí llegan los récords.'],
  deload: ['Light week: half the sets, easy effort. Your body absorbs the gains now.', 'Semana leve: metade das séries, esforço tranquilo. É agora que o corpo absorve os ganhos.', 'Semana ligera: la mitad de las series, esfuerzo cómodo. Ahora tu cuerpo asimila las mejoras.'],
};
const NOME_DIA = ['Workout {x}', 'Treino {x}', 'Entrenamiento {x}'];

function programaLocal(pid, modo) {
  const p = perfil(pid) || {}, set = equipSet(S.gym), nivel = p.nivel || 'iniciante', obj = p.objetivo || 'hipertrofia';
  const dias = clamp(toInt(p.dias, 3), 2, 6), foco = new Set(p.foco || []);
  const evita = new Set((p.limites || []).flatMap(l => EVITAR[l] || []));
  const variar = modo === 'proximo' ? ((plano(pid) && plano(pid).ciclo) || 1) % 2 : 0;
  const nEx = { 30: 4, 45: 5, 60: 6, 75: 7, 90: 8 }[p.minutos] || (p.minutos < 40 ? 4 : p.minutos < 55 ? 5 : p.minutos < 70 ? 6 : 7);
  const ok = id => EX[id] && !evita.has(id) && disponivel(EX[id], set);
  const reps = (ex, principal) => {
    if (ex.carga === 's') return [30, 60];
    if (ex.grupo === 'panturrilhas' || ex.grupo === 'abdomen') return [10, 20];
    if (ex.tipo === 'C') {
      if (obj === 'forca' && principal) return [3, 6];
      if (ex.carga === 'c') return [6, 12];
      return obj === 'hipertrofia' || obj === 'forca' ? [6, 10] : [8, 12];
    }
    return obj === 'emagrecer' || obj === 'saude' ? [12, 15] : [10, 15];
  };
  const progDias = SPLITS[dias].map((tpl, di) => {
    const usados = new Set();
    let slots = DIAS_TPL[tpl].map((s, i) => ({ s, i, f: foco.has(SLOT_FOCO[s]) }));
    slots.sort((a, b) => (a.i - (a.f ? 2.5 : 0)) - (b.i - (b.f ? 2.5 : 0)));
    const exs = [];
    for (const { s, f } of slots) {
      if (exs.length >= nEx) break;
      const lista = obj === 'forca' && FORCA_PRIMEIRO[s] ? [...new Set([...FORCA_PRIMEIRO[s], ...SLOTS[s]])] : SLOTS[s];
      const opcoes = lista.filter(id => ok(id) && !usados.has(id));
      if (!opcoes.length) continue;
      const id = opcoes[Math.min(variar, opcoes.length - 1)];
      usados.add(id);
      const ex = EX[id], principal = exs.filter(x => EX[x.id].tipo === 'C').length < 2 && ex.tipo === 'C';
      const base = ex.tipo === 'C' ? (nivel === 'avancado' ? 4 : 3) : (nivel === 'iniciante' ? 2 : 3);
      const series = clamp(base + (f ? 1 : 0), 2, 5);
      const descanso = ex.tipo === 'C' ? (principal ? (obj === 'forca' ? 180 : 150) : 120) : (nivel === 'iniciante' ? 75 : 90);
      exs.push({ id, series, reps: reps(ex, principal), descanso });
    }
    return { nome: L3(NOME_DIA).replace('{x}', 'ABCDEFG'[di]), foco: L3(FOCO_DIA[tpl]), exercicios: exs };
  });
  const semanas = (SEMANAS_NIVEL[nivel] || SEMANAS_NIVEL.iniciante).map(([fase, rir], i) => ({
    fase, rir, seriesExtra: 0, cardioExtra: fase === 'deload' ? 0 : Math.min(10, i * 5), deload: fase === 'deload', nota: L3(NOTA_FASE[fase]),
  }));
  return { nome: L3(NOME_SPLIT[dias]) + ' · ' + nomeObj(obj), resumo: resumoLocal(p, dias), semanas, dias: progDias, cardio: cardioLocal(p, set, nivel, obj, dias), dicas: dicasLocal(p) };
}
function cardioLocal(p, set, nivel, obj, dias) {
  const vezes = clamp(toInt(p.cardioVezes, 0), 0, 5);
  if (!vezes) return { resumo: L3(['No cardio sessions in this block. Aim for 7,000–10,000 steps a day.', 'Sem sessões de cardio neste bloco. Busque 7.000 a 10.000 passos por dia.', 'Sin sesiones de cardio en este bloque. Apunta a 7.000–10.000 pasos al día.']), sessoes: [] };
  const joelho = (p.limites || []).some(l => l === 'joelho' || l === 'quadril');
  let modos = (p.cardioModos || []).filter(id => EX[id] && disponivel(EX[id], set));
  if (joelho) modos = modos.filter(id => !['corrida', 'corrida_esteira', 'corda'].includes(id));
  if (!modos.length) modos = ['bike', 'eliptico', 'esteira_inclinada', 'remo', 'caminhada'].filter(id => disponivel(EX[id], set) && !(joelho && id === 'corrida'));
  if (!modos.length) modos = ['caminhada'];
  const quando = { apos: ['After your strength workouts', 'Depois da musculação', 'Después de las pesas'], separado: ['On days without strength training', 'Em dias sem musculação', 'En días sin pesas'] }[p.cardioQuando] || ['After lifting or on rest days', 'Depois da musculação ou em dias de descanso', 'Después de las pesas o en días de descanso'];
  const z2 = { nome: L3(['Easy cardio', 'Cardio leve', 'Cardio suave']), protocolo: 'z2', opcoes: modos.slice(0, 4), minutos: obj === 'emagrecer' ? 35 : 30,
    intensidade: L3(['You can hold a conversation · effort 5 of 10', 'Dá para conversar · esforço 5 de 10', 'Puedes conversar · esfuerzo 5 de 10']), quando: L3(quando) };
  const sessoes = [];
  if (nivel !== 'iniciante' && vezes >= 2) {
    const hiitMaq = modos.filter(id => ['bike', 'remo', 'eliptico', 'corrida_esteira', 'esteira_inclinada', 'corda'].includes(id));
    sessoes.push({ ...z2, porSemana: vezes - 1 });
    sessoes.push({ nome: L3(['Intervals', 'Intervalado', 'Intervalos']), protocolo: nivel === 'avancado' ? 'n4x4' : 'h3030', opcoes: (hiitMaq.length ? hiitMaq : modos).slice(0, 3), minutos: nivel === 'avancado' ? 38 : 21, porSemana: 1,
      intensidade: L3(['Hard parts at effort 8–9 of 10, easy parts to recover', 'Partes fortes no esforço 8–9 de 10, partes leves para recuperar', 'Partes fuertes a esfuerzo 8–9 de 10, partes suaves para recuperar']),
      quando: L3(dias >= 4 ? ['After an upper-body day, or on a rest day', 'Depois de um treino de superiores, ou num dia de descanso', 'Después de un día de tren superior, o en un día de descanso'] : ['On a rest day, away from the hardest leg workout', 'Num dia de descanso, longe do treino de pernas mais pesado', 'En un día de descanso, lejos del entrenamiento de piernas más duro']) });
  } else if (nivel === 'iniciante' && vezes >= 3) {
    sessoes.push({ ...z2, porSemana: vezes - 1 });
    sessoes.push({ ...z2, nome: L3(['Easy cardio with surges', 'Cardio leve com arrancadas', 'Cardio suave con aceleraciones']), protocolo: 'fartlek', minutos: 25, porSemana: 1,
      intensidade: L3(['Mostly easy, with short pushes when the app says so', 'Quase todo leve, com arrancadas curtas quando o app avisar', 'Casi todo suave, con aceleraciones cortas cuando la app avise']) });
  } else sessoes.push({ ...z2, porSemana: vezes });
  const resumo = obj === 'emagrecer'
    ? L3(['Easy cardio burns extra energy without hurting your recovery; lifting keeps your muscle. Add daily steps on top.', 'O cardio leve gasta energia extra sem atrapalhar a recuperação; a musculação preserva seus músculos. Some passos no dia a dia.', 'El cardio suave quema energía extra sin perjudicar tu recuperación; las pesas mantienen tu músculo. Suma pasos cada día.'])
    : L3(['Easy cardio builds your aerobic base and helps recovery between workouts.', 'O cardio leve constrói sua base aeróbica e ajuda na recuperação entre os treinos.', 'El cardio suave construye tu base aeróbica y ayuda a recuperarte entre entrenamientos.']);
  return { resumo, sessoes };
}
function resumoLocal(p, dias) {
  const base = dias <= 3
    ? ['Full-body workouts train every muscle {d} times a week, which works great with {d} days.', 'Treinos de corpo inteiro trabalham cada músculo {d} vezes por semana, o que funciona muito bem com {d} dias.', 'Entrenamientos de cuerpo completo trabajan cada músculo {d} veces por semana, ideal con {d} días.']
    : ['Each muscle gets trained about twice a week, the sweet spot for growth.', 'Cada músculo é treinado cerca de duas vezes por semana, o ponto ideal para crescer.', 'Cada músculo se entrena unas dos veces por semana, el punto ideal para crecer.'];
  const prog = ['Effort rises week by week and the last week is light, so you come back stronger.', 'O esforço sobe semana a semana e a última semana é leve, para você voltar mais forte.', 'El esfuerzo sube semana a semana y la última semana es ligera, para que vuelvas más fuerte.'];
  const foco = (p.foco || []).length ? ['Your priority muscles come first in the workout and get an extra set.', 'Seus músculos prioritários vêm primeiro no treino e ganham uma série a mais.', 'Tus músculos prioritarios van primero en el entrenamiento y tienen una serie más.'] : null;
  return [L3(base).replace(/\{d\}/g, dias), L3(prog), foco && L3(foco)].filter(Boolean).join(' ');
}
function dicasLocal(p) {
  const out = [L3(['Use the target reps: when every set reaches the top of the range, add the smallest weight step next time.', 'Siga as repetições-alvo: quando todas as séries chegarem ao topo da faixa, suba a menor carga possível no próximo treino.', 'Sigue las repeticiones objetivo: cuando todas las series lleguen al tope del rango, sube el peso mínimo en el próximo entrenamiento.']),
    L3(['RIR means reps in reserve: RIR 2 is stopping when you could still do 2 more good reps.', 'RIR são as repetições na reserva: RIR 2 é parar quando ainda daria para fazer mais 2 repetições boas.', 'RIR son las repeticiones en reserva: RIR 2 es parar cuando aún podrías hacer 2 repeticiones buenas más.'])];
  if ((p.limites || []).length) out.push(L3(['Exercises that usually strain your sore spot were left out. If anything hurts, swap it with the swap button.', 'Exercícios que costumam forçar o ponto que incomoda ficaram de fora. Se algo doer, troque pelo botão de troca.', 'Se dejaron fuera ejercicios que suelen cargar la zona que te molesta. Si algo duele, cámbialo con el botón de cambio.']));
  else out.push(L3(['Sleep 7–9 hours and eat enough protein: that is where the muscle is actually built.', 'Durma de 7 a 9 horas e coma proteína suficiente: é aí que o músculo realmente é construído.', 'Duerme de 7 a 9 horas y come suficiente proteína: ahí es donde realmente se construye el músculo.']));
  return out;
}
