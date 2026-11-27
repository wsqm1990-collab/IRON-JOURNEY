/* ---------- the tutorial: Master Atlas shows the app to someone using it for the first time ----------
   Short tours at the moment each one helps: the welcome screen, the first plan, the first workout, and
   the first visit to Cardio, Coach and Journey. A dark veil with a hole around what is being explained,
   and an RPG dialog box with the mentor. Seen tours are remembered per person on this device (the
   welcome per device); Settings shows them again. */
Object.assign(STR, {
  tour_label: ['Tutorial', 'Tutorial', 'Tutorial'],
  tour_next: ['Next', 'Próximo', 'Siguiente'], tour_back: ['Back', 'Voltar', 'Atrás'], tour_skip: ['Skip', 'Pular', 'Saltar'],
  tour_done: ['Got it', 'Entendi', 'Entendido'], tour_go: ['Let\'s go!', 'Bora!', '¡Vamos!'], tour_n: ['{a} of {b}', '{a} de {b}', '{a} de {b}'],
  tour_title: ['Tutorial', 'Tutorial', 'Tutorial'],
  tour_set_text: ['Master Atlas shows you how to use the app, screen by screen.', 'O Mestre Atlas mostra como usar o app, tela por tela.', 'El Maestro Atlas te muestra cómo usar la app, pantalla por pantalla.'],
  tour_replay: ['See the tutorial again', 'Ver o tutorial de novo', 'Ver el tutorial otra vez'],
  /* welcome */
  tb_1: ['Welcome to Swordbell! I\'m Master Atlas, and I\'ll guide you through your first steps. The app is your pocket personal trainer: it builds your workout, tells you the weight for every set and turns each workout into an RPG adventure.',
    'Bem-vindo ao Swordbell! Eu sou o Mestre Atlas e vou te guiar nos primeiros passos. O app é o seu personal de bolso: ele monta o seu treino, diz o peso de cada série e transforma cada treino numa aventura de RPG.',
    '¡Bienvenido a Swordbell! Soy el Maestro Atlas y te guiaré en tus primeros pasos. La app es tu entrenador personal de bolsillo: arma tu entrenamiento, te dice el peso de cada serie y convierte cada entreno en una aventura RPG.'],
  tb_2: ['Getting started is quick: tell me your goal and your routine, tick the equipment at your gym, and I build your plan. It takes about 3 minutes.',
    'Começar é rápido: você me conta o seu objetivo e a sua rotina, marca os aparelhos da sua academia e eu monto o seu plano. Leva uns 3 minutos.',
    'Empezar es rápido: me cuentas tu objetivo y tu rutina, marcas los aparatos de tu gimnasio y yo armo tu plan. Lleva unos 3 minutos.'],
  tb_3: ['When you\'re ready, tap “{b}”. As soon as your plan is ready, I\'ll show you around the app.',
    'Quando estiver pronto, toque em “{b}”. Assim que o seu plano ficar pronto, eu te mostro o app por dentro.',
    'Cuando estés listo, toca “{b}”. En cuanto tu plan esté listo, te muestro la app por dentro.'],
  /* the app, once there is a plan */
  ta_pronto: ['Your plan is ready!', 'Seu plano está pronto!', '¡Tu plan está listo!'],
  ta_volta: ['Let\'s take a quick tour of the app.', 'Vamos dar uma volta rápida pelo app.', 'Demos una vuelta rápida por la app.'],
  ta_plano: ['“{t}” has your full plan: the weeks, the workouts and why each exercise is there. It\'s also where you change your profile and your gym\'s equipment.',
    'Em “{t}” fica o seu plano completo: as semanas, os treinos e por que cada exercício está ali. É aqui também que você muda o seu perfil e os aparelhos da academia.',
    'En “{t}” está tu plan completo: las semanas, los entrenos y por qué está cada ejercicio. Aquí también cambias tu perfil y los aparatos del gimnasio.'],
  ta_hoje: ['Every day, start at “{t}”: today\'s workout, with the suggested weight for each exercise. At the gym, just tap “{b}”.',
    'Todo dia, comece pela tela “{t}”: o treino do dia, com o peso sugerido de cada exercício. Na academia, é só tocar em “{b}”.',
    'Cada día, empieza en “{t}”: el entreno del día, con el peso sugerido de cada ejercicio. En el gimnasio, solo toca “{b}”.'],
  ta_hoje_ger: ['Every day, start at “{t}”: your workout of the day always shows up there, with the suggested weight for each exercise.',
    'Todo dia, comece pela tela “{t}”: o seu treino do dia sempre aparece lá, com o peso sugerido de cada exercício.',
    'Cada día, empieza en “{t}”: tu entreno del día siempre aparece allí, con el peso sugerido de cada ejercicio.'],
  ta_hoje_sem: ['This is “{t}”. First, let\'s build your plan: tap this button and answer a few questions.',
    'Esta é a tela “{t}”. Primeiro, vamos montar o seu plano: toque neste botão e responda algumas perguntas.',
    'Esta es la pantalla “{t}”. Primero, armemos tu plan: toca este botón y responde unas preguntas.'],
  ta_dif: ['Short on time, gym packed, or training at home? Tap “{b}” and I\'ll adapt today\'s workout.',
    'Sem tempo, academia lotada ou vai treinar em casa? Toque em “{b}” e eu adapto o treino de hoje.',
    '¿Sin tiempo, gimnasio lleno o entrenas en casa? Toca “{b}” y adapto el entreno de hoy.'],
  ta_cardio: ['In “{t}” you do cardio guided by voice and beeps, even while watching a show or listening to music. The app tells you when to speed up and when to ease off.',
    'Em “{t}” você faz cardio guiado por voz e bipe, até enquanto assiste uma série ou ouve música. O app avisa quando acelerar e quando ir mais leve.',
    'En “{t}” haces cardio guiado por voz y pitidos, incluso mientras ves una serie o escuchas música. La app te avisa cuándo acelerar y cuándo ir más suave.'],
  ta_coach: ['In “{t}” you talk to your AI personal trainer: ask about training, tell it how the workout went, and ask for changes to your plan.',
    'Em “{t}” você conversa com o seu personal de IA: tire dúvidas sobre o treino, conte como foi e peça mudanças no seu plano.',
    'En “{t}” hablas con tu entrenador de IA: resuelve dudas sobre el entreno, cuéntale cómo te fue y pide cambios en tu plan.'],
  ta_coach_key: ['In “{t}” you talk to your AI personal trainer. To turn the AI on, add your key in Settings, the gear at the top.',
    'Em “{t}” você conversa com o seu personal de IA. Para ligar a IA, coloque a sua chave nas Configurações, na engrenagem lá em cima.',
    'En “{t}” hablas con tu entrenador de IA. Para activar la IA, pon tu clave en Ajustes, en el engranaje de arriba.'],
  ta_jornada: ['“{t}” is home to your hero. Every workout clears a stage of the map and earns XP. At the end of the chapter, the boss is waiting.',
    'Em “{t}” mora o seu herói. Cada treino vence uma fase do mapa e dá XP. No fim do capítulo, o chefão te espera.',
    'En “{t}” vive tu héroe. Cada entreno supera una fase del mapa y da XP. Al final del capítulo, te espera el jefe.'],
  ta_fim: ['The gear opens Settings, and this tutorial if you want to see it again. That\'s it! At the gym, tap “{b}” and I\'ll show you how to log your sets.',
    'Na engrenagem ficam as Configurações e este tutorial, se quiser rever. Pronto! Na academia, toque em “{b}” que eu te mostro como marcar as séries.',
    'En el engranaje están los Ajustes y este tutorial, si quieres verlo otra vez. ¡Listo! En el gimnasio, toca “{b}” y te muestro cómo marcar las series.'],
  ta_fim2: ['The gear opens Settings, and this tutorial if you want to see it again. That\'s it, over to you!',
    'Na engrenagem ficam as Configurações e este tutorial, se quiser rever. Pronto, agora é com você!',
    'En el engranaje están los Ajustes y este tutorial, si quieres verlo otra vez. ¡Listo, ahora te toca a ti!'],
  /* the first workout */
  tt_1: ['Time to train! Each card is one exercise, in workout order.', 'Hora de treinar! Cada cartão é um exercício, na ordem do treino.', '¡A entrenar! Cada tarjeta es un ejercicio, en el orden del entreno.'],
  tt_teste: ['The first time on each exercise, set 1 is a test: start light and do as many reps as you can while leaving a few in the tank. From that, the app works out the weight for the other sets.',
    'Na primeira vez em cada exercício, a série 1 é um teste: comece leve e faça o máximo de repetições deixando algumas sobrando. Com isso, o app calcula o peso das outras séries.',
    'La primera vez en cada ejercicio, la serie 1 es una prueba: empieza ligero y haz todas las repeticiones que puedas dejando algunas de reserva. Con eso, la app calcula el peso de las otras series.'],
  tt_serie: ['Each row is a set: the weight in kg, then the reps. Change the numbers if you need to.', 'Cada linha é uma série: o peso em kg e depois as repetições. Mude os números se precisar.', 'Cada fila es una serie: el peso en kg y luego las repeticiones. Cambia los números si hace falta.'],
  tt_ok: ['Finished the set? Tap ✓. The rest timer starts on its own, and your phone lets you know when it\'s time for the next set, even with another app open.',
    'Terminou a série? Toque no ✓. O descanso começa sozinho e o celular avisa quando for hora da próxima série, mesmo com outro app aberto.',
    '¿Terminaste la serie? Toca ✓. El descanso empieza solo y el móvil te avisa cuando toque la siguiente serie, incluso con otra app abierta.'],
  tt_acoes: ['Down here: “{a}” shows the movement and videos, “{p}” asks your trainer, and “{s}” changes the exercise if the machine is taken or something hurts.',
    'Aqui embaixo: “{a}” mostra o movimento e vídeos, “{p}” tira dúvidas com o personal e “{s}” troca o exercício se o aparelho estiver ocupado ou algo doer.',
    'Aquí abajo: “{a}” muestra el movimiento y videos, “{p}” le pregunta a tu entrenador y “{s}” cambia el ejercicio si el aparato está ocupado o algo duele.'],
  tt_fim: ['When you\'re done, tap “{b}”. Your hero fights the stage monster and you earn XP. Have a great workout!',
    'Quando terminar tudo, toque em “{b}”. O seu herói enfrenta o monstro da fase e você ganha XP. Bom treino!',
    'Cuando termines, toca “{b}”. Tu héroe se enfrenta al monstruo de la fase y ganas XP. ¡Buen entreno!'],
  /* cardio, coach, journey */
  tc_1: ['This is the cardio studio. Pick a style: “{a}” is cardio on its own, “{b}” is for doing it while watching a show, and “{c}” is with music at the right pace.',
    'Este é o estúdio de cardio. Escolha o jeito: “{a}” é o cardio sozinho, “{b}” é para fazer assistindo uma série e “{c}” é com música no ritmo certo.',
    'Este es el estudio de cardio. Elige el estilo: “{a}” es el cardio solo, “{b}” es para hacerlo viendo una serie y “{c}” es con música al ritmo justo.'],
  tc_alvo: ['Each part of the workout shows what to set on the machine (speed, incline, level or pace), just like the weight in strength training. Tap “{b}” to see how it works.',
    'Cada parte do treino mostra o que colocar no aparelho (velocidade, inclinação, nível ou ritmo), igual ao peso na musculação. Toque em “{b}” para entender.',
    'Cada parte del entrenamiento muestra qué poner en la máquina (velocidad, pendiente, nivel o ritmo), igual que el peso en las pesas. Toca “{b}” para entenderlo.'],
  tc_2: ['During cardio, a voice and a beep tell you when to push, when to ease off and what to set on the machine. It works with the screen off or another app open. Let\'s sweat!',
    'Durante o cardio, a voz e o bipe avisam quando acelerar, quando ir leve e o que colocar no aparelho. Funciona com a tela apagada ou com outro app aberto. Bora suar!',
    'Durante el cardio, una voz y un pitido te avisan cuándo acelerar, cuándo ir suave y qué poner en la máquina. Funciona con la pantalla apagada u otra app abierta. ¡A sudar!'],
  tc_sug: ['Every day the coach picks the best cardio for you, from what you trained today and the cardio you\'ve done this week. Don\'t like it? Tap “{b}” for another one.',
    'Todo dia o treinador escolhe o melhor cardio para você, pelo que você treinou hoje e pelo cardio que já fez na semana. Não gostou? Toque em “{b}” para ver outra.',
    'Cada día el entrenador elige el mejor cardio para ti, según lo que entrenaste hoy y el cardio que ya hiciste en la semana. ¿No te gusta? Toca “{b}” para ver otra.'],
  tc_sug_novo: ['New: the coach now suggests the best cardio for today, with three options, the best one first. Don\'t like it? Tap “{b}”.',
    'Novidade: agora o treinador sugere o melhor cardio do dia, com três opções, a melhor primeiro. Não gostou? Toque em “{b}”.',
    'Novedad: ahora el entrenador sugiere el mejor cardio del día, con tres opciones, la mejor primero. ¿No te gusta? Toca “{b}”.'],
  tc_alvo_novo: ['New: each part of your cardio now shows what to set on the machine (speed, incline, level or pace), on screen and by voice. Tap “{b}” to see how it works.',
    'Novidade: agora cada parte do cardio mostra o que colocar no aparelho (velocidade, inclinação, nível ou ritmo), na tela e na voz. Toque em “{b}” para entender como funciona.',
    'Novedad: ahora cada parte del cardio muestra qué poner en la máquina (velocidad, pendiente, nivel o ritmo), en pantalla y por voz. Toca “{b}” para ver cómo funciona.'],
  tq_1: ['Here you talk to your AI personal trainer. Ask anything: technique, pain, tiredness, food or your plan.',
    'Aqui você conversa com o seu personal de IA. Pergunte o que quiser: técnica, dor, cansaço, alimentação ou o seu plano.',
    'Aquí hablas con tu entrenador de IA. Pregunta lo que quieras: técnica, dolor, cansancio, alimentación o tu plan.'],
  tq_key: ['Here you talk to your AI personal trainer. For it to answer, add your AI key in Settings: the steps are there.',
    'Aqui você conversa com o seu personal de IA. Para ele responder, coloque a sua chave de IA nas Configurações: o passo a passo está lá.',
    'Aquí hablas con tu entrenador de IA. Para que responda, pon tu clave de IA en Ajustes: allí están los pasos.'],
  tq_ajuste: ['Want to change something in your plan? Tap “{b}” and ask in your own words, for example: “swap the bench press, my shoulder hurts”.',
    'Quer mudar algo no plano? Toque em “{b}” e peça com as suas palavras, por exemplo: “troque o supino, meu ombro dói”.',
    '¿Quieres cambiar algo del plan? Toca “{b}” y pídelo con tus palabras, por ejemplo: “cambia el press de banca, me duele el hombro”.'],
  tj_heroi: ['This is your journey! Tap “{b}” to make your hero your way and choose a real-life prize for when you win.',
    'Esta é a sua jornada! Toque em “{b}” para montar o seu herói do seu jeito e escolher um prêmio de verdade para quando vencer.',
    '¡Esta es tu jornada! Toca “{b}” para crear tu héroe a tu manera y elegir un premio de verdad para cuando ganes.'],
  tj_mapa: ['This is you on the map. Every workout clears a stage: train your days each week to move ahead and, at the end of the chapter, beat the boss!',
    'Este é você no mapa. Cada treino feito vence uma fase: treine os seus dias da semana para avançar e, no fim do capítulo, derrote o chefão!',
    'Este eres tú en el mapa. Cada entreno supera una fase: entrena tus días de la semana para avanzar y, al final del capítulo, ¡derrota al jefe!'],
  tj_arsenal: ['And in “{b}” is your gear: every workout opens a chest with weapons, shields and armour for your hero, and each kind of workout trains a power. Only training earns them!',
    'E em “{b}” fica o seu equipamento: cada treino abre um baú com armas, escudos e armaduras para o seu herói, e cada tipo de treino fortalece um poder. Só o treino dá esses itens!',
    'Y en “{b}” está tu equipo: cada entreno abre un cofre con armas, escudos y armaduras para tu héroe, y cada tipo de entreno fortalece un poder. ¡Solo entrenar los da!'],
  tj_arsenal_novo: ['New: the Arsenal! Every workout now opens a chest with weapons, shields and armour for your hero, and each kind of workout trains a power. Your past workouts already opened theirs: tap “{b}” to see.',
    'Novidade: o Arsenal! Agora cada treino abre um baú com armas, escudos e armaduras para o seu herói, e cada tipo de treino fortalece um poder. Os treinos que você já fez abriram os deles: toque em “{b}” para ver.',
    'Novedad: ¡el Arsenal! Ahora cada entreno abre un cofre con armas, escudos y armaduras para tu héroe, y cada tipo de entreno fortalece un poder. Tus entrenos anteriores ya abrieron los suyos: toca “{b}” para verlo.'],
});

