/* ---------- Cardio Studio: guided protocols, Watch and Listen modes ---------- */
const SEG = {
  warm: { n: ['Warm-up', 'Aquecimento', 'Calentamiento'], h: ['Effort 3–4 of 10', 'Esforço 3–4 de 10', 'Esfuerzo 3–4 de 10'], cor: 'var(--plate-blue)', fg: 'var(--on-plate)', z: 'leve' },
  easy: { n: ['Easy', 'Leve', 'Suave'], h: ['Effort 4–5 · you can talk', 'Esforço 4–5 · dá para conversar', 'Esfuerzo 4–5 · puedes hablar'], cor: 'var(--plate-green)', fg: 'var(--on-plate)', z: 'leve' },
  rest: { n: ['Recover', 'Recupera', 'Recupera'], h: ['Slow right down and breathe', 'Desacelere e respire', 'Baja el ritmo y respira'], cor: 'var(--plate-green)', fg: 'var(--on-plate)', z: '' },
  tempo: { n: ['Tempo', 'Ritmo', 'Ritmo'], h: ['Effort 6–7 · short sentences', 'Esforço 6–7 · frases curtas', 'Esfuerzo 6–7 · frases cortas'], cor: 'var(--plate-red)', fg: 'var(--on-plate)', z: '' },
  work: { n: ['Hard', 'Forte', 'Fuerte'], h: ['Effort 8–9 of 10', 'Esforço 8–9 de 10', 'Esfuerzo 8–9 de 10'], cor: 'var(--plate-red)', fg: 'var(--on-plate)', z: 'forte' },
  max: { n: ['All out', 'Tudo!', '¡A tope!'], h: ['Effort 10 · as hard as you safely can', 'Esforço 10 · o máximo com segurança', 'Esfuerzo 10 · al máximo con seguridad'], cor: 'var(--plate-yellow)', fg: 'var(--on-yellow)', z: 'forte' },
  surge: { n: ['Surge!', 'Arrancada!', '¡Acelera!'], h: ['Push hard until the next beep', 'Acelere forte até o próximo bipe', 'Acelera fuerte hasta el próximo pitido'], cor: 'var(--plate-yellow)', fg: 'var(--on-yellow)', z: 'forte' },
  climb: { n: ['Incline {v}%', 'Inclinação {v}%', 'Pendiente {v}%'], h: ['Brisk walk, hands off the rails', 'Caminhada firme, sem segurar no apoio', 'Caminata firme, sin agarrarte'], cor: 'var(--plate-red)', fg: 'var(--on-plate)', z: 'leve' },
  cool: { n: ['Cool-down', 'Desaceleração', 'Vuelta a la calma'], h: ['Easy pace, let your heart rate drop', 'Ritmo leve, deixe o coração baixar', 'Ritmo suave, deja que baje el pulso'], cor: 'var(--plate-blue)', fg: 'var(--on-plate)', z: '' },
};
const seg = (k, s, v) => ({ k, s: Math.round(s), v });
const repetir = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).flat();
const PROTOCOLOS = [
  { id: 'z2', nivel: 'easy', modo: 'dur', def: 35, min: 15, max: 120, bpm: [120, 135], busca: 'zone 2 cardio', maq: ['bike', 'eliptico', 'esteira_inclinada', 'remo', 'caminhada'],
    nome: ['Zone 2', 'Zona 2', 'Zona 2'], desc: ['Steady and easy. Builds your aerobic base and burns fat without wrecking recovery.', 'Contínuo e leve. Constrói a base aeróbica e queima gordura sem atrapalhar a recuperação.', 'Continuo y suave. Construye la base aeróbica y quema grasa sin afectar la recuperación.'],
    build: m => [seg('warm', 300), seg('easy', (m - 8) * 60), seg('cool', 180)], de: m => m },
  { id: 'tempo', nivel: 'moderate', modo: 'dur', def: 30, min: 20, max: 60, bpm: [140, 155], busca: 'tempo run', maq: ['corrida_esteira', 'bike', 'remo', 'eliptico', 'corrida'],
    nome: ['Tempo', 'Tempo', 'Tempo'], desc: ['Comfortably hard and continuous. Raises the pace you can hold.', 'Forte, mas sustentável, sem parar. Aumenta o ritmo que você aguenta.', 'Fuerte pero sostenible, sin parar. Sube el ritmo que aguantas.'],
    build: m => [seg('warm', 360), seg('tempo', (m - 10) * 60), seg('cool', 240)], de: m => m },
  { id: 'h3030', nivel: 'hard', modo: 'rounds', def: 12, min: 6, max: 20, bpm: [150, 170], busca: 'HIIT workout', maq: ['bike', 'remo', 'eliptico', 'corrida_esteira'],
    nome: ['HIIT 30/30', 'HIIT 30/30', 'HIIT 30/30'], desc: ['30 seconds hard, 30 easy. The friendliest way into HIIT.', '30 segundos forte, 30 leve. O jeito mais amigável de começar no HIIT.', '30 segundos fuerte, 30 suave. La forma más amable de empezar con HIIT.'],
    build: r => [seg('warm', 300), ...repetir(r, () => [seg('work', 30), seg('rest', 30)]), seg('cool', 240)], de: m => m - 9 },
  { id: 'h4020', nivel: 'hard', modo: 'rounds', def: 12, min: 6, max: 20, bpm: [150, 170], busca: 'HIIT workout', maq: ['bike', 'remo', 'eliptico', 'corda'],
    nome: ['HIIT 40/20', 'HIIT 40/20', 'HIIT 40/20'], desc: ['40 seconds hard, 20 easy. Short breaks, big conditioning boost.', '40 segundos forte, 20 leve. Pausa curta, condicionamento lá em cima.', '40 segundos fuerte, 20 suave. Pausas cortas, gran mejora de condición.'],
    build: r => [seg('warm', 300), ...repetir(r, () => [seg('work', 40), seg('rest', 20)]), seg('cool', 240)], de: m => m - 9 },
  { id: 'tabata', nivel: 'max', modo: 'blocos', def: 2, min: 1, max: 4, bpm: [160, 180], busca: 'tabata', maq: ['bike', 'remo', 'corda'],
    nome: ['Tabata', 'Tabata', 'Tabata'], desc: ['8 × 20 seconds all out, 10 seconds rest. Four brutal minutes per block.', '8 × 20 segundos no máximo, 10 de pausa. Quatro minutos intensos por bloco.', '8 × 20 segundos a tope, 10 de pausa. Cuatro minutos intensos por bloque.'],
    build: b => [seg('warm', 300), ...repetir(b, i => [...repetir(8, () => [seg('max', 20), seg('rest', 10)]), ...(i < b - 1 ? [seg('easy', 120)] : [])]), seg('cool', 240)], de: m => Math.round((m - 9) / 6) },
  { id: 'n4x4', nivel: 'hard', modo: 'rounds', def: 4, min: 2, max: 5, bpm: [150, 170], busca: 'running intervals', maq: ['bike', 'esteira_inclinada', 'remo', 'corrida_esteira'],
    nome: ['Norwegian 4×4', '4×4 norueguês', '4×4 noruego'], desc: ['4 minutes hard, 3 easy, four times. A classic for VO2max and heart health.', '4 minutos forte, 3 leve, quatro vezes. Clássico para VO2máx e saúde do coração.', '4 minutos fuerte, 3 suave, cuatro veces. Clásico para el VO2máx y la salud del corazón.'],
    build: r => [seg('warm', 360), ...repetir(r, () => [seg('work', 240), seg('rest', 180)]), seg('cool', 240)], de: m => Math.round((m - 10) / 7) },
  { id: 'piramide', nivel: 'hard', modo: 'blocos', def: 1, min: 1, max: 3, bpm: [150, 170], busca: 'HIIT workout', maq: ['bike', 'remo', 'eliptico', 'corrida_esteira'],
    nome: ['Pyramid', 'Pirâmide', 'Pirámide'], desc: ['30, 60, 90, 60, 30 seconds hard with equal recovery. Time flies.', '30, 60, 90, 60, 30 segundos forte com a mesma pausa. O tempo voa.', '30, 60, 90, 60, 30 segundos fuerte con la misma pausa. El tiempo vuela.'],
    build: b => [seg('warm', 300), ...repetir(b, () => [30, 60, 90, 60, 30].flatMap(s => [seg('work', s), seg('rest', s)])), seg('cool', 240)], de: m => Math.round((m - 9) / 9) },
  { id: 'sprint', nivel: 'max', modo: 'rounds', def: 6, min: 4, max: 10, bpm: [165, 185], busca: 'sprint workout', maq: ['bike', 'remo'],
    nome: ['Sprints', 'Sprints', 'Sprints'], desc: ['20 seconds all out, 2 minutes easy. Little time, huge effect. Best on a bike.', '20 segundos no máximo, 2 minutos leve. Pouco tempo, muito efeito. Melhor na bike.', '20 segundos a tope, 2 minutos suave. Poco tiempo, mucho efecto. Mejor en bici.'],
    build: r => [seg('warm', 360), ...repetir(r, () => [seg('max', 20), seg('rest', 120)]), seg('cool', 240)], de: m => Math.round((m - 10) / 2.33) },
  { id: 'fartlek', nivel: 'moderate', modo: 'dur', def: 30, min: 15, max: 120, bpm: [130, 160], busca: 'cardio workout', maq: ['bike', 'eliptico', 'esteira_inclinada', 'remo', 'corrida'],
    nome: ['Surprise surges', 'Arrancadas surpresa', 'Aceleraciones sorpresa'], desc: ['Easy pace with random pushes of 20–45 seconds. You never know when the next one comes.', 'Ritmo leve com arrancadas aleatórias de 20 a 45 segundos. Você nunca sabe quando vem a próxima.', 'Ritmo suave con aceleraciones al azar de 20 a 45 segundos. Nunca sabes cuándo llega la siguiente.'],
    build: m => { const out = [seg('warm', 300)]; let left = (m - 8) * 60; while (left > 60) { const e = Math.min(left, 150 + Math.round(Math.random() * 150)); out.push(seg('easy', e)); left -= e; if (left < 45) break; const s = 20 + Math.round(Math.random() * 25); out.push(seg('surge', s)); left -= s; } if (left > 0) out.push(seg('easy', left)); out.push(seg('cool', 180)); return out; }, de: m => m },
  { id: 'ladeira', nivel: 'moderate', modo: 'dur', def: 30, min: 15, max: 60, bpm: [115, 130], busca: 'incline walk', maq: ['esteira_inclinada'],
    nome: ['Incline ladder', 'Ladeira na esteira', 'Escalera de pendiente'], desc: ['Treadmill walk where the incline climbs every 3 minutes, then comes back down.', 'Caminhada na esteira em que a inclinação sobe a cada 3 minutos e depois desce.', 'Caminata en cinta donde la pendiente sube cada 3 minutos y luego baja.'],
    build: m => { const n = Math.max(2, Math.floor((m - 7) / 3)), sobe = Math.ceil(n / 2); const inc = i => Math.min(15, 2 + 2 * (i < sobe ? i : n - 1 - i)); return [seg('warm', 240), ...repetir(n, i => [seg('climb', 180, inc(i))]), seg('cool', 180)]; }, de: m => m },
  { id: 'cada5', oculto: true, nivel: 'moderate', modo: 'dur', def: 45, min: 15, max: 120, bpm: [125, 160], busca: 'cardio workout', maq: ['bike', 'eliptico', 'esteira_inclinada', 'remo'],
    nome: ['Push every 5 minutes', 'Arrancada a cada 5 minutos', 'Aceleración cada 5 minutos'], desc: ['4 minutes easy, 1 minute hard, on repeat.', '4 minutos leve, 1 minuto forte, repetindo.', '4 minutos suave, 1 minuto fuerte, en bucle.'],
    build: m => { const out = [seg('warm', 300)]; let left = (m - 8) * 60; while (left >= 300) { out.push(seg('easy', 240), seg('work', 60)); left -= 300; } if (left > 0) out.push(seg('easy', left)); out.push(seg('cool', 180)); return out; }, de: m => m },
];
const PROTO = Object.fromEntries(PROTOCOLOS.map(p => [p.id, p]));
const paramDe = (p, minutos) => clamp(Math.round(p.de(minutos)), p.min, p.max);
const totalSeg = segs => segs.reduce((n, s) => n + s.s, 0);
const NIVEL_LBL = { easy: ['Easy', 'Leve', 'Suave'], moderate: ['Moderate', 'Moderado', 'Moderado'], hard: ['Hard', 'Forte', 'Fuerte'], max: ['Max', 'Máximo', 'Máximo'] };
const ESFORCO_PADRAO = { easy: 4, moderate: 6, hard: 8, max: 9 };
const MUSICA = [
  ['Spotify', q => 'https://open.spotify.com/search/' + encodeURIComponent(q), 'com.spotify.music'],
  ['YouTube Music', q => 'https://music.youtube.com/search?q=' + encodeURIComponent(q), 'com.google.android.apps.youtube.music'],
  ['Deezer', q => 'https://www.deezer.com/search/' + encodeURIComponent(q), 'deezer.android.app'],
  ['Apple Music', q => 'https://music.apple.com/search?term=' + encodeURIComponent(q), 'com.apple.android.music'],
  ['Amazon Music', q => 'https://music.amazon.com/search/' + encodeURIComponent(q), 'com.amazon.mp3'],
];
const VIDEO = [['Netflix', 'https://www.netflix.com/', 'com.netflix.mediaclient'], ['Prime Video', 'https://www.primevideo.com/', 'com.amazon.avod.thirdpartyclient'], ['Disney+', 'https://www.disneyplus.com/', 'com.disney.disneyplus'], ['HBO Max', 'https://www.hbomax.com/', 'com.wbd.stream'], ['Globoplay', 'https://globoplay.globo.com/', 'com.globo.globotv'], ['YouTube', 'https://www.youtube.com/', 'com.google.android.youtube'], ['Crunchyroll', 'https://www.crunchyroll.com/', 'com.crunchyroll.crunchyroid'], ['Apple TV+', 'https://tv.apple.com/', 'com.apple.atve.androidtv.appletv']];
const CONTEUDOS = [['ep22', 22, ['Comedy episode', 'Episódio de comédia', 'Episodio de comedia']], ['ep45', 45, ['Drama episode', 'Episódio de série', 'Episodio de serie']], ['filme', 100, ['Movie', 'Filme', 'Película']]];
Object.assign(STR, {
  studio: ['Cardio Studio', 'Estúdio de Cardio', 'Estudio de Cardio'],
  studio_title: ['Sweat to your show or your playlist', 'Sue no ritmo da sua série ou da sua playlist', 'Suda al ritmo de tu serie o tu playlist'],
  mode_train: ['Train', 'Treinar', 'Entrenar'], mode_watch: ['Watch', 'Assistir', 'Ver'], mode_listen: ['Listen', 'Ouvir', 'Escuchar'],
  start: ['Start', 'Começar', 'Empezar'],
  min_total: ['{n} min', '{n} min', '{n} min'],
  rounds: ['Rounds', 'Rodadas', 'Rondas'], blocks: ['Blocks', 'Blocos', 'Bloques'], minutes: ['Minutes', 'Minutos', 'Minutos'],
  machine: ['Machine', 'Aparelho', 'Máquina'],
  sound_cues: ['Beeps and vibration', 'Bipes e vibração', 'Pitidos y vibración'],
  on: ['On', 'Ligado', 'Activado'], off: ['Off', 'Desligado', 'Desactivado'],
  your_plan_cardio: ['From your plan this week', 'Do seu plano nesta semana', 'De tu plan esta semana'],
  start_guided: ['Start guided', 'Começar guiado', 'Empezar guiado'],
  log_without: ['Log cardio without the timer', 'Registrar cardio sem o cronômetro', 'Registrar cardio sin el cronómetro'],
  what_watching: ['What are you watching?', 'O que você vai assistir?', '¿Qué vas a ver?'],
  custom_len: ['Length', 'Duração', 'Duración'],
  style: ['Style', 'Estilo', 'Estilo'],
  watch_tip: ['Watch on the TV or tablet and leave your phone on the machine. The whole screen turns red for hard parts and green for easy ones, with beeps and vibration, so you can keep your eyes on the show. On Android you can also split the screen.', 'Assista na TV ou no tablet e deixe o celular no aparelho. A tela inteira fica vermelha nas partes fortes e verde nas leves, com bipes e vibração, para você não tirar o olho da série. No Android também dá para dividir a tela.', 'Mira en la TV o la tablet y deja el móvil en la máquina. Toda la pantalla se pone roja en las partes fuertes y verde en las suaves, con pitidos y vibración, para que no apartes la vista de la serie. En Android también puedes dividir la pantalla.'],
  open_streaming: ['Open your streaming app', 'Abra seu streaming', 'Abre tu streaming'],
  links_note: ['Opens in a new tab or in the app, if it is installed.', 'Abre numa nova aba ou no app, se ele estiver instalado.', 'Se abre en una pestaña nueva o en la app, si está instalada.'],
  pick_protocol: ['Pick a workout', 'Escolha o treino', 'Elige el entrenamiento'],
  music_for: ['Music that fits', 'Música que combina', 'Música que encaja'],
  bpm_hint: ['Songs around this tempo match your pace. Tap a service to see playlists already filtered.', 'Músicas nesse ritmo combinam com o seu passo. Toque num serviço para ver playlists já filtradas.', 'Canciones a este ritmo encajan con tu paso. Toca un servicio para ver listas ya filtradas.'],
  listen_tip: ['Start the music first: it keeps playing in the background while this screen shows the timer.', 'Comece a música primeiro: ela continua tocando em segundo plano enquanto esta tela mostra o cronômetro.', 'Pon la música primero: sigue sonando en segundo plano mientras esta pantalla muestra el cronómetro.'],
  max_note: ['Max-effort intervals: warm up well. Skip them if you have a heart condition, and stop if you feel chest pain or dizziness.', 'Intervalos no máximo: aqueça bem. Evite se tiver problema no coração e pare se sentir dor no peito ou tontura.', 'Intervalos al máximo: calienta bien. Evítalos si tienes un problema cardíaco y para si sientes dolor en el pecho o mareo.'],
  round_x: ['Round {a} of {b}', 'Rodada {a} de {b}', 'Ronda {a} de {b}'],
  next_x: ['Next: {s} · {t}', 'Depois: {s} · {t}', 'Después: {s} · {t}'],
  last_part: ['Last part', 'Última parte', 'Última parte'],
  pause: ['Pause', 'Pausar', 'Pausa'], resume: ['Resume', 'Seguir', 'Seguir'], skip: ['Skip', 'Pular', 'Saltar'], finish: ['Finish', 'Encerrar', 'Terminar'],
  sound: ['Sound', 'Som', 'Sonido'], paused: ['Paused', 'Pausado', 'En pausa'],
  done_title: ['Done! Great work.', 'Pronto! Mandou bem.', '¡Listo! Buen trabajo.'],
  hr_range: ['{a}–{b} bpm', '{a}–{b} bpm', '{a}–{b} lpm'],
  resume_player: ['Resume the cardio you started?', 'Retomar o cardio que você começou?', '¿Retomar el cardio que empezaste?'],
});

