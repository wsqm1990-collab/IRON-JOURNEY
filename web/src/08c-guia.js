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
  pararRitmo();
  const corpo = `<div class="stack guia">
    ${fig}${fig ? ritmoHTML(id) : ''}
    ${mapa || `<p class="small muted">${esc(t('main_muscle', { x: nomeGrupo(ex.grupo) }))}</p>`}
    <div class="svc-row"><a class="svc yt" href="${esc(ytURL(ex))}" data-pkg="com.google.android.youtube" data-url="1" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> ${esc(t('yt_videos'))}</a></div>
    ${formaHTML()}
    <h3 class="h3">${t('guide_ai_title')}</h3>
    <div id="guiaIA">${AI.on ? `<p class="msg think">${t('guide_writing')}</p>` : `<p class="note">${esc(t('guide_need_key'))}</p>`}</div>
  </div>`;
  const ctl = Guia.ctl;
  openSheet(t('guide_title', { x: ex.nome }), corpo, () => { ctl.abort(); cancelAnimationFrame(Fig.raf); pararRitmo(); });
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

/* ---------- a set with the rhythm called out loud ----------
   Same tempo as the animation: the voice and beeps say when to go down slowly and when to push,
   count every rep and warn before the last one. */
Object.assign(STR, {
  tempo_btn: ['Do a set with voice rhythm ({n} reps)', 'Fazer uma série com ritmo por voz ({n} reps)', 'Hacer una serie con ritmo por voz ({n} reps)'],
  tempo_stop: ['Stop the voice rhythm', 'Parar o ritmo por voz', 'Parar el ritmo por voz'],
  tempo_ready: ['Get ready. 3, 2, 1, go!', 'Prepare-se. 3, 2, 1, vai!', 'Prepárate. 3, 2, 1, ¡ya!'],
  tempo_down: ['slowly', 'devagar', 'despacio'], tempo_up: ['push', 'força', 'fuerza'],
  tempo_last: ['Last one!', 'Última!', '¡Última!'], tempo_done: ['Done. Rest now.', 'Acabou. Agora descanse.', 'Listo. Ahora descansa.'],
  tempo_hold: ['Hold {n} seconds. Go!', 'Segure {n} segundos. Vai!', 'Aguanta {n} segundos. ¡Ya!'],
});
const Ritmo = { on: false, timers: [] };
function pararRitmo() {
  Ritmo.timers.forEach(clearTimeout); Ritmo.timers = []; Ritmo.on = false;
  const b = $('#ritmoBtn'); if (b) b.textContent = b.dataset.rotulo || '';
}
function repsDoRitmo(id) {
  const L = S.live, x = L && L.exs.find(e => e.id === id);
  if (!x) return 10;
  const z = x.sets.find(s => !s.ok);
  return clamp((z && z.alvo) || x.alvo.rmax || 10, 1, 30);
}
function ritmoHTML(id) {
  const f = figuraDe(id);
  if (!f) return '';
  const n = f.iso ? 30 : repsDoRitmo(id), rot = t('tempo_btn', { n: f.iso ? n + 's' : n });
  return `<button class="btn ghost block" id="ritmoBtn" data-a="ritmo" data-rotulo="${esc(rot)}">${I.som || ''}${esc(rot)}</button>`;
}
function iniciarRitmo(id) {
  if (Ritmo.on) { pararRitmo(); return; }
  const f = figuraDe(id);
  if (!f) return;
  unlockAudio();
  Ritmo.on = true;
  const b = $('#ritmoBtn'); if (b) b.textContent = t('tempo_stop');
  const em = (s, fn) => Ritmo.timers.push(setTimeout(() => { if (Ritmo.on) fn(); }, s * 1000));
  const fala = txt => VOZ.falar(txt), bip = (fr, d = 0.12) => tom(fr, d);
  fala(t('tempo_ready'));
  const t0 = 3.2;
  if (f.iso) {
    const n = 30;
    em(t0, () => { fala(t('tempo_hold', { n })); bip(880); });
    for (let s = 10; s < n; s += 10) em(t0 + s, () => bip(660));
    em(t0 + n, () => { bip(988, 0.3); fala(t('tempo_done')); vibrar([200, 80, 200]); pararRitmo(); });
    em(t0, () => iniciarFigura(id));
    return;
  }
  const n = repsDoRitmo(id), fases = f.exc ? [['exc', 2.4], ['p', 0.5], ['con', 1.1], ['p', 0.8]] : [['con', 1.1], ['p', 0.7], ['exc', 2.4], ['p', 0.5]];
  const rep = fases.reduce((s, x) => s + x[1], 0);
  em(t0, () => iniciarFigura(id));
  for (let r = 0; r < n; r++) {
    let s = t0 + r * rep;
    for (const [tipo, dur] of fases) {
      const ini = s;
      if (tipo === 'exc') { em(ini, () => { bip(523); if (r < 2) fala(t('tempo_down')); }); em(ini + 1, () => bip(440, 0.06)); em(ini + 2, () => bip(440, 0.06)); }
      if (tipo === 'con') em(ini, () => { bip(880); if (r < 2) fala(t('tempo_up')); });
      s += dur;
    }
    const fim = t0 + (r + 1) * rep - (f.exc ? 0.8 : 0.5);
    em(fim, () => fala(r === n - 2 ? `${r + 1}. ${t('tempo_last')}` : String(r + 1)));
  }
  em(t0 + n * rep, () => { bip(988, 0.3); vibrar([200, 80, 200]); fala(t('tempo_done')); pararRitmo(); });
}