const Tour = { on: false, id: '', chave: '', passos: [], i: 0, tick: 0, digitando: false, foco: null, revendo: false };
const TOUR_INERTES = ['header.top', 'main', '#tabs', '#rest', '#player', '#sheet', '#toast'];
const tourVistos = () => LS.get('ij_tour') || {};
const tourViu = (k, id) => !!(tourVistos()[k] || {})[id];
function tourMarcar(k, id) { const v = tourVistos(); v[k] = { ...(v[k] || {}), [id]: 1 }; LS.set('ij_tour', v); }
/* people who trained before the tutorial existed already know the app: it doesn't open by itself for them */
function tourMigrar() {
  if (LS.get('ij_tour_v')) return;
  LS.set('ij_tour_v', 1);
  const v = tourVistos();
  if (S.ordem.length) v._ = { ...(v._ || {}), boas: 1 };
  for (const pid of S.ordem) if (sessoesDe(pid).length || cardioDe(pid).length) v[pid] = { app: 1, treino: 1, cardio: 1, coach: 1, jornada: 1 };
  LS.set('ij_tour', v);
}
/* what the Today screen is showing now (the same choices viewHoje makes) */
function estadoHoje(pid) {
  const pr = progresso(pid);
  if (!pr) return 'sem';
  if (pr.completo) return 'fim';
  const u = sessoesDe(pid)[0];
  if (u && dayKey(u.inicio) === dayKey(Date.now()) && u.planoId === pr.pl.id) return 'feito';
  if (casaHoje(pid)) return 'casa';
  return 'normal';
}
/* go to a tab behind the veil, so the person sees the screen being explained */
const tourAba = tab => () => {
  if (!$('#sheet').hidden) closeSheet();
  if (S.tab !== tab || S.sub) { S.tab = tab; S.sub = null; LS.set('td_tab', tab); render(); }
  window.scrollTo(0, 0);
};
const tourTopo = () => window.scrollTo(0, 0);