/* ---------- studio screen ---------- */
function protoCard(p) {
  const total = Math.round(totalSeg(p.build(p.def)) / 60);
  return `<button class="proto" data-a="protoAbrir" data-id="${p.id}"><b>${esc(L3(p.nome))}</b><span class="tm num">${t('min_total', { n: total })}</span><span class="ds">${esc(L3(p.desc))}</span><span class="row" style="gap:6px"><span class="pill lvl-${p.nivel}">${esc(L3(NIVEL_LBL[p.nivel]))}</span><span class="xs muted">${esc(p.maq.slice(0, 3).map(id => exInfo(id).nome).join(' · '))}</span></span></button>`;
}
function servicos(lista, q) {
  return `<div class="svc-row">${lista.map(([n, u, pkg]) => `<a class="svc" href="${esc(typeof u === 'function' ? u(q) : u)}" data-pkg="${esc(pkg || '')}"${typeof u === 'function' ? ' data-url="1"' : ''} target="_blank" rel="noopener noreferrer">${esc(n)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`;
}
/* the installed app opens the streaming app itself (or its site when it isn't installed) */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a.svc[data-pkg]');
  if (!a || !Nat.on) return;
  e.preventDefault();
  Nat.call('openApp', { url: a.getAttribute('href'), pkg: a.dataset.pkg, preferUrl: !!a.dataset.url }).catch(() => toast(t('cant_open')));
});
const svcEscolhido = () => { const v = LS.get('ij_svc'); return VIDEO.find(x => x[0] === v) || null; };
function stepperHTML(acao, valor, rotulo, extra) {
  return `<div class="stack"><p class="eyebrow">${esc(rotulo)}</p><div class="stepper"><button data-a="${acao}" data-d="-1" aria-label="−">−</button><span class="v num">${valor}</span><button data-a="${acao}" data-d="1" aria-label="+">+</button></div>${extra || ''}</div>`;
}
function maquinasHTML(sel, ids, acao) {
  return `<div class="chips">${ids.map(id => `<button class="chip" data-a="${acao}" data-v="${id}" aria-pressed="${sel === id}">${esc(exInfo(id).nome)}</button>`).join('')}</div>`;
}
function estudioState() {
  if (!S.estudio) {
    const p = perfil() || {};
    S.estudio = { modo: 'treinar', conteudo: 'ep22', minutos: 22, estilo: p.nivel === 'iniciante' ? 'fartlek' : 'h3030', rodadas: null, encher: true, maqW: (p.cardioModos || []).find(id => PROTO.fartlek.maq.includes(id)) || 'bike', protoL: 'h3030' };
  }
  return S.estudio;
}
/* a session the size of the episode: the chosen workout, then easy cardio until the credits if it ends early */
function montarAssistir(st) {
  const p = PROTO[st.estilo], alvo = st.minutos * 60;
  const param = p.modo === 'dur' ? clamp(st.minutos, p.min, Math.max(p.max, 180)) : clamp(st.rodadas != null ? st.rodadas : Math.min(p.def, paramDe(p, st.minutos)), p.min, p.max);
  const segs = p.build(param);
  const base = totalSeg(segs);
  let extra = 0;
  if (p.modo !== 'dur' && st.encher && base < alvo - 60) {
    extra = alvo - base;
    const iCool = segs.map(s => s.k).lastIndexOf('cool');
    segs.splice(iCool < 0 ? segs.length : iCool, 0, seg('easy', extra));
  }
  return { segs, param, base, extra };
}
function iniciarAssistir() {
  const st = estudioState(), p = PROTO[st.estilo], m = montarAssistir(st), sv = Nat.on ? svcEscolhido() : null;
  iniciarPlayer({ id: p.id, maq: st.maqW, sessao: '', layout: 'baixo', titulo: L3(p.nome) + ' · ' + exInfo(st.maqW).nome, segs: m.segs });
  if (sv) setTimeout(() => Nat.call('openApp', { url: sv[1], pkg: sv[2] }).catch(() => toast(t('cant_open'))), 1200);
}
Object.assign(STR, {
  workout_l: ['Workout', 'Treino', 'Entrenamiento'],
  fill_easy: ['Easy cardio until the episode ends', 'Cardio leve até o episódio acabar', 'Cardio suave hasta que acabe el episodio'],
  resumo_fill: ['{p}: {a} min + {b} min easy = {c} min', '{p}: {a} min + {b} min leve = {c} min', '{p}: {a} min + {b} min suave = {c} min'],
  resumo_plain: ['{p}: {a} min', '{p}: {a} min', '{p}: {a} min'],
  pip_tip: ['Only have your phone? Start the episode, then come back here: most streaming apps keep the video playing in a small floating window (picture-in-picture). Split screen works too. If the window doesn\'t show up, turn on "Picture-in-picture" in the streaming app\'s settings. The timer sits in the lower half, so the video fits on top.', 'Só tem o celular? Dê play no episódio e volte para cá: a maioria dos apps de streaming deixa o vídeo numa janelinha flutuante (picture-in-picture). A tela dividida também funciona. Se a janelinha não aparecer, ative "Picture-in-picture" nas configurações do app de streaming. O cronômetro fica na metade de baixo, para o vídeo caber em cima.', '¿Solo tienes el móvil? Dale play al episodio y vuelve aquí: la mayoría de las apps de streaming mantienen el video en una ventanita flotante (picture-in-picture). La pantalla dividida también funciona. Si la ventanita no aparece, activa "Picture-in-picture" en los ajustes de la app de streaming. El cronómetro queda en la mitad de abajo para que el video quepa arriba.'],
  colors_tip: ['The whole screen turns red for hard parts and green for easy ones, with beeps and vibration, so you can keep watching.', 'A tela inteira fica vermelha nas partes fortes e verde nas leves, com bipe e vibração, para você continuar assistindo.', 'Toda la pantalla se pone roja en las partes fuertes y verde en las suaves, con pitidos y vibración, para que sigas viendo.'],
});
function viewCardio() {
  const st = estudioState(), ci = cardioSemanaInfo(S.me), z = zonasFC((perfil() || {}).idade);
  const doPlano = ci.sessoes.length ? `<div class="card pad stack"><div class="row between"><h2 class="h3">${t('your_plan_cardio')}</h2><span class="small muted num">${Math.min(ci.feitos, ci.meta)} / ${ci.meta}</span></div>
    ${ci.sessoes.map((c, k) => { const a = cardioAlvo(c, ci.pr.sem), p = PROTO[c.protocolo] || PROTO.z2; return `<div class="exitem"><span class="nm">${esc(c.nome)} <span class="pill lvl-${p.nivel}">${esc(L3(p.nome))}</span></span><span class="sg num">${a.minutosAlvo} min</span><span class="mt">${esc(c.intensidade)}${c.quando ? ' · ' + esc(c.quando) : ''}</span><button class="btn small" data-a="protoAbrir" data-id="${p.id}" data-k="${k}" style="grid-column:1/-1;justify-self:start">${t('start_guided')}</button></div>`; }).join('')}</div>` : '';
  let corpo = '';
  if (st.modo === 'treinar') {
    corpo = `<div class="stack">${PROTOCOLOS.filter(p => !p.oculto).map(protoCard).join('')}</div>`;
  } else if (st.modo === 'assistir') {
    const p = PROTO[st.estilo], m = montarAssistir(st);
    const total = Math.round(totalSeg(m.segs) / 60), base = Math.round(m.base / 60), extra = Math.round(m.extra / 60);
    const maqs = [...new Set([...p.maq, ...PROTO.fartlek.maq])];
    corpo = `<div class="card pad stack">
      <p class="eyebrow">${t('what_watching')}</p>
      <div class="chips">${CONTEUDOS.map(([id, mins, n]) => `<button class="chip" data-a="stConteudo" data-v="${id}" aria-pressed="${st.conteudo === id}">${esc(L3(n))} · ${mins} min</button>`).join('')}</div>
      ${stepperHTML('stMin', st.minutos + ' min', t('custom_len'))}
      <p class="eyebrow">${t('workout_l')}</p>
      <div class="chips">${PROTOCOLOS.map(x => `<button class="chip" data-a="stEstilo" data-v="${x.id}" aria-pressed="${st.estilo === x.id}">${esc(L3(x.nome))}</button>`).join('')}</div>
      <p class="small muted">${esc(L3(p.desc))}</p>
      ${p.modo !== 'dur' ? stepperHTML('stRod', m.param, p.modo === 'blocos' ? t('blocks') : t('rounds')) + `<div class="row between"><span class="small">${t('fill_easy')}</span><button class="chip" data-a="stEncher" aria-pressed="${st.encher}">${st.encher ? t('on') : t('off')}</button></div>` : ''}
      <div class="note num">${esc(m.extra ? t('resumo_fill', { p: L3(p.nome), a: base, b: extra, c: total }) : t('resumo_plain', { p: L3(p.nome), a: total }))}</div>
      ${p.nivel === 'max' || p.nivel === 'hard' ? `<p class="xs muted">${t('max_note')}</p>` : ''}
      <p class="eyebrow">${t('machine')}</p>${maquinasHTML(st.maqW, maqs, 'stMaq')}
      <div class="row between"><span class="small">${t('alerts')}</span><button class="chip" data-a="somToggle" aria-pressed="true">${nomeAlerta()}</button></div>
      <button class="btn ghost block" data-a="testarSom">${t('test_sound')}</button>
      ${Nat.on ? `<p class="eyebrow">${t('open_with')}</p>
      <div class="chips">${VIDEO.map(([n]) => `<button class="chip" data-a="svcSel" data-v="${esc(n)}" aria-pressed="${!!svcEscolhido() && svcEscolhido()[0] === n}">${esc(n)}</button>`).join('')}<button class="chip" data-a="svcSel" data-v="" aria-pressed="${!svcEscolhido()}">${t('none_svc')}</button></div>` : ''}
      <button class="btn big block" data-a="stIniciarW">${t('start')} · ${t('min_total', { n: total })}${Nat.on && svcEscolhido() ? ' · ' + esc(svcEscolhido()[0]) : ''}</button>
      ${Nat.on ? `<p class="small muted">${esc(t('watch_native_tip', { s: svcEscolhido() ? svcEscolhido()[0] : t('your_show') }))}</p>` : `<p class="small muted">${t('pip_tip')}</p><p class="small muted">${t('colors_tip')}</p>`}
    </div>
    ${Nat.on ? '' : `<div class="card pad stack"><h2 class="h3">${t('open_streaming')}</h2>${servicos(VIDEO)}<p class="xs muted">${t('links_note')}</p></div>`}`;
  } else {
    const p = PROTO[st.protoL];
    corpo = `<div class="card pad stack">
      <p class="eyebrow">${t('pick_protocol')}</p>
      <div class="chips">${PROTOCOLOS.filter(x => !x.oculto).map(x => `<button class="chip" data-a="stProtoL" data-v="${x.id}" aria-pressed="${st.protoL === x.id}">${esc(L3(x.nome))}</button>`).join('')}</div>
      <div class="bpm"><b class="num">${p.bpm[0]}–${p.bpm[1]}</b><span class="muted">BPM · ${t('music_for').toLowerCase()}</span></div>
      <p class="small muted">${t('bpm_hint')}</p>
      ${servicos(MUSICA, `${p.busca} ${Math.round((p.bpm[0] + p.bpm[1]) / 2)} bpm`)}
      <p class="small muted">${t('listen_tip')}</p>
      <button class="btn big block" data-a="protoAbrir" data-id="${p.id}">${t('start')}: ${esc(L3(p.nome))}</button>
    </div>`;
  }
  return `<section class="screen">
    <div class="hero"><p class="eyebrow">${t('studio')}</p><h1 class="h-display h2">${t('studio_title')}</h1>
      <div class="seg">${[['treinar', 'mode_train'], ['assistir', 'mode_watch'], ['ouvir', 'mode_listen']].map(([m, k]) => `<button data-a="stModo" data-v="${m}" aria-pressed="${st.modo === m}">${t(k)}</button>`).join('')}</div>
      ${z ? `<p class="small muted num">${t('hr_zones', { a: z.leve[0], b: z.leve[1], c: z.forte[0], d: z.forte[1] })}</p>` : ''}
    </div>
    ${doPlano}
    ${corpo}
    <button class="btn ghost block" data-a="cardioAbrir">${t('log_without')}</button>
  </section>`;
}
Object.assign(STR, { hr_zones: ['Your heart rate: easy {a}–{b} bpm · hard {c}–{d} bpm', 'Seus batimentos: leve {a}–{b} bpm · forte {c}–{d} bpm', 'Tu pulso: suave {a}–{b} lpm · fuerte {c}–{d} lpm'] });

/* ---------- setup sheet ---------- */
function abrirProto(id, k) {
  const p = PROTO[id] || PROTO.z2, ci = cardioSemanaInfo(S.me);
  const c = k != null && k !== '' ? ci.sessoes[Number(k)] : null;
  const pref = (perfil() || {}).cardioModos || [];
  const maqs = c ? [...c.opcoes, ...p.maq.filter(m => !c.opcoes.includes(m))] : p.maq;
  S.setup = { id: p.id, param: c ? paramDe(p, cardioAlvo(c, ci.pr.sem).minutosAlvo) : p.def, maq: (c && c.opcoes[0]) || maqs.find(m => pref.includes(m)) || maqs[0], maqs, sessao: c ? c.nome : '' };
  openSheet(L3(p.nome), setupHTML());
}
function setupHTML() {
  const s = S.setup, p = PROTO[s.id];
  const total = Math.round(totalSeg(p.build(s.param)) / 60);
  const rot = p.modo === 'dur' ? t('minutes') : p.modo === 'blocos' ? t('blocks') : t('rounds');
  return `<div class="stack">
    <p class="small muted">${esc(L3(p.desc))}</p>
    ${stepperHTML('suParam', p.modo === 'dur' ? s.param + ' min' : s.param, rot, `<p class="small muted num">${t('min_total', { n: total })}</p>`)}
    <p class="eyebrow">${t('machine')}</p>${maquinasHTML(s.maq, s.maqs, 'suMaq')}
    <div class="row between"><span class="small">${t('alerts')}</span><button class="chip" data-a="somToggle" aria-pressed="true">${nomeAlerta()}</button></div>
    <button class="btn ghost block" data-a="testarSom">${t('test_sound')}</button>
    ${p.nivel === 'max' || p.nivel === 'hard' ? `<p class="xs muted">${t('max_note')}</p>` : ''}
    <button class="btn big block" data-a="suIniciar">${t('start')}</button>
  </div>`;
}

/* ---------- the player: full-screen color, huge numbers, beeps and vibration ---------- */
const P = { on: false, segs: [], ini: 0, pausa: 0, pausadoEm: 0, idx: -1, bip: '', meio: -1, t: null, cfg: null };
/* alerts: voice + beeps, beeps only, or vibration only */
const VOZ = {
  ok: () => { if (Nat.on) return true; try { return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function'; } catch { return false; } },
  falar(txt) {
    if (!vozLigada()) return;
    if (Nat.on) { Nat.safe('speak', { text: txt, lang: LOC(), duck: duckOn() }); return; }
    try {
      const u = new SpeechSynthesisUtterance(txt), lang = LOC().toLowerCase(), vs = speechSynthesis.getVoices() || [];
      u.lang = LOC(); u.rate = 1.05;
      const v = vs.find(x => (x.lang || '').toLowerCase() === lang) || vs.find(x => (x.lang || '').toLowerCase().startsWith(lang.slice(0, 2)));
      if (v) u.voice = v;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch { /* no voice here */ }
  },
};
const ALERTAS = ['voz', 'bipe', 'mudo'];
const alertaModo = () => { const m = LS.get('td_alerta'); return ALERTAS.includes(m) ? m : VOZ.ok() ? 'voz' : 'bipe'; };
const somLigado = () => alertaModo() !== 'mudo';
const vozLigada = () => alertaModo() === 'voz' && VOZ.ok();
const proximoAlerta = () => LS.set('td_alerta', ALERTAS[(ALERTAS.indexOf(alertaModo()) + 1) % ALERTAS.length]);
const nomeAlerta = () => t({ voz: 'al_voice', bipe: 'al_beeps', mudo: 'al_silent' }[alertaModo()]);
const duckOn = () => LS.get('ij_duck') !== false;
const FORTES = ['work', 'max', 'surge', 'tempo', 'climb'];
function durFala(s) {
  s = Math.round(s);
  if (s < 60) return t('v_seconds', { n: s });
  const m = Math.floor(s / 60), r = s % 60;
  if (!r) return m === 1 ? t('v_minute') : t('v_minutes', { n: m });
  return t('v_min_sec', { m, s: r });
}
function falaSeg(i) {
  const sg = P.segs[i], trab = P.segs.filter(s => FORTES.includes(s.k));
  const pos = P.segs.slice(0, i + 1).filter(s => FORTES.includes(s.k)).length;
  let pre = '';
  if (FORTES.includes(sg.k) && trab.length > 1) pre = (pos === trab.length ? t('v_last') : t('v_round', { a: pos, b: trab.length })) + ' ';
  return pre + rotuloSeg(sg).replace(/[!¡]/g, '') + ', ' + durFala(sg.s) + '.';
}
function testarSom() {
  unlockAudio();
  if (Nat.on) { if (somLigado()) Nat.safe('tone', { kind: 'strong' }); } else { tom(1046, 0.18); tom(1318, 0.3, 0.2); }
  vibrar([150]);
  if (alertaModo() === 'voz' && !VOZ.ok()) toast(t('voice_unavail'));
  else setTimeout(() => VOZ.falar(t('v_test')), 450);
}
Object.assign(STR, {
  open_with: ['Open with', 'Abrir com', 'Abrir con'], none_svc: ['Nothing', 'Nenhum', 'Nada'], your_show: ['your show', 'sua série', 'tu serie'],
  watch_native_tip: ['Tap Start: the timer starts and {s} opens. Watch full screen; the voice and beeps tell you when to push and when to recover. Pause, skip or finish from the notification.', 'Toque em Começar: o cronômetro liga e o {s} abre. Assista em tela cheia; a voz e os bipes avisam quando acelerar e quando recuperar. Pause, pule ou encerre pela notificação.', 'Toca Empezar: el cronómetro arranca y se abre {s}. Mira a pantalla completa; la voz y los pitidos te avisan cuándo apretar y cuándo recuperar. Pausa, salta o termina desde la notificación.'],
  cant_open: ['Couldn\'t open that app.', 'Não deu para abrir esse app.', 'No se pudo abrir esa app.'],
  notif_channel: ['Workout timer', 'Cronômetro do treino', 'Cronómetro del entrenamiento'], notif_done_text: ['Tap to log your cardio and collect your XP.', 'Toque para registrar o cardio e ganhar seu XP.', 'Toca para registrar el cardio y ganar tu XP.'],
  alerts: ['Alerts', 'Avisos', 'Avisos'], al_voice: ['Voice + beeps', 'Voz + bipes', 'Voz + pitidos'], al_beeps: ['Beeps only', 'Só bipes', 'Solo pitidos'], al_silent: ['Vibration only', 'Só vibração', 'Solo vibración'],
  test_sound: ['Test sound and voice', 'Testar som e voz', 'Probar sonido y voz'],
  v_test: ['Sound check. This is how you\'ll hear me during the workout.', 'Teste de som. É assim que você vai me ouvir durante o treino.', 'Prueba de sonido. Así me oirás durante el entrenamiento.'],
  voice_unavail: ['Voice alerts aren\'t available here, so you\'ll get beeps and vibration. They usually work when the app is opened in Chrome.', 'Os avisos por voz não estão disponíveis aqui, então você recebe bipes e vibração. Eles costumam funcionar com o app aberto no Chrome.', 'Los avisos por voz no están disponibles aquí, así que tendrás pitidos y vibración. Suelen funcionar con la app abierta en Chrome.'],
  v_seconds: ['{n} seconds', '{n} segundos', '{n} segundos'], v_minute: ['1 minute', '1 minuto', '1 minuto'], v_minutes: ['{n} minutes', '{n} minutos', '{n} minutos'], v_min_sec: ['{m} minutes {s} seconds', '{m} minutos e {s} segundos', '{m} minutos y {s} segundos'],
  v_round: ['Round {a} of {b}.', 'Rodada {a} de {b}.', 'Ronda {a} de {b}.'], v_last: ['Last round!', 'Última rodada!', '¡Última ronda!'], v_half: ['Halfway.', 'Metade.', 'Mitad.'],
  v_start: ['Let\'s go. {x}', 'Vamos lá. {x}', 'Vamos. {x}'], v_done: ['Workout complete. Great job!', 'Treino concluído. Mandou bem!', 'Entrenamiento completado. ¡Buen trabajo!'],
});
function tom(freq, dur, quando = 0, vol = 0.3) {
  try {
    if (!AC || !somLigado()) return;
    const o = AC.createOscillator(), g = AC.createGain(), t0 = AC.currentTime + quando;
    o.frequency.value = freq; o.connect(g); g.connect(AC.destination);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch { /* no sound */ }
}
const vibrar = padrao => { if (Nat.on) { Nat.safe('vibrate', { pattern: padrao }); return; } try { if (navigator.vibrate) navigator.vibrate(padrao); } catch { /* none */ } };
function iniciarPlayer(cfg, retomar) {
  unlockAudio();
  if (!cfg.sid) cfg.sid = 'c' + Date.now();
  P.cfg = cfg; P.segs = cfg.segs; P.on = true;
  if (retomar) { P.ini = retomar.ini; P.pausa = retomar.pausa; P.pausadoEm = retomar.pausadoEm; }
  else { P.ini = Date.now(); P.pausa = 0; P.pausadoEm = 0; }
  P.idx = -1; P.bip = ''; P.meio = -1;
  salvarPlayer();
  $('#player').className = 'player' + (cfg.layout === 'baixo' ? ' baixo' : '');
  $('#player').hidden = false; document.documentElement.style.overflow = 'hidden';
  $('#player').innerHTML = `<div class="pl-top"><span id="plNome"></span><span class="num" id="plTot"></span></div>
    <div class="pl-mid"><div class="pl-kind" id="plKind"></div><div class="pl-clock" id="plClock" role="timer"></div><div class="pl-hint" id="plHint"></div><div class="pl-round num" id="plRound"></div><div class="pl-next" id="plNext"></div></div>
    <div class="pl-bar" aria-hidden="true"><i id="plBar"></i></div>
    <div class="pl-ctrl"><button data-a="plPausa" id="plPausaBtn" class="main"></button><button data-a="plPular">${t('skip')}</button><button data-a="plSom" id="plSomBtn"></button><button data-a="plFim">${t('finish')}</button></div>`;
  $('#plNome').textContent = cfg.titulo;
  startWakeLock();
  P.nativo = Nat.on;
  if (P.nativo) {
    if (!retomar) Nat.safe('askNotif');
    Nat.call('start', planoNativo(!retomar)).catch(() => { P.nativo = false; });
  }
  clearInterval(P.t); P.t = setInterval(tickPlayer, 200); tickPlayer(true);
  if (!retomar && !P.nativo) setTimeout(() => { if (P.on && P.idx >= 0) VOZ.falar(t('v_start', { x: falaSeg(P.idx) })); }, 300);
}
const FORTES_R = ['work', 'max', 'surge', 'rest', 'climb'];
function rodadaSeg(i) {
  const trab = P.segs.filter(s => FORTES.includes(s.k)), sg = P.segs[i];
  const pos = P.segs.slice(0, i + 1).filter(s => FORTES.includes(s.k)).length;
  return trab.length > 1 && FORTES_R.includes(sg.k) ? t('round_x', { a: Math.max(pos, 1), b: trab.length }) : '';
}
function planoNativo(fresh) {
  return {
    kind: 'hiit', id: P.cfg.sid, title: P.cfg.titulo, mode: alertaModo(), lang: LOC(), duck: duckOn(), fresh,
    ini: P.ini, pausa: P.pausa, pausadoEm: P.pausadoEm,
    intro: t('v_start', { x: falaSeg(0) }), half: t('v_half'), done: t('v_done'),
    segs: P.segs.map((sg, i) => ({ s: sg.s, label: rotuloSeg(sg), say: i === 0 ? '' : falaSeg(i), strong: FORTES.includes(sg.k), round: rodadaSeg(i) })),
    labels: { next: t('next_x'), last: t('last_part'), paused: t('paused'), pause: t('pause'), resume: t('resume'), skip: t('skip'), stop: t('finish'), channel: t('notif_channel'), doneTitle: t('done_title'), doneText: t('notif_done_text') },
  };
}
function syncNativo() { if (P.on && P.nativo) Nat.safe('update', { ini: P.ini, pausa: P.pausa, pausadoEm: P.pausadoEm, mode: alertaModo(), duck: duckOn() }); }
/* what the phone's timer tells the page: pause, skip or finish pressed in the notification */
function eventoTimer(ev) {
  if (!ev) return;
  if (ev.kind === 'rest') { if (ev.type === 'stopped' && ev.by === 'notification') stopRest(true); return; }
  if (!P.on || !P.cfg || String(P.cfg.sid) !== String(ev.id)) return;
  if (ev.type === 'state') { P.ini = ev.ini; P.pausa = ev.pausa; P.pausadoEm = ev.pausadoEm; salvarPlayer(); tickPlayer(true); }
  else if (ev.type === 'stopped' && ev.by === 'notification') { P.ini = ev.ini; P.pausa = ev.pausa; P.pausadoEm = ev.endedAt || Date.now(); terminarPlayer(false); }
}
async function sincronizarDoNativo() {
  if (!P.on || !P.nativo) return;
  const ns = await Nat.safe('getState');
  if (!ns || !P.on || String(ns.id) !== String(P.cfg.sid)) return;
  P.ini = ns.ini; P.pausa = ns.pausa; P.pausadoEm = ns.ended ? (ns.endedAt || ns.pausadoEm) : ns.pausadoEm;
  if (ns.ended && !ns.complete) { terminarPlayer(false); return; }
  tickPlayer(true);
}
const decorrido = () => ((P.pausadoEm || Date.now()) - P.ini - P.pausa) / 1000;
const mmss = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + pad2(s % 60); };
const rotuloSeg = sg => L3(SEG[sg.k].n).replace('{v}', sg.v != null ? sg.v : '');
function tickPlayer(primeiro) {
  if (!P.on) return;
  const e = decorrido(), total = totalSeg(P.segs);
  let acc = 0, i = 0;
  for (; i < P.segs.length; i++) { if (e < acc + P.segs[i].s) break; acc += P.segs[i].s; }
  if (i >= P.segs.length) { terminarPlayer(true); return; }
  const sg = P.segs[i], resta = acc + sg.s - e, def = SEG[sg.k];
  if (i !== P.idx) {
    const mudou = P.idx !== -1;
    P.idx = i;
    const el = $('#player');
    el.style.setProperty('--seg-bg', def.cor); el.style.setProperty('--seg-fg', def.fg);
    $('#plKind').textContent = rotuloSeg(sg);
    const z = zonasFC((perfil() || {}).idade);
    const hr = z && def.z ? ' · ' + t('hr_range', { a: z[def.z][0], b: z[def.z][1] }) : '';
    $('#plHint').textContent = L3(def.h) + hr;
    const trabalhos = P.segs.filter(s => ['work', 'max', 'surge', 'tempo', 'climb'].includes(s.k));
    const pos = P.segs.slice(0, i + 1).filter(s => ['work', 'max', 'surge', 'tempo', 'climb'].includes(s.k)).length;
    $('#plRound').textContent = trabalhos.length > 1 && FORTES_R.includes(sg.k) ? t('round_x', { a: Math.max(pos, 1), b: trabalhos.length }) : '';
    const prox = P.segs[i + 1];
    $('#plNext').textContent = prox ? t('next_x', { s: rotuloSeg(prox), t: mmss(prox.s) }) : t('last_part');
    if (mudou && !primeiro) {
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    }
    if (mudou && !primeiro && !P.nativo) {
      const forte = FORTES.includes(sg.k);
      if (forte) { tom(1046, 0.18); tom(1318, 0.3, 0.2); vibrar([250, 90, 250, 90, 250]); } else { tom(523, 0.6); vibrar([600]); }
      const fala = falaSeg(i);
      setTimeout(() => VOZ.falar(fala), 450);
    }
  }
  const rs = Math.ceil(resta);
  if (rs <= 3 && rs >= 1 && sg.s >= 10 && P.bip !== i + ':' + rs && !P.pausadoEm) { P.bip = i + ':' + rs; if (!P.nativo) { tom(880, 0.12, 0, 0.22); vibrar([60]); } }
  if (sg.s >= 60 && P.meio !== i && resta <= sg.s / 2 && resta > sg.s / 2 - 2 && !P.pausadoEm) { P.meio = i; if (!P.nativo) VOZ.falar(t('v_half')); }
  $('#plClock').textContent = mmss(resta);
  $('#plClock').classList.toggle('pausado', !!P.pausadoEm);
  if (P.pausadoEm) $('#plHint').textContent = t('paused');
  else if ($('#plHint').textContent === t('paused')) { const z = zonasFC((perfil() || {}).idade), d = SEG[sg.k]; $('#plHint').textContent = L3(d.h) + (z && d.z ? ' · ' + t('hr_range', { a: z[d.z][0], b: z[d.z][1] }) : ''); }
  $('#plTot').textContent = mmss(e) + ' / ' + mmss(total);
  $('#plBar').style.width = clamp((e / total) * 100, 0, 100) + '%';
  $('#plPausaBtn').textContent = P.pausadoEm ? t('resume') : t('pause');
  $('#plSomBtn').textContent = nomeAlerta();
}
function salvarPlayer() { if (P.on) LS.set('td_player', { cfg: P.cfg, ini: P.ini, pausa: P.pausa, pausadoEm: P.pausadoEm, pid: S.me }); }
function pausarPlayer() {
  if (P.pausadoEm) { P.pausa += Date.now() - P.pausadoEm; P.pausadoEm = 0; } else P.pausadoEm = Date.now();
  salvarPlayer(); syncNativo(); tickPlayer(true);
}
function pularSeg() {
  const e = decorrido(); let acc = 0;
  for (const s of P.segs) { acc += s.s; if (e < acc) break; }
  P.ini -= (acc - e) * 1000 + 50; salvarPlayer(); syncNativo(); tickPlayer();
}
function terminarPlayer(completo) {
  const e = decorrido(), cfg = P.cfg;
  const nativo = P.nativo;
  P.on = false; P.nativo = false; clearInterval(P.t); LS.del('td_player');
  $('#player').hidden = true; $('#player').innerHTML = ''; document.documentElement.style.overflow = '';
  if (!S.live) stopWakeLock();
  if (nativo) {
    // the phone's timer plays the finish itself; it is only stopped when finishing early
    if (!completo) Nat.safe('stop', { kind: 'hiit' });
    setTimeout(() => Nat.safe('ack'), 4000);
  } else if (completo) { tom(784, 0.2); tom(988, 0.2, 0.22); tom(1318, 0.5, 0.44); vibrar([200, 80, 200, 80, 400]); setTimeout(() => VOZ.falar(t('v_done')), 700); }
  const minutos = Math.max(1, Math.round(e / 60));
  if (e < 30) return;
  const ini = P.ini || Date.now() - e * 1000;
  abrirCardio({ minutos, modo: cfg.maq, protocolo: cfg.id, esforco: ESFORCO_PADRAO[PROTO[cfg.id].nivel], sessao: cfg.sessao || '', titulo: completo ? t('done_title') : '', ini, fim: Math.min(Date.now(), ini + e * 1000 + (P.pausa || 0)) });
}
function iniciarDeConfig(id, param, maq, sessao) {
  const p = PROTO[id];
  iniciarPlayer({ id, maq, sessao, titulo: L3(p.nome) + ' · ' + exInfo(maq).nome, segs: p.build(param) });
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && P.on) { startWakeLock(); tickPlayer(); sincronizarDoNativo(); } });
async function retomarPlayerSalvo() {
  const sv = LS.get('td_player');
  if (!sv || !sv.cfg || sv.pid !== S.me) return;
  let ns = null;
  if (Nat.on && sv.cfg.sid) { ns = await Nat.safe('getState'); if (ns && String(ns.id) !== String(sv.cfg.sid)) ns = null; }
  if (ns && ns.running) { sv.ini = ns.ini; sv.pausa = ns.pausa; sv.pausadoEm = ns.pausadoEm; iniciarPlayer(sv.cfg, sv); return; }
  if (ns && ns.ended && Date.now() - (ns.endedAt || 0) < 12 * 3600000) {
    sv.ini = ns.ini; sv.pausa = ns.pausa; sv.pausadoEm = ns.endedAt || Date.now();
    iniciarPlayer(sv.cfg, sv);
    if (!ns.complete) terminarPlayer(false);
    return;
  }
  const fim = sv.ini + sv.pausa + totalSeg(sv.cfg.segs) * 1000;
  if (!sv.pausadoEm && Date.now() > fim + 600000) { LS.del('td_player'); return; }
  iniciarPlayer(sv.cfg, sv);
}