/* ---------- the coach watches your set ----------
   A short video (or photos) of one set: the app takes frames from it and sends them with the
   person's own key to Claude, which says what looks good and what to fix. Nothing is kept. */
Object.assign(STR, {
  form_title: ['Check my form with AI', 'Analisar minha execução com IA', 'Analizar mi técnica con IA'],
  form_how: ['Film one set from the side, phone propped at hip height, whole body and the equipment in the picture, 5 to 30 seconds. The app takes frames from the video and your personal trainer says what to fix.', 'Filme uma série de lado, com o celular apoiado na altura do quadril, corpo inteiro e o aparelho aparecendo, de 5 a 30 segundos. O app tira quadros do vídeo e seu personal diz o que corrigir.', 'Graba una serie de lado, con el móvil apoyado a la altura de la cadera, cuerpo entero y el aparato en la imagen, de 5 a 30 segundos. La app saca fotogramas del vídeo y tu entrenador te dice qué corregir.'],
  form_film: ['Film now', 'Filmar agora', 'Grabar ahora'], form_pick: ['Choose a video', 'Escolher vídeo', 'Elegir vídeo'],
  form_privacy: ['Only still frames go to the AI with your key; the video isn\'t saved by the app.', 'Só alguns quadros vão para a IA com a sua chave; o vídeo não fica salvo no app.', 'Solo algunos fotogramas van a la IA con tu clave; la app no guarda el vídeo.'],
  form_reading: ['Reading the video…', 'Lendo o vídeo…', 'Leyendo el vídeo…'], form_thinking: ['Your personal trainer is watching your set…', 'Seu personal está analisando a sua série…', 'Tu entrenador está analizando tu serie…'],
  form_bad_video: ['Couldn\'t read this video. Try "Film now", or a shorter video.', 'Não consegui ler esse vídeo. Tente "Filmar agora" ou um vídeo mais curto.', 'No pude leer este vídeo. Prueba "Grabar ahora" o un vídeo más corto.'],
  form_need_key: ['Add your AI key in Settings to have your form checked.', 'Coloque sua chave de IA nas Configurações para analisar sua execução.', 'Añade tu clave de IA en Ajustes para analizar tu técnica.'],
});
function formaHTML() {
  if (!AI.on) return `<div class="card pad stack"><h3 class="h3">${t('form_title')}</h3><p class="small muted">${t('form_need_key')}</p></div>`;
  return `<div class="card pad stack"><h3 class="h3">${t('form_title')}</h3><p class="small">${t('form_how')}</p>
    <div class="row" style="gap:8px;flex-wrap:wrap"><label class="btn small">${t('form_film')}<input type="file" accept="video/*" capture="environment" data-in="formaVideo" hidden></label>
    <label class="btn ghost small">${t('form_pick')}<input type="file" accept="video/*,image/*" multiple data-in="formaVideo" hidden></label></div>
    <p class="xs muted">${t('form_privacy')}</p><div id="formaRes"></div></div>`;
}
const esperar = (el, ev, ms) => new Promise((ok, erro) => { const tm = setTimeout(() => erro({ code: 'video' }), ms); el.addEventListener(ev, () => { clearTimeout(tm); ok(); }, { once: true }); });
async function quadrosDoVideo(file, n = 8, lado = 640) {
  const url = URL.createObjectURL(file), v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
  try {
    await esperar(v, 'loadeddata', 20000);
    const dur = v.duration;
    if (!(dur > 0) || !v.videoWidth) throw { code: 'video' };
    const fim = Math.min(dur, 40), k = Math.min(1, lado / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement('canvas'); c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k);
    const g = c.getContext('2d'), out = [];
    for (let i = 0; i < n; i++) {
      v.currentTime = Math.min(fim - 0.05, (fim * (i + 0.5)) / n);
      await esperar(v, 'seeked', 8000);
      g.drawImage(v, 0, 0, c.width, c.height);
      out.push(c.toDataURL('image/jpeg', 0.72));
    }
    return { quadros: out, dur: Math.round(dur) };
  } finally { URL.revokeObjectURL(url); }
}
async function quadrosDeFotos(files, lado = 800) {
  const out = [];
  for (const f of files.slice(0, 8)) {
    const url = URL.createObjectURL(f), img = new Image();
    try {
      img.src = url; await esperar(img, 'load', 15000);
      const k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      out.push(c.toDataURL('image/jpeg', 0.75));
    } finally { URL.revokeObjectURL(url); }
  }
  return { quadros: out, dur: 0 };
}
function promptForma(pid, exId, nome, n, dur) {
  const p = perfil(pid) || { nome: 'the person' }, ex = exInfo(exId, nome), lim = limitesEn(p);
  return `You are an expert personal trainer reviewing ${p.nome}'s technique on "${ex.nomeEn}". The images are ${n} ${dur ? `frames in time order from a ${dur}-second video of one set` : 'photos of the exercise'}. ${idioma()}
First check that the images really show this exercise. If they don't, or the view is unclear (too dark, body cut off, bad angle), say so kindly, explain exactly how to film it (from the side, phone at hip height, whole body and the equipment in the picture) and stop there.
Otherwise use exactly these bold headings, translated:
**What looks good**: 1 to 3 short points.
**What to fix**: most important first, at most 4. For each: what you see, why it matters (results or safety) and a simple cue to fix it.
**Range of motion and path**: what the frames show about depth, lockout and the path of the bar, dumbbells or body.
**Focus for the next set**: one sentence.
Only claim what is visible. Never diagnose injuries; if something looks risky, say to lower the weight.${lim ? ` The person reported: ${lim}; mention it only if it matters here.` : ''} At most 300 words.`;
}
async function analisarForma(input) {
  const files = [...(input.files || [])];
  input.value = '';
  const box = $('#formaRes');
  if (!files.length || !box) return;
  const ctl = Guia.ctl;
  box.innerHTML = `<p class="msg think">${t('form_reading')}</p>`;
  let r;
  try { r = files[0].type.startsWith('image/') ? await quadrosDeFotos(files.filter(f => f.type.startsWith('image/'))) : await quadrosDoVideo(files[0]); }
  catch { if ($('#formaRes')) $('#formaRes').innerHTML = `<div class="note err">${t('form_bad_video')}</div>`; return; }
  if (!r.quadros.length) { box.innerHTML = `<div class="note err">${t('form_bad_video')}</div>`; return; }
  const tiras = `<div class="tiras">${r.quadros.map(q => `<img src="${q}" alt="">`).join('')}</div>`;
  box.innerHTML = `${tiras}<div id="formaTxt"><p class="msg think">${t('form_thinking')}</p></div>`;
  const imgs = r.quadros.map(q => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: q.split(',')[1] } }));
  try {
    await claudeStream({
      messages: [{ role: 'user', content: [...imgs, { type: 'text', text: promptForma(S.me, Guia.id, Guia.nome, r.quadros.length, r.dur) }] }],
      tier: 'default', signal: ctl && ctl.signal,
      onText: ({ text }) => { const el = $('#formaTxt'); if (el) el.innerHTML = `<div class="md">${md(text)}</div>`; },
    });
  } catch (e) { const el = $('#formaTxt'); if (el && e.code !== 'cancelled') el.innerHTML = `<div class="note err">${esc(aiErrorText(e))}</div>`; }
}