/* each tour: a list of steps { alvo: what to point at, txt, antes: what to show first, opcional, fim: last button } */
const TOURS = {
  boas: () => [
    ...(LS.get('td_lang') ? [] : [{ lang: true }]),
    { txt: () => t('tb_1') },
    { alvo: '#comoFunciona', txt: () => t('tb_2') },
    { alvo: '[data-a="novoPerfil"]', txt: () => t('tb_3', { b: t('create_profile') }), fim: { k: 'create_profile', fn: () => ACT.novoPerfil() } },
  ],
  app: () => {
    const est = estadoHoje(S.me), hoje = tourAba('hoje'), abre = () => t(Tour.revendo ? 'ta_volta' : 'ta_pronto') + ' ';
    const passoHoje = est === 'normal' ? { alvo: '[data-a="iniciar"]', txt: () => t('ta_hoje', { t: t('tab_today'), b: t('start_workout') }) }
      : est === 'sem' ? { alvo: '#view .hero .btn.big', txt: () => t('ta_hoje_sem', { t: t('tab_today') }) }
      : { alvo: '#tabs [data-tab="hoje"]', txt: () => t('ta_hoje_ger', { t: t('tab_today') }) };
    return [
      { antes: tourAba('plano'), alvo: '#tabs [data-tab="plano"]', txt: () => abre() + t('ta_plano', { t: t('tab_plan') }) },
      { antes: hoje, ...passoHoje },
      ...(est === 'normal' ? [{ antes: hoje, alvo: '[data-a="casaAbrir"]', txt: () => t('ta_dif', { b: t('dif_btn') }) }] : []),
      { antes: tourAba('cardio'), alvo: '#tabs [data-tab="cardio"]', txt: () => t('ta_cardio', { t: t('cardio') }) },
      { antes: tourAba('coach'), alvo: '#tabs [data-tab="coach"]', txt: () => t(AI.on ? 'ta_coach' : 'ta_coach_key', { t: t('tab_coach') }) },
      { antes: tourAba('jornada'), alvo: '#tabs [data-tab="jornada"]', txt: () => t('ta_jornada', { t: t('tab_journey') }) },
      { antes: hoje, alvo: '#langBtn', txt: () => t(est === 'normal' ? 'ta_fim' : 'ta_fim2', { b: t('start_workout') }), fim: { k: 'tour_done' } },
    ];
  },
  treino: () => [
    { antes: tourTopo, alvo: '#ex-0 .ex-top', txt: () => t('tt_1') },
    { alvo: '#ex-0 .rule', opcional: true, txt: () => t('tt_teste') },
    { alvo: '#ex-0 .set', opcional: true, txt: () => t('tt_serie') },
    { alvo: '#ex-0 .set .ck', opcional: true, txt: () => t('tt_ok') },
    { alvo: '#ex-0 .ex-actions', txt: () => t('tt_acoes', { a: t('how_to'), p: t('exq_btn'), s: t('swap') }) },
    { alvo: '#wkHead [data-a="finalizar"]', txt: () => t('tt_fim', { b: t('finish') }), fim: { k: 'tour_go', fn: tourTopo } },
  ],
  cardio: () => [
    { antes: tourTopo, alvo: '#view .hero .seg', txt: () => t('tc_1', { a: t('mode_train'), b: t('mode_watch'), c: t('mode_listen') }) },
    { alvo: '#sgCard .sg-head', opcional: true, txt: () => t('tc_sug', { b: t('sg_other') }) },
    { antes: tourTopo, alvo: '#view .hero [data-a="cardioGuia"]', opcional: true, txt: () => t('tc_alvo', { b: t('cg_btn') }) },
    { txt: () => t('tc_2'), fim: { k: 'tour_go' } },
  ],
  /* people who already knew the cardio studio hear about the machine numbers once */
  cardioAlvo: () => [
    { antes: tourTopo, alvo: '#view .hero [data-a="cardioGuia"]', txt: () => t('tc_alvo_novo', { b: t('cg_btn') }) },
    { alvo: '#sgCard .sg-head', opcional: true, txt: () => t('tc_sug_novo', { b: t('sg_other') }) },
  ],
  /* and those who already heard about the machine numbers hear about the coach's pick */
  cardioSug: () => [
    { antes: tourTopo, alvo: '#sgCard .sg-head', txt: () => t('tc_sug_novo', { b: t('sg_other') }) },
  ],
  /* the first time an exercise stalls, in the workout */
  trava: () => [
    { alvo: '.trava', txt: () => t('tt_trava') },
  ],
  /* the first time a re-assessment is due, on Today */
  reav: () => [
    { alvo: '#reavCard', txt: () => t('tr_reav', { a: t('rv_do'), b: t('rv_later') }) },
  ],
  coach: () => [
    { antes: tourTopo, alvo: AI.on ? '#chat' : '#view .note.warn', txt: () => t(AI.on ? 'tq_1' : 'tq_key') },
    { alvo: '[data-a="ajustar"]', opcional: true, txt: () => t('tq_ajuste', { b: t('adj_title') }) },
  ],
  jornada: () => [
    { antes: () => { if (S.jsub === 'stats') { S.jsub = 'jornada'; render(); } tourTopo(); }, alvo: '.rpg-top [data-a="heroiEditar"]',
      txt: () => t('tj_heroi', { b: (($('.rpg-top [data-a="heroiEditar"]') || {}).textContent || t('hero_create')).trim() }) },
    { alvo: '.mapa-rpg .mp-hero', opcional: true, txt: () => t('tj_mapa') },
    { antes: tourTopo, alvo: '.subtabs [data-v="arsenal"]', opcional: true, txt: () => t('tj_arsenal', { b: t('sub_arsenal') }) },
  ],
  /* people who already knew the Journey hear about the Arsenal once */
  arsenal: () => [
    { antes: tourTopo, alvo: '.subtabs [data-v="arsenal"]', txt: () => t('tj_arsenal_novo', { b: t('sub_arsenal') }) },
  ],
};

