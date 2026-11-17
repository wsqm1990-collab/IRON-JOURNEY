/* ---------- ask the coach about one exercise ----------
   From the exercise card (or its "How to" guide) the person types a question, or taps a ready one,
   and the coach answers knowing exactly where they are: the exercise, today's sets and weights,
   last time, the gym's equipment. An answer can carry an action the app turns into a button
   (a new weight for the remaining sets, or a swap). Every question also lands in the coach chat. */
Object.assign(STR, {
  exq_btn: ['Ask', 'Perguntar', 'Preguntar'],
  exq_guide_btn: ['Ask the coach about this exercise', 'Perguntar ao treinador sobre este exercício', 'Preguntar al entrenador sobre este ejercicio'],
  exq_intro_live: ['Ask anything about this exercise. The coach already knows which set you\'re on, today\'s weight and your history.', 'Pergunte qualquer coisa sobre este exercício. O treinador já sabe em que série você está, a carga de hoje e o seu histórico.', 'Pregunta lo que quieras sobre este ejercicio. El entrenador ya sabe en qué serie estás, el peso de hoy y tu historial.'],
  exq_intro: ['Ask anything about this exercise. The coach knows your plan and your history.', 'Pergunte qualquer coisa sobre este exercício. O treinador conhece seu plano e o seu histórico.', 'Pregunta lo que quieras sobre este ejercicio. El entrenador conoce tu plan y tu historial.'],
  exq_ph: ['Type your question', 'Escreva sua dúvida', 'Escribe tu duda'],
  exq_now: ['Now: set {n} of {m}', 'Agora: série {n} de {m}', 'Ahora: serie {n} de {m}'],
  exq_all_done: ['All sets done', 'Todas as séries feitas', 'Todas las series hechas'],
  exq_use_kg: ['Use {kg} kg on the next sets', 'Usar {kg} kg nas próximas séries', 'Usar {kg} kg en las próximas series'],
  exq_swap_to: ['Swap for {x}', 'Trocar por {x}', 'Cambiar por {x}'],
  exq_listen: ['Listen', 'Ouvir resposta', 'Escuchar'],
  exq_kg_done: ['Next sets: {kg} kg', 'Próximas séries: {kg} kg', 'Próximas series: {kg} kg'],
  exq_need_key: ['Add your AI key in Settings to ask the coach.', 'Coloque sua chave de IA nas Configurações para perguntar ao treinador.', 'Añade tu clave de IA en Ajustes para preguntar al entrenador.'],
});
const CHIPS_EXQ = [
  ['How do I do it right?', 'Como faço certo?', '¿Cómo lo hago bien?'],
  ['How do I set up the equipment?', 'Como ajusto o aparelho?', '¿Cómo ajusto el aparato?'],
  ['I don\'t feel the muscle working', 'Não sinto o músculo trabalhar', 'No siento trabajar el músculo'],
  ['It hurts or feels uncomfortable', 'Sinto dor ou incômodo', 'Siento dolor o molestia'],
];
const CHIPS_EXQ_CARGA = [['The weight is too heavy', 'O peso está pesado demais', 'El peso es demasiado pesado'], ['The weight is too light', 'O peso está leve demais', 'El peso es demasiado ligero']];
const CHIPS_EXQ_CORPO = [['It\'s too hard', 'Está difícil demais', 'Es demasiado difícil'], ['It\'s too easy', 'Está fácil demais', 'Es demasiado fácil']];

