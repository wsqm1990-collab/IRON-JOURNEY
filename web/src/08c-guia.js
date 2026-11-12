/* ---------- "How to": a guide for every exercise ----------
   Real videos from YouTube, and the personal trainer's full step-by-step lesson (grip, stance,
   range of motion, tempo, breathing, mistakes) written for this person with their AI key. */
Object.assign(STR, {
  guide_title: ['How to: {x}', 'Como fazer: {x}', 'Cómo hacer: {x}'],
  yt_videos: ['Watch videos on YouTube', 'Ver vídeos no YouTube', 'Ver vídeos en YouTube'],
  yt_q: ['{x} proper form tutorial', '{x} execução correta', '{x} técnica correcta'],
  main_muscle: ['Main muscle: {x}', 'Músculo principal: {x}', 'Músculo principal: {x}'],
  guide_ai_title: ['Your personal trainer explains', 'Seu personal explica', 'Tu entrenador explica'],
  guide_need_key: ['Add your AI key in Settings to get the full step-by-step lesson: grip and hand position, stance, range of motion, tempo, breathing and common mistakes.', 'Coloque sua chave de IA nas Configurações para ver a aula completa passo a passo: pegada e posição das mãos, posição do corpo, amplitude, ritmo, respiração e erros comuns.', 'Añade tu clave de IA en Ajustes para ver la lección completa paso a paso: agarre y posición de las manos, postura, recorrido, ritmo, respiración y errores comunes.'],
  guide_writing: ['Your personal trainer is writing the lesson…', 'Seu personal está escrevendo a aula…', 'Tu entrenador está escribiendo la lección…'],
  try_again: ['Try again', 'Tentar de novo', 'Reintentar'],
});
const ytURL = ex => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t('yt_q', { x: ex.nome }));
const Guia = { ctl: null, id: '', nome: '' };
function abrirGuia(id, nomeFallback) {
  const ex = exInfo(id, nomeFallback);
  if (Guia.ctl) Guia.ctl.abort();
  Guia.ctl = new AbortController(); Guia.id = id; Guia.nome = nomeFallback || '';
  const fig = figuraHTML(id, ex.nome), mapa = musculosHTML(id);
  const corpo = `<div class="stack guia">
    ${fig}
    ${mapa || `<p class="small muted">${esc(t('main_muscle', { x: nomeGrupo(ex.grupo) }))}</p>`}
    <div class="svc-row"><a class="svc yt" href="${esc(ytURL(ex))}" data-pkg="com.google.android.youtube" data-url="1" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> ${esc(t('yt_videos'))}</a></div>
    <h3 class="h3">${t('guide_ai_title')}</h3>
    <div id="guiaIA">${AI.on ? `<p class="msg think">${t('guide_writing')}</p>` : `<p class="note">${esc(t('guide_need_key'))}</p>`}</div>
  </div>`;
  const ctl = Guia.ctl;
  openSheet(t('guide_title', { x: ex.nome }), corpo, () => { ctl.abort(); cancelAnimationFrame(Fig.raf); });
  if (fig) iniciarFigura(id);
  if (AI.on) carregarAula();
}
function carregarAula() {
  const ctl = Guia.ctl, alvo = () => $('#guiaIA');
  aiText(promptTecnica(S.me, Guia.id, Guia.nome), {
    modelTier: 'default', cache: { gcTime: 30 * 86400000 }, signal: ctl.signal,
    onText: ({ text }) => { const el = alvo(); if (el) el.innerHTML = `<div class="md">${md(text)}</div>`; },
  }).catch(e => {
    const el = alvo();
    if (el && e.code !== 'cancelled') el.innerHTML = `<div class="note err">${esc(aiErrorText(e))}</div><button class="btn ghost small" data-a="guiaDeNovo">${t('try_again')}</button>`;
  });
}