/* ---------- when a tour opens by itself ---------- */
let tourT = 0;
function tourAgendar() { clearTimeout(tourT); tourT = setTimeout(tourAuto, 900); }
function tourAuto() {
  if (Tour.on || !S.ready || LS.get('ij_tour_off')) return;
  if (!$('#sheet').hidden || S.sub || (typeof P !== 'undefined' && P.on) || digitando()) return;
  tourMigrar();
  const pid = S.me;
  if (!pid || !S.perfis[pid]) { if (!tourViu('_', 'boas')) iniciarTour('boas'); return; }
  if (S.live) { if (S.tab === 'hoje' && !tourViu(pid, 'treino')) iniciarTour('treino'); else if (S.tab === 'hoje' && !tourViu(pid, 'trava') && $('.trava')) iniciarTour('trava'); return; }
  if (!tourViu(pid, 'app')) { if (progresso(pid) && (S.tab === 'hoje' || S.tab === 'plano')) iniciarTour('app'); return; }
  if (['cardio', 'coach', 'jornada'].includes(S.tab) && !tourViu(pid, S.tab)) iniciarTour(S.tab);
  else if (S.tab === 'jornada' && !tourViu(pid, 'arsenal')) iniciarTour('arsenal');
  else if (S.tab === 'cardio' && !tourViu(pid, 'cardioAlvo')) iniciarTour('cardioAlvo');
  else if (S.tab === 'cardio' && !tourViu(pid, 'cardioSug') && $('#sgCard')) iniciarTour('cardioSug');
  else if (S.tab === 'hoje' && !tourViu(pid, 'reav') && $('#reavCard')) iniciarTour('reav');
}
/* Settings: see it all again, starting from what fits the screen */
function tourRever() {
  closeSheet();
  const v = tourVistos();
  if (S.me) delete v[S.me];
  if (v._) delete v._.boas;
  LS.set('ij_tour', v);
  if (!S.me || !S.perfis[S.me]) iniciarTour('boas', true);
  else iniciarTour(S.live ? 'treino' : 'app', true);
}