/* the coach's answer may end with [[peso: 32.5]] or [[trocar: exercise_id]]: the app turns them into buttons */
const TAG_EXQ = /\[\[\s*(peso|weight|trocar|swap)\s*:\s*([^\]]*?)\s*\]\]/gi;
const semTagsExq = s => String(s || '').replace(TAG_EXQ, '').replace(/\[\[[^\]]*$/, '').replace(/\[$/, '').trim();
function tagsExq(s) {
  const out = {};
  for (const m of String(s || '').matchAll(TAG_EXQ)) out[/^(peso|weight)$/i.test(m[1]) ? 'peso' : 'trocar'] = m[2].trim();
  return out;
}

/* the exercise being asked about: in today's workout (index) or just one from the plan */
const liveExq = q => { const L = S.live; if (!L || q.i == null) return null; const x = L.exs[q.i]; return x && x.id === q.id ? x : null; };
const idxExq = q => { const L = S.live; if (!L) return -1; return L.exs[q.i] && L.exs[q.i].id === q.id ? q.i : L.exs.findIndex(x => x.id === q.id); };
function abrirPergunta(o) {
  const L = S.live;
  let i = o.i != null && L && L.exs[o.i] ? o.i : -1;
  if (i < 0 && o.id && L) i = L.exs.findIndex(x => x.id === o.id);
  const x = i >= 0 ? L.exs[i] : null, id = x ? x.id : o.id;
  if (!id) return;
  S.exqFios = S.exqFios || {};
  if (S.exq && S.exq.ctl) S.exq.ctl.abort();
  const q = (S.exq = { id, nome: (x && x.nome) || o.nome || '', i: x ? i : null, msgs: S.exqFios[id] || (S.exqFios[id] = []), busy: false, parcial: '', erro: '', rascunho: '', ctl: null });
  openSheet(exInfo(id, q.nome).nome, exqHTML(), () => { if (q.ctl) q.ctl.abort(); clearInterval(q.relogio); if (S.exq === q) S.exq = null; });
  descansoExq();
  if (x) q.relogio = setInterval(descansoExq, 500);
}
/* the rest countdown stays visible while reading the answer */
function descansoExq() {
  const el = $('#exqDesc');
  if (!el) return;
  const left = Rest.end ? Math.ceil((Rest.end - Date.now()) / 1000) : 0;
  el.textContent = left > 0 ? ' · ' + t('rest_label') + ' ' + Math.floor(left / 60) + ':' + pad2(left % 60) : Rest.end && Rest.go ? ' · ' + t('next_set') : '';
}
function agoraExq(x, ex) {
  if (x.pulado) return t('skipped_today');
  const k = x.sets.findIndex(z => !z.ok);
  if (k < 0) return t('exq_all_done');
  const z = x.sets[k];
  return [t('exq_now', { n: k + 1, m: x.sets.length }), z.kg != null && usaCarga(ex) ? fmtKg(z.kg) + ' kg' : '', (z.alvo != null ? z.alvo : faixa(x.alvo)) + ' ' + unidade(ex)].filter(Boolean).join(' · ');
}
function chipsExq(ex) { return [...CHIPS_EXQ, ...(usaCarga(ex) ? CHIPS_EXQ_CARGA : CHIPS_EXQ_CORPO)].map(L3); }
function acoesExq(texto, x, ex) {
  const tg = tagsExq(texto), b = [];
  if (x && !x.pulado && tg.peso && usaCarga(ex) && x.sets.some(z => !z.ok)) {
    const kg = arredondar(ex, parseNum(tg.peso), 0);
    if (kg > 0 && kg < 1000) b.push(`<button class="btn ok block" data-a="exqPeso" data-kg="${kg}">${esc(t('exq_use_kg', { kg: fmtKg(kg) }))}</button>`);
  }
  if (x && tg.trocar && EX[tg.trocar] && candidatosTroca(x.id, new Set(S.live.exs.map(e => e.id))).some(c => c.id === tg.trocar)) {
    b.push(`<button class="btn ghost block" data-a="exqTrocar" data-id="${esc(tg.trocar)}">${I.troca}${esc(t('exq_swap_to', { x: EX[tg.trocar].nome }))}</button>`);
  }
  b.push(`<button class="btn ghost small" data-a="exqOuvir" style="align-self:flex-start">${I.som}${t('exq_listen')}</button>`);
  return `<div class="stack" style="gap:8px">${b.join('')}</div>`;
}
function exqHTML() {
  const q = S.exq;
  if (!q) return '';
  const ex = exInfo(q.id, q.nome), x = liveExq(q), ult = q.msgs[q.msgs.length - 1];
  const fio = q.msgs.map(m => `<div class="msg ${m.r === 'u' ? 'u' : 'a'}">${m.r === 'u' ? esc(m.t) : md(semTagsExq(m.t))}</div>`).join('');
  return `<div class="stack exq">
    ${q.msgs.length ? '' : `<p class="small muted">${t(x ? 'exq_intro_live' : 'exq_intro')}</p>`}
    ${x ? `<p class="xs muted num exq-agora">${esc(agoraExq(x, ex))}<b id="exqDesc"></b></p>` : ''}
    ${AI.on ? '' : `<div class="note warn stack"><span>${t('exq_need_key')}</span><button class="btn small" data-a="ajustes" style="justify-self:start">${t('open_settings')}</button></div>`}
    ${fio || q.busy ? `<div class="chat" id="exqChat">${fio}${q.busy ? `<div class="msg a${q.parcial ? '' : ' think'}" id="exqLive">${q.parcial ? md(semTagsExq(q.parcial)) : t('thinking')}</div>` : ''}</div>` : ''}
    ${q.erro ? `<div class="note err">${esc(q.erro)}</div>` : ''}
    ${!q.busy && ult && ult.r === 'a' ? acoesExq(ult.t, x, ex) : ''}
    ${AI.on && !q.msgs.length && !q.busy ? `<div class="chips">${chipsExq(ex).map(c => `<button class="chip" data-a="exqChip" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>` : ''}
    ${AI.on ? `<div class="exq-comp"><textarea class="inp" id="exqTxt" data-in="exqTxt" rows="2" maxlength="600" enterkeyhint="send" placeholder="${t('exq_ph')}" aria-label="${t('exq_ph')}">${esc(q.rascunho)}</textarea>${q.busy ? `<button class="btn ghost" data-a="exqParar">${t('stop')}</button>` : `<button class="btn" data-a="exqEnviar">${t('send')}</button>`}</div>` : ''}
  </div>`;
}
function pintarExq(rolar) {
  const foco = document.activeElement && document.activeElement.id === 'exqTxt';
  sheetBody(exqHTML());
  descansoExq();
  if (foco) { const ta = $('#exqTxt'); if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } }
  const box = $('#sheetP');
  if (!box) return;
  if (rolar === 'fim') box.scrollTop = box.scrollHeight;
  else if (rolar === 'resposta') { const as = document.querySelectorAll('#exqChat .msg.a'), el = as[as.length - 1]; if (el) el.scrollIntoView({ block: 'start' }); }
}

/* what the coach reads (in English, like the rest of its context) */
const kgExq = (ex, kg) => (kg == null ? '' : usaCarga(ex) ? kg + ' kg × ' : ex.carga === 'c' && kg > 0 ? '+' + kg + ' kg × ' : '');
function itemPlanoExq(pid, id) {
  const pl = plano(pid);
  if (!pl || !pl.programa) return null;
  for (const d of pl.programa.dias) { const it = d.exercicios.find(e => e.id === id); if (it) return it; }
  return null;
}
function ultimaVezExq(pid, id) {
  const s = sessoesDe(pid).find(s => (s.exs || []).some(x => x.id === id && (x.sets || []).some(z => z.ok)));
  if (!s) return '';
  const x = s.exs.find(e => e.id === id), ex = exInfo(id, x.nome);
  return dayKey(s.inicio) + ': ' + x.sets.filter(z => z.ok).map(z => kgExq(ex, z.kg) + z.reps).join(', ');
}
function pesosExq(ex) {
  const P = pesosAtivos(), tipo = tipoCarga(ex), pl = (P.anilhas || []).join(', ');
  if (tipo === 'barra') return `a ${barraDe(ex, P)} kg bar plus plates of ${pl} kg per side`;
  if (tipo === 'carga2') return `plate-loaded machine, plates of ${pl} kg on both sides`;
  if (tipo === 'carga1') return `plate-loaded machine, plates of ${pl} kg`;
  if (tipo === 'halter' || tipo === 'halter1') { const L = P.halterLista || listaHalteres(P); return L.length ? `dumbbells of ${L.join(', ')} kg` : 'dumbbells'; }
  if (tipo === 'maquina') return `weight stack in steps of ${P.maquina} kg`;
  if (tipo === 'polia') return `cable stack in steps of ${P.polia} kg`;
  if (tipo === 'mochila') return `a backpack loaded up to ${P.mochila} kg`;
  if (tipo === 'kettle') return (P.kettles || []).length ? `kettlebells of ${P.kettles.join(', ')} kg` : 'kettlebells';
  return '';
}
function ctxExq(q) {
  const pid = S.me, p = perfil(pid), L = S.live, x = liveExq(q), ex = exInfo(q.id, q.nome), it = itemPlanoExq(pid, q.id);
  const un = ex.carga === 's' ? 'seconds' : ex.carga === 'n' ? 'minutes' : 'reps', l = [];
  l.push(x ? `${p.nome} is in the middle of today's workout (${L.diaNome}${L.casa ? ', at home' : ''}) and is asking about this exercise between sets.` : `${p.nome} is reading about this exercise in the app, not training right now.`);
  l.push(`Exercise: ${ex.nomeEn} (${en3(GRUPOS[ex.grupo] || GRUPOS.outro)}; ${ex.tipo === 'C' ? 'compound' : 'isolation'}).`);
  if (x && x.trocadoDe) l.push(`It replaced ${exInfo(x.trocadoDe, x.trocadoDe).nomeEn} today.`);
  const dica = (x && x.dica) || (it && it.dica);
  if (dica) l.push('Technique cue in the plan: ' + dica);
  if (it && it.porque) l.push('Why it is in the plan: ' + it.porque);
  if (x) {
    const a = x.alvo, c = x.carga || {}, rir = c.rir != null ? c.rir : a.rir;
    l.push(`Today's target: ${a.series} sets of ${faixa(a)} ${un}, about ${rir} reps in reserve, ${a.desc} s of rest.`);
    if (x.pulado) l.push('They skipped it today.');
    else l.push('Sets today: ' + x.sets.map((z, j) => `set ${j + 1} ${z.ok ? 'done: ' + kgExq(ex, z.kg) + (z.reps ?? '?') : 'planned: ' + kgExq(ex, z.kg) + (z.alvo != null ? z.alvo : faixa(a))} ${un}`).join('; ') + '.');
    if (c.primeira) l.push('First time on this exercise: set 1 is a test, as many reps as they can while keeping the reps in reserve; the app sets the next sets from it.');
    else if (c.teste) l.push('Set 1 is the test set: its reps decide the weight of the next sets.');
    const ult = textoUltima(x.sug), sg = textoSug(x.sug);
    if (ult) l.push('Last time: ' + ult + '.');
    if (sg) l.push(`What the app's calculator told them: "${sg}"`);
  } else {
    if (it) l.push(`In the plan: ${it.series} sets of ${it.reps[0]}-${it.reps[1]} ${un}, ${it.descanso} s of rest.`);
    const u = ultimaVezExq(pid, q.id);
    if (u) l.push('Last time: ' + u + '.');
  }
  const pe = pesosExq(ex);
  if (pe) l.push('Equipment for the load: ' + pe + '.');
  return l.join('\n');
}
function regrasExq(q) {
  const x = liveExq(q), ex = exInfo(q.id, q.nome);
  let s = `THIS QUESTION (these rules replace the length rule above)
- They are asking from the exercise screen, phone in hand. Start with the direct answer in one or two sentences, then at most 4 short bullets with exactly what to do. 60 to 160 words in total, unless they ask for more detail.
- Answer about this exercise with their numbers above. Be concrete: positions, cues, what to feel, the number to use.
- Pain or discomfort: give the safe adjustment (less weight, shorter range of motion, slower tempo, or a swap). If the pain is sharp, in a joint, or getting worse, tell them to stop this exercise today.`;
  if (x && !x.pulado) {
    const como = { barra: 'the bar plus all the plates', carga2: 'all the plates on both sides', carga1: 'all the plates', halter: 'the weight of one dumbbell', halter1: 'the dumbbell', maquina: 'the weight on the stack', polia: 'the weight on the stack', mochila: 'the backpack', kettle: 'the kettlebell' }[tipoCarga(ex)];
    const cands = candidatosTroca(x.id, new Set(S.live.exs.map(e => e.id))), linhas = [];
    if (como && usaCarga(ex) && x.sets.some(z => !z.ok)) linhas.push(`[[peso: N]] when you recommend a different weight for the remaining sets today. N is ${como} in kg, a weight that can be loaded with the equipment above.`);
    if (cands.length) linhas.push(`[[trocar: ID]] when you recommend replacing this exercise today, with one ID from this list (id | name | muscle group):\n${cands.map(c => `${c.id} | ${c.nomeEn} | ${en3(GRUPOS[c.grupo] || GRUPOS.outro)}`).join('\n')}`);
    if (linhas.length) s += '\n\nBUTTONS: the app turns these tags into buttons the person can tap. Only when you really recommend it, put the tag alone on the last line, exactly in this form, and never mention or explain it:\n' + linhas.join('\n');
  }
  return s;
}

/* ask, stream the answer, keep it in the thread and in the coach chat */
async function perguntarEx(texto) {
  const q = S.exq;
  texto = String(texto || '').trim().slice(0, 600);
  if (!q || !texto || q.busy || !AI.on) return;
  const pid = S.me, ex = exInfo(q.id, q.nome);
  q.msgs.push({ r: 'u', t: texto });
  q.rascunho = ''; q.erro = ''; q.busy = true; q.parcial = ''; q.ctl = new AbortController();
  pintarExq('fim');
  const turns = [{ role: 'user', content: `${regrasCoach(pid)}\n\nCURRENT EXERCISE\n${ctxExq(q)}\n\n${regrasExq(q)}` }, ...q.msgs.slice(-10).map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t }))];
  let resp = '';
  try {
    const { text, truncated } = await aiText(turns, {
      cache: false, signal: q.ctl.signal,
      onText: ({ text }) => { q.parcial = text; const el = S.exq === q && $('#exqLive'); if (el) { el.classList.remove('think'); el.innerHTML = md(semTagsExq(text)); } },
    });
    resp = text + (truncated ? '\n\n' + t('cut_off') : '');
  } catch (e) {
    if (e && e.text) resp = e.text + '\n\n' + t('interrupted');
    if (e && e.code !== 'cancelled') q.erro = aiErrorText(e);
  }
  q.busy = false; q.parcial = ''; q.ctl = null;
  if (resp) q.msgs.push({ r: 'a', t: resp });
  else { q.msgs.pop(); if (!q.rascunho) q.rascunho = texto; }
  while (q.msgs.length > 20) q.msgs.shift();
  if (resp) guardarExqNoChat(pid, ex.nome + ': ' + texto, semTagsExq(resp));
  if (S.exq === q) pintarExq(resp ? 'resposta' : '');
}
async function guardarExqNoChat(pid, u, a) {
  try {
    if (!S.chatLoaded[pid]) await carregarChat(pid);
    for (let k = 0; k < 50 && S.chatLoaded[pid] === 'carregando'; k++) await new Promise(r => setTimeout(r, 100));
    if (S.chatLoaded[pid] !== true) return;
    const msgs = (S.chat[pid] = S.chat[pid] || []), em = Date.now();
    msgs.push({ r: 'u', t: u.slice(0, 1500), em }, { r: 'a', t: a, em });
    while (msgs.length > 40) msgs.shift();
    if (S.canWrite) Store.set('conversas/' + pid, { msgs, atualizadoEm: em }).catch(() => {});
  } catch { /* the answer is still on screen */ }
}

