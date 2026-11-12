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
      exs.push({ id, series, reps: reps(ex, principal), descanso, porque: L3(PORQUE_EX[id] || PORQUE_SLOT[s]) });
    }
    return { nome: L3(NOME_DIA).replace('{x}', 'ABCDEFG'[di]), foco: L3(FOCO_DIA[tpl]), exercicios: exs };
  });
  const semanas = (SEMANAS_NIVEL[nivel] || SEMANAS_NIVEL.iniciante).map(([fase, rir], i) => ({
    fase, rir, seriesExtra: 0, cardioExtra: fase === 'deload' ? 0 : Math.min(10, i * 5), deload: fase === 'deload', nota: L3(NOTA_FASE[fase]),
  }));
  const prog = { nome: L3(NOME_SPLIT[dias]) + ' · ' + nomeObj(obj), resumo: resumoLocal(p, dias), semanas, dias: progDias, cardio: cardioLocal(p, set, nivel, obj, dias), dicas: dicasLocal(p) };
  prog.explicacao = explicacaoLocal(p, prog);
  return prog;
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

/* ---------- the built-in plan explained like a personal trainer would ---------- */
const PORQUE_SLOT = {
  squat: ['Main leg lift: trains your quads and glutes through a long range of motion.', 'Exercício principal de pernas: trabalha quadríceps e glúteos com grande amplitude de movimento.', 'Ejercicio principal de piernas: trabaja cuádriceps y glúteos con un gran recorrido.'],
  legpress: ['Lets you load your thighs heavily with your back supported, adding volume safely.', 'Permite colocar bastante carga nas coxas com as costas apoiadas, somando volume com segurança.', 'Permite cargar mucho los muslos con la espalda apoyada, sumando volumen con seguridad.'],
  quad_iso: ['Isolates the quads, including the part (rectus femoris) that squats train less.', 'Isola o quadríceps, inclusive a parte do músculo (reto femoral) que o agachamento trabalha menos.', 'Aísla el cuádriceps, incluida la parte (recto femoral) que la sentadilla trabaja menos.'],
  hinge: ['Hip hinge: trains hamstrings and glutes in the stretched position and strengthens your lower back.', 'Movimento de dobrar o quadril: trabalha posteriores de coxa e glúteos alongados e fortalece a lombar.', 'Bisagra de cadera: trabaja isquiotibiales y glúteos estirados y fortalece la zona lumbar.'],
  ham_curl: ['Leg curl: the hamstrings also bend the knee, which hinges don\'t train; together they cover the whole muscle.', 'Flexora: os posteriores de coxa também dobram o joelho, o que o stiff não treina; juntos cobrem o músculo inteiro.', 'Curl femoral: los isquiotibiales también flexionan la rodilla, cosa que la bisagra no entrena; juntos cubren todo el músculo.'],
  glute: ['Loads the glutes at full hip extension, where they work hardest.', 'Coloca carga nos glúteos na extensão total do quadril, onde eles mais trabalham.', 'Carga los glúteos en la extensión completa de cadera, donde más trabajan.'],
  glute_iso: ['Works the side of the glutes (gluteus medius), which shapes the hips and stabilizes the knees.', 'Trabalha a lateral do glúteo (glúteo médio), que dá forma ao quadril e estabiliza os joelhos.', 'Trabaja el lateral del glúteo (glúteo medio), que da forma a la cadera y estabiliza las rodillas.'],
  calves: ['Calves respond best to a full stretch at the bottom and higher reps; pause 1 second down there.', 'Panturrilhas respondem melhor com alongamento completo embaixo e mais repetições; pause 1 segundo lá embaixo.', 'Los gemelos responden mejor con estiramiento completo abajo y más repeticiones; pausa 1 segundo abajo.'],
  hpush: ['Main chest press: builds your chest, front shoulders and triceps together.', 'Supino principal: constrói peito, ombro da frente e tríceps ao mesmo tempo.', 'Press principal de pecho: construye pecho, hombro frontal y tríceps a la vez.'],
  ipush: ['Incline press: shifts more of the work to the upper chest.', 'Supino inclinado: coloca mais do trabalho na parte de cima do peito.', 'Press inclinado: pone más trabajo en la parte superior del pecho.'],
  chest_iso: ['Fly: trains the chest in its stretched position without tiring the triceps.', 'Crucifixo: treina o peito na posição alongada sem cansar o tríceps.', 'Aperturas: entrenan el pecho estirado sin cansar el tríceps.'],
  vpull: ['Vertical pull: builds the lats, the muscles that give your back its width.', 'Puxada vertical: constrói o latíssimo do dorso, o músculo que dá largura às costas.', 'Tirón vertical: construye el dorsal ancho, el músculo que da anchura a la espalda.'],
  hrow: ['Row: builds the middle of your back and the rear shoulders, balancing all the pressing.', 'Remada: constrói o meio das costas e o ombro de trás, equilibrando todos os empurrões.', 'Remo: construye la parte media de la espalda y el hombro posterior, equilibrando los empujes.'],
  vpush: ['Overhead press: builds the front and side shoulders and the triceps.', 'Desenvolvimento: constrói a parte da frente e a lateral do ombro, além do tríceps.', 'Press de hombros: construye el hombro frontal y lateral, además del tríceps.'],
  lateral: ['Lateral raise: the most direct exercise for the side shoulders, which make your shoulders look wider.', 'Elevação lateral: o exercício mais direto para o ombro lateral, que deixa os ombros mais largos.', 'Elevación lateral: el ejercicio más directo para el hombro lateral, que ensancha los hombros.'],
  reardelt: ['Rear shoulders: better posture and healthier shoulders, balancing the front.', 'Ombro de trás: melhora a postura e a saúde dos ombros, equilibrando a parte da frente.', 'Hombro posterior: mejor postura y hombros más sanos, equilibrando la parte frontal.'],
  biceps: ['Biceps: direct arm work on top of what the pulls already give them.', 'Bíceps: trabalho direto de braço, além do que as puxadas já dão.', 'Bíceps: trabajo directo de brazo, además de lo que ya dan los tirones.'],
  triceps: ['Triceps: about two thirds of your upper arm, trained directly here.', 'Tríceps: cerca de dois terços do braço, treinado diretamente aqui.', 'Tríceps: cerca de dos tercios del brazo, entrenado directamente aquí.'],
  abs: ['Core: trains the abs with resistance and teaches you to brace, which also protects your back on heavy lifts.', 'Abdômen: treina o abdômen com resistência e ensina a firmar o tronco, o que também protege a coluna nos exercícios pesados.', 'Core: entrena el abdomen con resistencia y enseña a bloquear el tronco, lo que también protege la espalda en los ejercicios pesados.'],
};
const PORQUE_EX = {
  cadeira_flexora: ['Seated leg curl: it stretches the hamstrings more than the lying version, and a study found more growth with it.', 'Cadeira flexora: alonga mais os posteriores que a mesa flexora, e um estudo encontrou mais crescimento com ela.', 'Curl femoral sentado: estira más los isquiotibiales que el tumbado, y un estudio encontró más crecimiento con él.'],
  triceps_overhead: ['Overhead extension: stretches the long head of the triceps; studies found more triceps growth this way than with pushdowns.', 'Tríceps acima da cabeça: alonga a cabeça longa do tríceps; estudos encontraram mais crescimento assim do que no tríceps na polia comum.', 'Extensión sobre la cabeza: estira la cabeza larga del tríceps; estudios encontraron más crecimiento así que con el jalón en polea.'],
  triceps_frances: ['Overhead extension: stretches the long head of the triceps, which grows more when trained this way.', 'Tríceps francês: alonga a cabeça longa do tríceps, que cresce mais quando treinada assim.', 'Extensión francesa: estira la cabeza larga del tríceps, que crece más entrenada así.'],
  rosca_inclinada: ['Incline curl: starts with your arm behind your body, stretching the biceps where it grows well.', 'Rosca inclinada: começa com o braço atrás do corpo, alongando o bíceps, posição em que ele cresce bem.', 'Curl inclinado: empieza con el brazo detrás del cuerpo, estirando el bíceps, donde crece bien.'],
  rosca_bayesian: ['Bayesian curl: the cable keeps tension with your arm behind you, stretching the biceps.', 'Rosca bayesian: o cabo mantém a tensão com o braço atrás do corpo, alongando o bíceps.', 'Curl bayesiano: el cable mantiene la tensión con el brazo detrás, estirando el bíceps.'],
  elev_lateral_polia: ['Cable lateral raise: the cable keeps tension even at the bottom, where dumbbells go slack.', 'Elevação lateral na polia: o cabo mantém tensão até embaixo, onde o halter fica sem carga.', 'Elevación lateral en polea: el cable mantiene la tensión incluso abajo, donde la mancuerna pierde carga.'],
  stiff: ['Romanian deadlift: trains hamstrings and glutes under a deep stretch, one of the best for the back of the thighs.', 'Stiff: trabalha posteriores e glúteos sob grande alongamento, um dos melhores para a parte de trás da coxa.', 'Peso muerto rumano: trabaja isquiotibiales y glúteos con gran estiramiento, de los mejores para la parte posterior del muslo.'],
  terra: ['Deadlift: the heaviest full-body pull; builds strength from the hamstrings and glutes to the upper back and grip.', 'Levantamento terra: a puxada mais pesada do corpo inteiro; constrói força dos posteriores e glúteos até o alto das costas e a pegada.', 'Peso muerto: el tirón más pesado de cuerpo completo; construye fuerza desde isquiotibiales y glúteos hasta la espalda alta y el agarre.'],
};
const TXT_LOCAL = {
  t_how: ['How this plan works', 'Como este plano funciona', 'Cómo funciona este plan'],
  how: ['This is a {w}-week block with {d} workouts a week and about {n} exercises per workout. The big lifts come first, while you are fresh: they are called compounds because they move several joints and train several muscles at once. The single-joint exercises (isolation, which focus on one muscle) come after. Every week asks a little more of you, and the last week is light so your body absorbs the work. When the block ends, the app builds the next one from your results.',
    'Este é um bloco de {w} semanas com {d} treinos por semana e cerca de {n} exercícios por treino. Os exercícios grandes vêm primeiro, enquanto você está descansado: eles se chamam compostos porque movem várias articulações e trabalham vários músculos ao mesmo tempo. Depois vêm os exercícios de uma articulação só (isolados, que focam um músculo). A cada semana o plano pede um pouco mais de você, e a última semana é leve para o corpo absorver o trabalho. Quando o bloco acaba, o app monta o próximo a partir dos seus resultados.',
    'Este es un bloque de {w} semanas con {d} entrenamientos por semana y unos {n} ejercicios por sesión. Los ejercicios grandes van primero, cuando estás fresco: se llaman compuestos porque mueven varias articulaciones y trabajan varios músculos a la vez. Después vienen los de una sola articulación (aislados, que se centran en un músculo). Cada semana el plan te pide un poco más, y la última semana es ligera para que el cuerpo asimile el trabajo. Cuando termina el bloque, la app arma el siguiente a partir de tus resultados.'],
  t_split: ['Why this split', 'Por que esta divisão', 'Por qué esta división'],
  split2: ['With 2 days a week, full-body workouts are the best choice: every session trains every major muscle, so each muscle is worked twice a week. Studies comparing once and twice a week found more growth with twice for the same total work. Workouts A and B alternate with different exercises, so each muscle is trained from different angles. Leave 2 or 3 days between them (for example Monday and Thursday).',
    'Com 2 dias por semana, treinos de corpo inteiro são a melhor escolha: cada sessão trabalha todos os músculos grandes, então cada músculo é treinado duas vezes por semana. Estudos que compararam treinar um músculo uma ou duas vezes por semana encontraram mais crescimento com duas, para o mesmo trabalho total. Os treinos A e B se alternam com exercícios diferentes, então cada músculo é trabalhado de ângulos diferentes. Deixe 2 ou 3 dias entre eles (por exemplo, segunda e quinta).',
    'Con 2 días por semana, los entrenamientos de cuerpo completo son la mejor opción: cada sesión trabaja todos los músculos grandes, así que cada músculo se entrena dos veces por semana. Estudios que compararon una y dos veces por semana encontraron más crecimiento con dos, para el mismo trabajo total. Los entrenamientos A y B se alternan con ejercicios distintos, así que cada músculo se trabaja desde ángulos diferentes. Deja 2 o 3 días entre ellos (por ejemplo, lunes y jueves).'],
  split3: ['With 3 days, full-body workouts train each muscle about 3 times a week, splitting the weekly work into smaller, higher-quality doses. Studies show that training a muscle at least twice a week beats once a week. Workouts A, B and C rotate different exercises, so each muscle is trained from different angles. Leave a rest day between sessions (for example Monday, Wednesday and Friday).',
    'Com 3 dias, treinos de corpo inteiro trabalham cada músculo cerca de 3 vezes por semana, dividindo o trabalho semanal em doses menores e de mais qualidade. Estudos mostram que treinar um músculo pelo menos duas vezes por semana é melhor que uma vez. Os treinos A, B e C revezam exercícios diferentes, então cada músculo é trabalhado de ângulos diferentes. Deixe um dia de descanso entre as sessões (por exemplo, segunda, quarta e sexta).',
    'Con 3 días, los entrenamientos de cuerpo completo trabajan cada músculo unas 3 veces por semana, repartiendo el trabajo semanal en dosis más pequeñas y de más calidad. Los estudios muestran que entrenar un músculo al menos dos veces por semana es mejor que una. Los entrenamientos A, B y C alternan ejercicios distintos, así que cada músculo se trabaja desde ángulos diferentes. Deja un día de descanso entre sesiones (por ejemplo, lunes, miércoles y viernes).'],
  split4: ['With 4 days, the upper/lower split is the classic choice: two upper-body workouts (chest, back, shoulders, arms) and two lower-body workouts (thighs, glutes, calves). Each muscle is trained twice a week, which research shows works better than once, and each session focuses on fewer muscles with more quality. A good week: upper, lower, rest, upper, lower, then two days off.',
    'Com 4 dias, a divisão superiores/inferiores é a escolha clássica: dois treinos de parte de cima (peito, costas, ombros, braços) e dois de parte de baixo (coxas, glúteos, panturrilhas). Cada músculo é treinado duas vezes por semana, o que as pesquisas mostram funcionar melhor que uma vez, e cada sessão foca menos músculos com mais qualidade. Uma boa semana: superiores, inferiores, descanso, superiores, inferiores e dois dias de folga.',
    'Con 4 días, la división superior/inferior es la opción clásica: dos entrenamientos de tren superior (pecho, espalda, hombros, brazos) y dos de tren inferior (muslos, glúteos, gemelos). Cada músculo se entrena dos veces por semana, que según la investigación funciona mejor que una, y cada sesión se centra en menos músculos con más calidad. Una buena semana: superior, inferior, descanso, superior, inferior y dos días libres.'],
  split5: ['With 5 days, you do an upper/lower pair and then push (chest, shoulders, triceps), pull (back, biceps) and legs. Each muscle is trained about twice a week, the frequency research supports, and the extra day spreads the work so no session gets too long.',
    'Com 5 dias, você faz um par superiores/inferiores e depois empurrar (peito, ombros, tríceps), puxar (costas, bíceps) e pernas. Cada músculo é treinado cerca de duas vezes por semana, a frequência que as pesquisas apoiam, e o dia a mais espalha o trabalho para nenhuma sessão ficar longa demais.',
    'Con 5 días, haces un par superior/inferior y después empuje (pecho, hombros, tríceps), tirón (espalda, bíceps) y piernas. Cada músculo se entrena unas dos veces por semana, la frecuencia que apoya la investigación, y el día extra reparte el trabajo para que ninguna sesión sea demasiado larga.'],
  split6: ['With 6 days, you do push/pull/legs twice a week: push days train chest, shoulders and triceps; pull days back and biceps; leg days thighs, glutes and calves. Each muscle is trained twice a week, and every session stays focused and short enough to keep quality high. Take one full day off each week.',
    'Com 6 dias, você faz empurrar/puxar/pernas duas vezes por semana: os dias de empurrar treinam peito, ombros e tríceps; os de puxar, costas e bíceps; os de pernas, coxas, glúteos e panturrilhas. Cada músculo é treinado duas vezes por semana, e cada sessão fica focada e curta o bastante para manter a qualidade alta. Tire um dia inteiro de folga por semana.',
    'Con 6 días, haces empuje/tirón/piernas dos veces por semana: los días de empuje entrenan pecho, hombros y tríceps; los de tirón, espalda y bíceps; los de piernas, muslos, glúteos y gemelos. Cada músculo se entrena dos veces por semana, y cada sesión se mantiene enfocada y lo bastante corta para conservar la calidad. Tómate un día completo libre a la semana.'],
  t_sets: ['Sets, reps, effort and rest', 'Séries, repetições, esforço e descanso', 'Series, repeticiones, esfuerzo y descanso'],
  sets_base: ['A rep (repetition) is one full movement; a set is a group of reps done in a row before you rest. Effort is set by RIR, reps in reserve: RIR 2 means stopping when you could still do 2 more clean reps.', 'Uma repetição é um movimento completo; uma série é um grupo de repetições feitas seguidas antes de descansar. O esforço é definido pelo RIR, as repetições na reserva: RIR 2 quer dizer parar quando ainda daria para fazer mais 2 repetições bem feitas.', 'Una repetición es un movimiento completo; una serie es un grupo de repeticiones seguidas antes de descansar. El esfuerzo se define con el RIR, las repeticiones en reserva: RIR 2 significa parar cuando aún podrías hacer 2 repeticiones limpias más.'],
  sets_hipertrofia: ['To build muscle, what matters most is enough hard sets: about 10 to 20 per muscle per week. The big lifts use 6 to 10 reps and the smaller ones 10 to 15, the best balance between growth, safety and fatigue. Sets that end 1 to 3 reps short of failure build almost as much muscle as going all the way, with much less fatigue. Rest 2 to 3 minutes on the big lifts and about 1.5 on the small ones: studies show longer rests let you do more reps, and that means more growth.',
    'Para ganhar músculo, o que mais importa é fazer séries difíceis suficientes: cerca de 10 a 20 por músculo por semana. Os exercícios grandes usam 6 a 10 repetições e os menores 10 a 15, o melhor equilíbrio entre crescimento, segurança e cansaço. Séries que terminam a 1 a 3 repetições da falha constroem quase tanto músculo quanto ir até o fim, com muito menos fadiga. Descanse 2 a 3 minutos nos exercícios grandes e cerca de 1,5 minuto nos pequenos: estudos mostram que descansos maiores deixam você fazer mais repetições, e isso significa mais crescimento.',
    'Para ganar músculo, lo que más importa son suficientes series duras: unas 10 a 20 por músculo por semana. Los ejercicios grandes usan 6 a 10 repeticiones y los pequeños 10 a 15, el mejor equilibrio entre crecimiento, seguridad y fatiga. Las series que terminan a 1 a 3 repeticiones del fallo construyen casi tanto músculo como llegar al fallo, con mucha menos fatiga. Descansa 2 a 3 minutos en los ejercicios grandes y alrededor de 1,5 en los pequeños: los estudios muestran que descansos más largos permiten más repeticiones, y eso significa más crecimiento.'],
  sets_forca: ['To get stronger you have to practice lifting heavy. The main lifts use 3 to 6 reps with heavier weights; the accessory exercises use 6 to 12 to build the muscle that supports those lifts. Heavy sets stay 1 to 3 reps short of failure so your technique stays solid and you recover in time for the next session. Rest 3 minutes or more between heavy sets: full recovery lets you lift more, and lifting more is what builds strength.',
    'Para ficar mais forte você precisa praticar levantar pesado. Os exercícios principais usam 3 a 6 repetições com cargas mais altas; os acessórios usam 6 a 12 para construir o músculo que sustenta esses levantamentos. As séries pesadas param a 1 a 3 repetições da falha para a técnica continuar firme e você se recuperar a tempo do próximo treino. Descanse 3 minutos ou mais entre as séries pesadas: a recuperação completa deixa você levantar mais, e levantar mais é o que constrói força.',
    'Para ganar fuerza tienes que practicar levantar pesado. Los ejercicios principales usan 3 a 6 repeticiones con más peso; los accesorios usan 6 a 12 para construir el músculo que sostiene esos levantamientos. Las series pesadas se quedan a 1 a 3 repeticiones del fallo para que la técnica siga firme y te recuperes a tiempo para la próxima sesión. Descansa 3 minutos o más entre series pesadas: la recuperación completa te permite levantar más, y levantar más es lo que construye fuerza.'],
  sets_emagrecer: ['To lose fat, the calorie deficit (eating a little less than you burn) is what removes the fat; strength training tells your body to keep its muscle. That is why the plan keeps real weights and reps (6 to 12 on the big lifts, 10 to 15 on the small ones) instead of light "toning" sets, which give your body no reason to keep muscle. Rest 1.5 to 2.5 minutes so every set is done with quality.',
    'Para perder gordura, o déficit calórico (comer um pouco menos do que você gasta) é o que tira a gordura; a musculação avisa o corpo para manter os músculos. Por isso o plano mantém cargas e repetições de verdade (6 a 12 nos exercícios grandes, 10 a 15 nos pequenos) em vez de séries leves "para definir", que não dão motivo para o corpo manter músculo. Descanse 1,5 a 2,5 minutos para fazer cada série com qualidade.',
    'Para perder grasa, el déficit calórico (comer un poco menos de lo que gastas) es lo que elimina la grasa; las pesas le dicen al cuerpo que mantenga el músculo. Por eso el plan mantiene pesos y repeticiones de verdad (6 a 12 en los grandes, 10 a 15 en los pequeños) en lugar de series ligeras "para tonificar", que no dan al cuerpo ninguna razón para mantener músculo. Descansa 1,5 a 2,5 minutos para que cada serie tenga calidad.'],
  sets_saude: ['For health, the guidelines ask for strength training for all the major muscles at least twice a week, and this plan covers that. Reps are moderate (8 to 15) because they build strength and muscle with low stress on the joints. You start a bit further from your limit and get closer as your technique improves. Rest 1.5 to 2 minutes between sets.',
    'Para a saúde, as diretrizes pedem musculação para todos os músculos grandes pelo menos duas vezes por semana, e este plano cobre isso. As repetições são moderadas (8 a 15) porque constroem força e músculo com pouco estresse nas articulações. Você começa um pouco mais longe do seu limite e chega mais perto conforme a técnica melhora. Descanse 1,5 a 2 minutos entre as séries.',
    'Para la salud, las guías piden entrenamiento de fuerza para todos los músculos grandes al menos dos veces por semana, y este plan lo cubre. Las repeticiones son moderadas (8 a 15) porque construyen fuerza y músculo con poco estrés en las articulaciones. Empiezas un poco más lejos de tu límite y te acercas a medida que mejora tu técnica. Descansa 1,5 a 2 minutos entre series.'],
  t_weight: ['How to pick the weight (and how it goes up)', 'Como escolher o peso (e como ele sobe)', 'Cómo elegir el peso (y cómo sube)'],
  weight: ['You don\'t have to guess. On every exercise, set 1 is a test. The first time, the app suggests a deliberately light weight and asks you to do as many reps as you can while still leaving the planned reps in reserve. From what you did, it calculates the exact weight and reps of the other sets, rounded to the plates and dumbbells your gym has, including how many kilos go on each side of the bar. If a set feels lighter than planned, the next ones go up; if heavier, they go down. When you reach the top of the rep range on every set, the weight goes up by the smallest step next time: that steady increase, called progressive overload, is what makes you grow and get stronger.',
    'Você não precisa adivinhar. Em cada exercício, a série 1 é um teste. Na primeira vez, o app sugere um peso leve de propósito e pede para você fazer o máximo de repetições deixando as repetições planejadas na reserva. A partir do que você fez, ele calcula o peso e as repetições exatas das outras séries, arredondando para as anilhas e halteres da sua academia, inclusive quantos quilos vão em cada lado da barra. Se uma série sair mais leve que o planejado, as próximas sobem; se sair mais pesada, descem. Quando você chega ao topo da faixa de repetições em todas as séries, o peso sobe o menor passo possível no treino seguinte: esse aumento constante, chamado sobrecarga progressiva, é o que faz você crescer e ficar mais forte.',
    'No tienes que adivinar. En cada ejercicio, la serie 1 es una prueba. La primera vez, la app sugiere un peso ligero a propósito y te pide hacer todas las repeticiones que puedas dejando en reserva las repeticiones planificadas. A partir de lo que hiciste, calcula el peso y las repeticiones exactas de las demás series, redondeando a los discos y mancuernas de tu gimnasio, incluidos los kilos que van a cada lado de la barra. Si una serie resulta más ligera de lo planificado, las siguientes suben; si es más pesada, bajan. Cuando llegas al tope del rango de repeticiones en todas las series, el peso sube el mínimo posible la próxima vez: ese aumento constante, llamado sobrecarga progresiva, es lo que te hace crecer y ganar fuerza.'],
  t_weeks: ['The weeks of the block', 'As semanas do bloco', 'Las semanas del bloque'],
  weeks: ['The block has {w} weeks: {lista}. The effort rises gradually, from RIR {a} to RIR {b}, because getting closer to your limit only pays off once your body has adapted. The last week is a deload: half the sets and an easy effort. It isn\'t lost time: the fatigue that built up over the weeks goes away, your joints get a break, and you start the next block stronger.',
    'O bloco tem {w} semanas: {lista}. O esforço sobe aos poucos, de RIR {a} até RIR {b}, porque chegar mais perto do limite só compensa depois que o corpo se adaptou. A última semana é um deload (semana de descarga): metade das séries e esforço tranquilo. Não é tempo perdido: o cansaço acumulado nas semanas vai embora, as articulações descansam e você começa o próximo bloco mais forte.',
    'El bloque tiene {w} semanas: {lista}. El esfuerzo sube poco a poco, de RIR {a} a RIR {b}, porque acercarse al límite solo compensa cuando el cuerpo ya se adaptó. La última semana es una descarga: la mitad de las series y un esfuerzo cómodo. No es tiempo perdido: la fatiga acumulada desaparece, las articulaciones descansan y empiezas el siguiente bloque más fuerte.'],
  t_cardio: ['Cardio', 'Cardio', 'Cardio'],
  cardio_none: ['You chose no cardio sessions in this block. That works for your goal as long as you move during the day: aim for 7,000 to 10,000 steps. Walking adds activity without hurting the recovery of your legs.',
    'Você escolheu não fazer sessões de cardio neste bloco. Isso funciona para o seu objetivo, desde que você se mexa durante o dia: busque 7.000 a 10.000 passos. Caminhar soma atividade sem atrapalhar a recuperação das pernas.',
    'Elegiste no hacer sesiones de cardio en este bloque. Funciona para tu objetivo siempre que te muevas durante el día: apunta a 7.000 a 10.000 pasos. Caminar suma actividad sin perjudicar la recuperación de las piernas.'],
  cardio_base: ['Most of your cardio is easy (zone 2): a pace where you can still hold a conversation, about effort 5 of 10. It strengthens your heart and lungs, builds endurance and helps you recover, without stealing energy from strength training.',
    'A maior parte do seu cardio é leve (zona 2): um ritmo em que ainda dá para conversar, esforço de uns 5 de 10. Ele fortalece coração e pulmões, aumenta o fôlego e ajuda na recuperação, sem roubar energia da musculação.',
    'La mayor parte de tu cardio es suave (zona 2): un ritmo en el que aún puedes conversar, esfuerzo de unos 5 de 10. Fortalece corazón y pulmones, mejora la resistencia y ayuda a recuperarte, sin quitar energía a las pesas.'],
  cardio_hiit: [' Once a week there is an interval session: short hard parts (effort 8 to 9 of 10) with easy parts to recover. It is the most time-efficient way to raise your VO2max, the measure of your aerobic fitness and one of the strongest markers of long-term health.',
    ' Uma vez por semana há uma sessão intervalada: partes curtas e fortes (esforço 8 a 9 de 10) com partes leves para recuperar. É o jeito mais eficiente em tempo de aumentar o seu VO2máx, a medida do seu condicionamento aeróbico e um dos marcadores mais fortes de saúde a longo prazo.',
    ' Una vez por semana hay una sesión de intervalos: partes cortas y fuertes (esfuerzo 8 a 9 de 10) con partes suaves para recuperar. Es la forma más eficiente en tiempo de subir tu VO2máx, la medida de tu condición aeróbica y uno de los indicadores más fuertes de salud a largo plazo.'],
  cardio_fat: [' Cardio burns extra energy, but the deficit comes mostly from food, and daily steps count a lot too.', ' O cardio gasta energia extra, mas o déficit vem principalmente da alimentação, e os passos do dia a dia também contam muito.', ' El cardio quema energía extra, pero el déficit viene sobre todo de la alimentación, y los pasos diarios también cuentan mucho.'],
  t_expect: ['What to expect and how to recover', 'O que esperar e como se recuperar', 'Qué esperar y cómo recuperarte'],
  exp_hipertrofia: ['In the first weeks you get stronger fast, mostly because your nervous system learns the movements; visible muscle takes longer, usually 6 to 12 weeks of consistent training. Muscle is built while you rest: sleep 7 to 9 hours and eat enough protein (as a general guide, about 1.6 g per kg of body weight a day, spread over your meals) and enough food overall. Soreness in the first weeks is normal and fades; it is not a sign of a good or bad workout. Sharp pain in a joint is different: stop and swap the exercise.',
    'Nas primeiras semanas você fica mais forte rápido, principalmente porque o sistema nervoso aprende os movimentos; o músculo visível demora mais, normalmente de 6 a 12 semanas de treino consistente. O músculo é construído no descanso: durma de 7 a 9 horas e coma proteína suficiente (como referência geral, cerca de 1,6 g por kg de peso corporal por dia, dividida nas refeições) e comida suficiente no total. Dor muscular nas primeiras semanas é normal e diminui; ela não indica treino bom ou ruim. Dor aguda numa articulação é outra coisa: pare e troque o exercício.',
    'En las primeras semanas ganas fuerza rápido, sobre todo porque el sistema nervioso aprende los movimientos; el músculo visible tarda más, normalmente 6 a 12 semanas de entrenamiento constante. El músculo se construye al descansar: duerme 7 a 9 horas y come suficiente proteína (como guía general, unos 1,6 g por kg de peso al día, repartidos en las comidas) y suficiente comida en total. Las agujetas de las primeras semanas son normales y disminuyen; no indican un entrenamiento bueno o malo. El dolor agudo en una articulación es otra cosa: para y cambia el ejercicio.'],
  exp_forca: ['Strength comes fast at first as your body learns to coordinate the lifts: expect your numbers to go up almost every week in the beginning, then more slowly. Sleep 7 to 9 hours and eat enough protein and food overall; strength drops when recovery is poor. If a lift stalls for two workouts in a row, the app adjusts the weight. Sharp pain in a joint is a reason to stop and swap the exercise.',
    'A força vem rápido no começo, conforme o corpo aprende a coordenar os levantamentos: espere ver os números subirem quase toda semana no início, e depois mais devagar. Durma de 7 a 9 horas e coma proteína e comida suficientes; a força cai quando a recuperação é ruim. Se um exercício empacar por dois treinos seguidos, o app ajusta o peso. Dor aguda numa articulação é motivo para parar e trocar o exercício.',
    'La fuerza llega rápido al principio, a medida que el cuerpo aprende a coordinar los levantamientos: espera que tus números suban casi cada semana al inicio y luego más despacio. Duerme 7 a 9 horas y come suficiente proteína y comida; la fuerza baja cuando la recuperación es mala. Si un ejercicio se estanca dos entrenamientos seguidos, la app ajusta el peso. El dolor agudo en una articulación es motivo para parar y cambiar el ejercicio.'],
  exp_emagrecer: ['A good pace is losing about 0.5 to 1% of your body weight per week; faster tends to cost muscle. The scale goes up and down every day with water, so look at the weekly average and your measurements. Keep the weights as heavy as you can: if your strength holds while your body weight drops, you are losing fat, not muscle. Sleep 7 to 9 hours and keep protein high (as a general guide, 1.6 to 2.2 g per kg of body weight a day); a dietitian can set your exact diet.',
    'Um bom ritmo é perder cerca de 0,5 a 1% do peso corporal por semana; mais rápido que isso costuma custar músculo. A balança sobe e desce todo dia por causa da água, então olhe a média da semana e as suas medidas. Mantenha as cargas tão pesadas quanto conseguir: se a força se mantém enquanto o peso cai, você está perdendo gordura, não músculo. Durma de 7 a 9 horas e mantenha a proteína alta (como referência geral, 1,6 a 2,2 g por kg de peso corporal por dia); um nutricionista pode montar a sua dieta exata.',
    'Un buen ritmo es perder alrededor del 0,5 al 1% del peso corporal por semana; más rápido suele costar músculo. La báscula sube y baja cada día por el agua, así que mira la media semanal y tus medidas. Mantén los pesos tan altos como puedas: si la fuerza se mantiene mientras baja el peso, estás perdiendo grasa, no músculo. Duerme 7 a 9 horas y mantén la proteína alta (como guía general, 1,6 a 2,2 g por kg de peso al día); un nutricionista puede ajustar tu dieta exacta.'],
  exp_saude: ['In 2 to 4 weeks you should feel more energy, better sleep and an easier time with daily tasks; strength and endurance keep improving for months. Consistency matters more than intensity: missing a workout is fine, quitting is not. Sleep 7 to 9 hours, eat enough protein and drink water. Soreness at the start is normal; joint pain is not, so if something hurts, swap the exercise.',
    'Em 2 a 4 semanas você deve sentir mais disposição, sono melhor e mais facilidade nas tarefas do dia a dia; força e fôlego continuam melhorando por meses. Constância importa mais que intensidade: faltar a um treino tudo bem, desistir não. Durma de 7 a 9 horas, coma proteína suficiente e beba água. Dor muscular no começo é normal; dor na articulação não, então se algo doer, troque o exercício.',
    'En 2 a 4 semanas deberías notar más energía, mejor sueño y más facilidad en las tareas diarias; la fuerza y la resistencia siguen mejorando durante meses. La constancia importa más que la intensidad: faltar a un entrenamiento está bien, abandonar no. Duerme 7 a 9 horas, come suficiente proteína y bebe agua. Las agujetas al principio son normales; el dolor articular no, así que si algo duele, cambia el ejercicio.'],
};
function explicacaoLocal(p, prog) {
  const T = k => L3(TXT_LOCAL[k]), obj = p.objetivo || 'hipertrofia', dias = prog.dias.length, w = prog.semanas.length;
  const nEx = Math.round(prog.dias.reduce((n, d) => n + d.exercicios.length, 0) / Math.max(1, dias));
  const rirs = prog.semanas.filter(s => !s.deload).map(s => s.rir);
  const lista = prog.semanas.map((s, i) => `${i + 1}: ${nomeFase(s.fase)} (RIR ${s.rir})`).join(', ');
  const sess = (prog.cardio && prog.cardio.sessoes) || [];
  const cardio = !sess.length ? T('cardio_none')
    : T('cardio_base') + (sess.some(s => PROTO[s.protocolo] && PROTO[s.protocolo].nivel !== 'easy' && s.protocolo !== 'fartlek') ? T('cardio_hiit') : '') + (obj === 'emagrecer' ? T('cardio_fat') : '');
  return [
    { titulo: T('t_how'), texto: T('how').replace('{w}', w).replace('{d}', dias).replace('{n}', nEx) },
    { titulo: T('t_split'), texto: T('split' + clamp(dias, 2, 6)) },
    { titulo: T('t_sets'), texto: T('sets_base') + ' ' + T('sets_' + (TXT_LOCAL['sets_' + obj] ? obj : 'hipertrofia')) },
    { titulo: T('t_weight'), texto: T('weight') },
    { titulo: T('t_weeks'), texto: T('weeks').replace('{w}', w).replace('{lista}', lista).replace('{a}', Math.max(...rirs)).replace('{b}', Math.min(...rirs)) },
    { titulo: T('t_cardio'), texto: cardio },
    { titulo: T('t_expect'), texto: T('exp_' + (TXT_LOCAL['exp_' + obj] ? obj : 'hipertrofia')) },
  ];
}