/* ---------- showing it ---------- */
function iniciarTour(id, rever) {
  const def = TOURS[id];
  if (!def || Tour.on) return;
  Tour.revendo = !!rever;
  let passos = def();
  try { if (passos[0] && passos[0].antes) passos[0].antes(); } catch { /* the screen may not be there */ }
  passos = passos.filter(p => !p.opcional || tourAlvo(p));
  if (!passos.length) return;
  Object.assign(Tour, { on: true, id, chave: id === 'boas' ? '_' : S.me, passos, i: 0, foco: document.activeElement });
  let el = $('#tour');
  if (!el) {
    el = document.createElement('div');
    el.id = 'tour'; el.className = 'tour';
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    document.body.appendChild(el);
  }
  el.setAttribute('aria-label', t('tour_label'));
  el.innerHTML = `<div class="tour-furo" id="tourFuro" hidden></div><div class="tour-caixa baixo" id="tourCaixa"><div class="tour-mentor" aria-hidden="true">${lpcHTML(MENTOR, { parado: true, esc: 2, cls: 'respira' })}</div><div class="tour-fala" id="tourFala"></div></div>`;
  el.hidden = false;
  TOUR_INERTES.forEach(s => { const x = $(s); if (x) x.inert = true; });
  document.documentElement.style.overflow = 'hidden';
  addEventListener('resize', tourReposicionar);
  addEventListener('scroll', tourReposicionar, { passive: true });
  tourMostrar();
}
function tourMostrar() {
  const p = Tour.passos[Tour.i], fala = $('#tourFala');
  if (!p || !fala) { tourFechar(true); return; }
  try { if (p.antes) p.antes(); } catch { /* keep going with what is on screen */ }
  const n = Tour.passos.length, ult = Tour.i === n - 1;
  /* the language question doesn't count as a step */
  const num = Tour.passos.slice(0, Tour.i + 1).filter(x => !x.lang).length, tot = Tour.passos.filter(x => !x.lang).length;
  const pular = ult ? '' : `<button class="tour-pular" data-a="tourPular">${esc(t('tour_skip'))}</button>`;
  if (p.lang) {
    clearInterval(Tour.tick); Tour.digitando = false;
    fala.innerHTML = `<div class="tour-cab"><b class="tour-nome">${esc(t('mentor_name'))}</b>${pular}</div>
      <p class="tour-txt"><b>Hello! · Olá! · ¡Hola!</b><br><span class="tour-sub">Choose your language · Escolha o seu idioma · Elige tu idioma</span></p>
      <div class="tour-lang">${LANGS.map(([c, nome]) => `<button class="btn" data-a="tourLang" data-v="${c}" lang="${LANGS.find(l => l[0] === c)[2]}">${esc(nome)}</button>`).join('')}</div>`;
  } else {
    const txt = p.txt();
    const voltar = Tour.i > 0 ? `<button class="btn ghost small" data-a="tourVoltar">${esc(t('tour_back'))}</button>` : '';
    const prox = esc(ult ? t(p.fim ? p.fim.k : 'tour_done') : t('tour_next'));
    fala.innerHTML = `<div class="tour-cab"><b class="tour-nome">${esc(t('mentor_name'))}</b><span class="tour-n num">${esc(t('tour_n', { a: num, b: tot }))}</span>${pular}</div>
      <p class="tour-txt"><span class="fantasma" aria-hidden="true">${esc(txt)}</span><span class="digita" id="tourTxt" aria-hidden="true"></span></p>
      <p class="sr" aria-live="polite">${esc(txt)}</p>
      <div class="tour-bts">${voltar}<button class="btn small vai" data-a="tourProximo">${prox}</button></div>`;
    digitar(txt);
  }
  requestAnimationFrame(() => { tourPosicionar(true); requestAnimationFrame(() => tourPosicionar(false)); });
  /* focus goes to the box, not to a button: a ring on "English" would look like an answer already chosen */
  fala.tabIndex = -1;
  try { fala.focus({ preventScroll: true }); } catch { /* old browser */ }
}
/* the text appears like an RPG dialog, in about a second (all at once with reduced motion) */
function digitar(txt) {
  clearInterval(Tour.tick);
  const el = $('#tourTxt');
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = txt; Tour.digitando = false; return; }
  let n = 0;
  const passo = Math.max(1, Math.ceil(txt.length / 40));
  Tour.digitando = true; el.textContent = '';
  Tour.tick = setInterval(() => {
    const x = $('#tourTxt');
    if (!x) { clearInterval(Tour.tick); Tour.digitando = false; return; }
    n = Math.min(txt.length, n + passo);
    x.textContent = txt.slice(0, n);
    if (n >= txt.length) { clearInterval(Tour.tick); Tour.digitando = false; }
  }, 24);
}
function completarTexto() {
  if (!Tour.digitando) return;
  clearInterval(Tour.tick); Tour.digitando = false;
  const p = Tour.passos[Tour.i], x = $('#tourTxt');
  if (x && p && p.txt) x.textContent = p.txt();
}
function tourAlvo(p) {
  if (!p || !p.alvo) return null;
  const el = document.querySelector(p.alvo);
  return el && el.getClientRects().length ? el : null;
}
/* the hole around the target, the box on the other side, the page scrolled so both fit */
function tourPosicionar(rolar) {
  if (!Tour.on) return;
  const raiz = $('#tour'), furo = $('#tourFuro'), cx = $('#tourCaixa');
  if (!raiz || !furo || !cx) return;
  const el = tourAlvo(Tour.passos[Tour.i]);
  if (!el) { furo.hidden = true; raiz.classList.add('sem-alvo'); cx.classList.remove('cima', 'baixo'); cx.classList.add('meio'); return; }
  raiz.classList.remove('sem-alvo'); furo.hidden = false; cx.classList.remove('meio');
  const vh = innerHeight, fixo = !!el.closest('#tabs, header.top, #wkHead');
  let lado = fixo && el.getBoundingClientRect().top > vh / 2 ? 'cima' : 'baixo';
  cx.classList.toggle('cima', lado === 'cima'); cx.classList.toggle('baixo', lado === 'baixo');
  if (!fixo && rolar) {
    const topo = Math.max(0, ...['header.top', '#wkHead'].map(s => { const x = $(s); return x && x.getClientRects().length ? x.getBoundingClientRect().bottom : 0; }));
    const base = cx.getBoundingClientRect().top, r = el.getBoundingClientRect();
    const quer = topo + 12 + Math.max(0, (base - topo - 24 - r.height) / 2);
    if (Math.abs(r.top - quer) > 4) window.scrollBy(0, r.top - quer);
  }
  const r = el.getBoundingClientRect();
  if (!fixo && lado === 'baixo') {
    const c = cx.getBoundingClientRect();
    if (r.bottom > c.top - 6 && r.top > c.height + 30) { lado = 'cima'; cx.classList.replace('baixo', 'cima'); }
  }
  const pad = 6, x0 = Math.max(4, r.left - pad), y0 = Math.max(4, r.top - pad);
  Object.assign(furo.style, { left: x0 + 'px', top: y0 + 'px', width: Math.min(innerWidth - 4, r.right + pad) - x0 + 'px', height: Math.min(vh - 4, r.bottom + pad) - y0 + 'px' });
}
let tourRaf = 0;
function tourReposicionar() { cancelAnimationFrame(tourRaf); tourRaf = requestAnimationFrame(() => tourPosicionar(false)); }
function tourProximo() {
  if (!Tour.on) return;
  if (Tour.i >= Tour.passos.length - 1) { tourFechar(true); return; }
  Tour.i++; tourMostrar();
}
function tourVoltar() { if (Tour.on && Tour.i > 0) { Tour.i--; tourMostrar(); } }
function tourLang(code) {
  if (!LANGS.some(l => l[0] === code)) return;
  trocarIdioma(code);
  if (!Tour.on) return;
  $('#tour').setAttribute('aria-label', t('tour_label'));
  tourProximo();
}
/* done or skipped: either way it doesn't open by itself again */
function tourFechar(fim) {
  if (!Tour.on) return;
  const p = Tour.passos[Tour.i], id = Tour.id;
  clearInterval(Tour.tick); Tour.digitando = false; Tour.on = false;
  tourMarcar(Tour.chave || '_', id);
  if (id === 'jornada') tourMarcar(Tour.chave || '_', 'arsenal'); /* the Journey tour already showed the Arsenal */
  if (id === 'cardio') tourMarcar(Tour.chave || '_', 'cardioAlvo'); /* and the cardio tour the machine numbers */
  if (id === 'cardio' || id === 'cardioAlvo') tourMarcar(Tour.chave || '_', 'cardioSug'); /* and the coach's pick */
  removeEventListener('resize', tourReposicionar);
  removeEventListener('scroll', tourReposicionar);
  TOUR_INERTES.forEach(s => { const x = $(s); if (x) x.inert = false; });
  const el = $('#tour');
  if (el) { el.hidden = true; el.innerHTML = ''; }
  if ((typeof P === 'undefined' || !P.on) && $('#sheet').hidden) document.documentElement.style.overflow = '';
  if (id === 'app') tourAba('hoje')();
  if (fim && p && p.fim && p.fim.fn) { p.fim.fn(); return; }
  const f = Tour.foco;
  if (f && f.isConnected && f.focus) try { f.focus({ preventScroll: true }); } catch { /* gone */ }
}