/* the buttons under an answer */
function usarPesoExq(kgTxt) {
  const q = S.exq, L = S.live;
  if (!q || !L) return;
  const i = idxExq(q), x = L.exs[i];
  if (!x) return;
  const ex = exInfo(x.id, x.nome), kg = arredondar(ex, parseNum(kgTxt), 0);
  if (!(kg > 0)) return;
  x.sets.forEach(z => { if (!z.ok) { z.kg = kg; z.manual = true; } });
  saveLiveSoon(); closeSheet(); refreshEx(i);
  toast(t('exq_kg_done', { kg: fmtKg(kg) }));
}
function trocarExq(id) {
  const q = S.exq;
  if (!q || !S.live) return;
  const i = idxExq(q);
  if (i < 0) return;
  abrirTroca({ scope: 'live', i });
  const w = S.swap;
  if (w && w.cands.some(c => c.id === id)) { w.ia = [{ id, motivo: '' }]; sheetBody(swapHTML()); }
}
function ouvirExq() {
  const q = S.exq, a = q && [...q.msgs].reverse().find(m => m.r === 'a');
  if (!a) return;
  if (!Nat.on) { try { if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; } } catch { /* no voice here */ } }
  const txt = semTagsExq(a.t).replace(/\*\*/g, '').replace(/^\s*#{1,4}\s+/gm, '').replace(/^\s*(?:[-•*]|\d+[.)])\s+/gm, '').replace(/\n{2,}/g, '\n').trim().slice(0, 3800);
  unlockAudio();
  VOZ.dizer(txt);
}
/* Enter sends (Shift+Enter makes a new line) */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.shiftKey || e.isComposing || !e.target || e.target.id !== 'exqTxt') return;
  e.preventDefault();
  perguntarEx(e.target.value);
});
