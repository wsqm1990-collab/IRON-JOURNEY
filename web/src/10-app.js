Object.assign(STR, {
  discard_q: ['Discard this workout?', 'Descartar este treino?', '¿Descartar este entrenamiento?'], discard_text: ['The sets you logged today will be deleted. The plan stays where it was.', 'As séries registradas hoje serão apagadas. O plano continua no mesmo ponto.', 'Las series registradas hoy se borrarán. El plan sigue en el mismo punto.'],
  keep_training: ['Keep training', 'Continuar treinando', 'Seguir entrenando'],
});
/* ---------- rendering ---------- */
function viewLoading() {
  return `<section class="screen"><div class="loader">${lbarHTML()}<p class="h3">${t('loading')}</p>
    ${S.slow ? `<p class="small muted">${t('slow')}</p><button class="btn ghost" data-a="forcarAbrir">${t('open_anyway')}</button>` : ''}</div></section>`;
}
function banners() {
  if (!S.ready) return '';
  if (S.precisaApk) return `<div class="banner row between" style="gap:12px"><span>${t('need_apk')}</span><button class="btn small" data-a="apkNovo">${t('get_apk')}</button></div>`;
  if (S.mode === 'local' && !Nat.on) return `<div class="banner">${t('local_mode')}</div>`;
  if (!S.canWrite) return `<div class="banner">${t('read_only')}</div>`;
  return '';
}
function render() {
  renderPeople(); renderTabs();
  const ct = $('#chatTxt'); if (ct) S.chatDraft = ct.value;
  let html;
  if (!S.ready) html = viewLoading();
  else if (S.sub === 'wizard' && S.wizard) html = viewWizard();
  else if (S.sub === 'gym') html = viewGym();
  else if (!S.me || !S.perfis[S.me]) html = viewWelcome();
  else switch (S.tab) {
    case 'plano': html = viewPlano(); break;
    case 'cardio': html = viewCardio(); break;
    case 'coach': html = viewCoach(); break;
    case 'jornada': html = viewJornada(); break;
    default: html = S.live ? viewWorkout() : viewHoje();
  }
  $('#view').innerHTML = banners() + html;
  const nt = $('#chatTxt'); if (nt && S.chatDraft) nt.value = S.chatDraft;
}
// Data arriving from another device never rebuilds the screen under someone's fingers.
let pendente = false;
const digitando = () => { const a = document.activeElement; return !!(a && a.closest && a.closest('#view, #sheet') && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)); };
function softRender() {
  if (!S.ready) return;
  if (S.tab === 'hoje' && S.live && !S.sub) { renderPeople(); renderTabs(); return; }
  if (digitando()) { pendente = true; return; }
  render();
}
document.addEventListener('focusout', () => setTimeout(() => { if (pendente && !digitando()) { pendente = false; softRender(); } }, 80));
function aoFicarPronto() {
  const p = perfil();
  if (!LS.get('td_lang') && p && p.lang) setLang(p.lang);
  retomarPlayerSalvo();
  lpcPreparar();
  setTimeout(() => { window.__ijOk = true; confirmarVersao(); setTimeout(() => checarAtualizacao(true), 4000); }, 2500);
}

/* ---------- workout actions ---------- */
function iniciarTreino(dia) {
  if (!S.canWrite) { toast(t('read_only_short')); return; }
  closeSheet();
  S.live = montarSessao(S.me, dia); S.liveFor = S.me;
  S.tab = 'hoje'; LS.set('td_tab', 'hoje');
  unlockAudio(); startWakeLock(); saveLiveNow();
  render(); window.scrollTo(0, 0);
}
function marcarSerie(i, j) {
  const L = S.live, x = L.exs[i], z = x.sets[j], ex = exInfo(x.id, x.nome);
  unlockAudio();
  if (z.ok) { z.ok = false; saveLiveSoon(); refreshEx(i); return; }
  const kgEl = $(`#kg-${i}-${j}`), rpEl = $(`#rp-${i}-${j}`);
  if (kgEl) z.kg = parseNum(kgEl.value);
  if (rpEl) { const r = parseNum(rpEl.value); z.reps = r == null ? null : Math.round(r); }
  if (z.reps == null && testeLivre(x, j)) { toast(t('type_test_reps', { u: unidadeLonga(ex) })); if (rpEl) rpEl.focus(); return; }
  if (z.reps == null && z.alvo != null) z.reps = z.alvo;
  if (!(z.reps > 0)) { toast(t('enter_reps', { u: ex.carga === 's' ? t('u_sec') : ex.carga === 'n' ? 'min' : t('reps_long') })); if (rpEl) rpEl.focus(); return; }
  if (usaCarga(ex) && z.kg == null) { toast(t('enter_load')); if (kgEl) kgEl.focus(); return; }
  z.ok = true;
  recalibrar(x, j);
  saveLiveSoon(); refreshEx(i);
  if (x.bloco && seguirGrupo(L, i)) return;
  const exFeito = x.sets.every(s => s.ok);
  const prox = L.exs.slice(i + 1).find(e => !e.pulado && e.sets.some(s => !s.ok));
  const c = contagem(L);
  if (c.ok >= c.tot) { stopRest(); toast(t('all_sets_done')); return; }
  startRest(x.alvo.desc, exFeito ? (prox ? t('next_x2', { x: exInfo(prox.id, prox.nome).nome }) : t('almost')) : t('set_n_of', { x: ex.nome, n: j + 2 }));
  if (exFeito && prox) {
    const k = L.exs.indexOf(prox);
    setTimeout(() => { const el = $('#ex-' + k); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }, 300);
  }
}
const live = el => S.live && S.live.exs[+el.dataset.i];
const TABS_OK = ['hoje', 'plano', 'cardio', 'coach', 'jornada'];

/* ---------- every tap in the app ---------- */
const ACT = {
  me: el => { closeSheet(); setMe(el.dataset.pid); S.sub = null; S.wizard = null; render(); window.scrollTo(0, 0); },
  idioma: () => abrirIdioma(),
  ajustes: () => abrirAjustes(),
  setIdioma: el => { const aj = S.ajustes; trocarIdioma(el.dataset.v); if (aj) abrirAjustes(); },
  setTema: el => { LS.set('ij_theme', el.dataset.v); aplicarTema(); if (S.ajustes) sheetBody(ajustesHTML()); statusSegundoPlano(); },
  chaveSalvar: () => salvarChave(),
  chaveRemover: () => { CHAVE.del(); AI.fn = null; toast(t('key_removed')); sheetBody(ajustesHTML()); statusSegundoPlano(); render(); },
  somToggleAj: () => { proximoAlerta(); syncNativo(); sheetBody(ajustesHTML()); statusSegundoPlano(); },
  duckToggle: () => { LS.set('ij_duck', !duckOn()); syncNativo(); sheetBody(ajustesHTML()); statusSegundoPlano(); },
  pedirNotif: async () => { const r = await Nat.safe('askNotif'); if (!r || !r.granted) Nat.safe('openNotifSettings'); setTimeout(statusSegundoPlano, 600); },
  abrirBateria: () => Nat.safe('openBattery'),
  backupSalvar: () => salvarBackup(),
  checarAgora: () => checarAgora(),
  backupAplicar: () => aplicarBackup(),
  svcSel: el => { LS.set('ij_svc', el.dataset.v || null); render(); },
  apkNovo: () => { if (Nat.on) Nat.safe('openApp', { url: APK_URL }); else window.open(APK_URL, '_blank'); },
  novoPerfil: () => { closeSheet(); novoWizard(null); render(); window.scrollTo(0, 0); },
  editarPerfil: () => { novoWizard(S.me); render(); window.scrollTo(0, 0); },
  wzSet: el => { S.wizard.d[el.dataset.k] = el.dataset.num ? Number(el.dataset.v) : el.dataset.v; render(); },
  wzToggle: el => {
    const arr = S.wizard.d[el.dataset.k], v = el.dataset.v, k = arr.indexOf(v);
    if (k >= 0) arr.splice(k, 1);
    else { if (el.dataset.k === 'foco' && arr.length >= 3) { toast(t('wz_max3')); return; } arr.push(v); }
    render();
  },
  wzVoltar: () => { S.wizard.step = Math.max(0, S.wizard.step - 1); render(); },
  wzAvancar: () => { const err = wzValida(); if (err) { toast(err); return; } if (S.wizard.step >= WZ_PASSOS - 1) salvarPerfil(); else { S.wizard.step++; render(); window.scrollTo(0, 0); } },
  wzSair: () => { S.wizard = null; S.sub = null; render(); },
  editarGym: () => { closeSheet(); S.gymDraft = null; S.sub = 'gym'; render(); window.scrollTo(0, 0); },
  gymToggle: el => {
    const s = S.gymDraft.itens, v = el.dataset.v;
    if (s.has(v)) s.delete(v); else s.add(v);
    el.setAttribute('aria-pressed', String(s.has(v)));
    const n = $('[data-a="gymSalvar"] .num'); if (n) n.textContent = '(' + s.size + ')';
  },
  gymTodos: el => { const g = EQUIP_GRUPOS[+el.dataset.g][1], s = S.gymDraft.itens, todos = g.every(r => s.has(r[0])); g.forEach(r => (todos ? s.delete(r[0]) : s.add(r[0]))); render(); },
  gymSalvar: () => salvarGym(),
  pesoAnilha: el => { const p = S.gymDraft.pesos, v = Number(el.dataset.v), k = p.anilhas.indexOf(v); if (k >= 0) { if (p.anilhas.length > 1) p.anilhas.splice(k, 1); } else p.anilhas.push(v); p.anilhas.sort((a, b) => b - a); render(); },
  pesoSet: el => { S.gymDraft.pesos[el.dataset.k] = Number(el.dataset.v); render(); },
  gymSair: () => { S.gymDraft = null; S.sub = null; render(); },
  tab: el => { closeSheet(); S.tab = TABS_OK.includes(el.dataset.tab) ? el.dataset.tab : 'hoje'; LS.set('td_tab', S.tab); S.sub = null; render(); window.scrollTo(0, 0); if (S.tab === 'coach') rolarChat(); },
  jsub: el => { S.jsub = el.dataset.v; render(); },
  gerar: el => abrirGerar(el.dataset.modo || 'novo'),
  confirmarNovo: () => openSheet(t('new_plan_q'), `<p>${t('new_plan_text')}</p><button class="btn block" data-a="gerar" data-modo="novo">${t('build_new')}</button><button class="btn quiet block" data-a="fecharSheet">${t('keep_cur')}</button>`),
  ajustar: () => abrirAjuste(),
  ajEx: el => { const x = $('#aj-txt'); if (x) x.value = el.dataset.v; },
  ajEnviar: () => enviarAjuste(),
  ajAplicar: () => aplicarAjuste(),
  escolherDia: () => escolherDia(),
  casaAbrir: () => abrirCasa(),
  casaNada: () => { if (!S.casa) return; S.casa.equip = []; sheetBody(casaHTML()); },
  casaEquip: el => {
    const c = S.casa; if (!c) return;
    const set = new Set(c.equip || []), v = el.dataset.v;
    if (set.has(v)) set.delete(v); else set.add(v);
    c.equip = set.size ? CASA_EQUIP.map(e => e[0]).filter(id => set.has(id)) : null; sheetBody(casaHTML());
  },
  casaTempo: el => { if (!S.casa) return; S.casa.tempo = Number(el.dataset.v); sheetBody(casaHTML()); },
  casaOnde: el => { if (!S.casa) return; S.casa.onde = el.dataset.v === 'casa' ? 'casa' : 'academia'; sheetBody(casaHTML()); },
  casaObjetivo: el => { if (!S.casa) return; S.casa.objetivo = el.dataset.v; sheetBody(casaHTML()); },
  casaTipo: el => { if (!S.casa) return; S.casa.tipo = el.dataset.v; sheetBody(casaHTML()); },
  /* "today's plan" and "full body" stand alone; the muscle groups can be combined */
  casaMusc: el => {
    const c = S.casa; if (!c) return;
    const v = el.dataset.v;
    if (v === 'plano' || v === 'corpo') c.musc = c.musc.includes(v) ? [] : [v];
    else {
      const set = new Set(c.musc.filter(m => m !== 'plano' && m !== 'corpo'));
      if (set.has(v)) set.delete(v); else set.add(v);
      c.musc = FOCOS.map(f => f[0]).filter(id => set.has(id));
    }
    sheetBody(casaHTML());
  },
  casaGerar: () => gerarCasa(),
  casaComecar: () => iniciarTreinoCasa(),
  casaVoltar: () => { limparCasa(S.me); render(); window.scrollTo(0, 0); toast(t('dif_back_done')); },
  iniciar: el => iniciarTreino(+el.dataset.dia),
  ok: el => marcarSerie(+el.dataset.i, +el.dataset.j),
  maisSerie: el => { const x = live(el), u = x.sets[x.sets.length - 1]; x.sets.push({ kg: u ? u.kg : null, reps: null, ok: false }); saveLiveSoon(); refreshEx(+el.dataset.i); },
  menosSerie: el => { const x = live(el); if (x.sets.length > 1) { x.sets.pop(); saveLiveSoon(); refreshEx(+el.dataset.i); } },
  pular: el => { live(el).pulado = true; saveLiveSoon(); refreshEx(+el.dataset.i); },
  despular: el => { live(el).pulado = false; saveLiveSoon(); refreshEx(+el.dataset.i); },
  tecnica: el => abrirTecnica(+el.dataset.i),
  guia: el => abrirGuia(el.dataset.id, el.dataset.nome || ''),
  figPausa: () => pausarFigura(),
  heroiEditar: () => abrirCriador(),
  heroiSet: el => { if (!S.heroiDraft) return; S.heroiDraft[el.dataset.k] = el.dataset.v; if (el.dataset.k === 'corpo' && el.dataset.v === 'f') S.heroiDraft.barba = ''; atualizarCriador(); },
  heroiSalvar: () => salvarHeroi(),
  batalhaPular: () => { Batalha.fim = true; },
  ritmo: () => iniciarRitmo(Guia.id),
  guiaDeNovo: () => { const el = $('#guiaIA'); if (el) el.innerHTML = `<p class="msg think">${t('guide_writing')}</p>`; carregarAula(); },
  explicarPlano: () => pedirExplicacao(),
  trocarLive: el => abrirTroca({ scope: 'live', i: +el.dataset.i }),
  trocarPlano: el => abrirTroca({ scope: 'plano', dia: +el.dataset.dia, i: +el.dataset.i }),
  swapMotivo: el => { const w = S.swap; w.motivo = w.motivo === el.dataset.v ? '' : el.dataset.v; if (w.ctx.scope === 'live' && w.motivo) w.escopo = w.motivo === 'ocupado' ? 'hoje' : 'plano'; sheetBody(swapHTML()); },
  swapEscopo: el => { S.swap.escopo = el.dataset.v; sheetBody(swapHTML()); },
  swapIA: () => pedirTrocaIA(),
  swapEscolher: el => aplicarTroca(el.dataset.id),
  restMais: () => { if (Rest.go || Rest.end <= Date.now()) startRest(15, t('more15')); else { Rest.end += 15000; restNativo(); tickRest(); } },
  restFechar: () => stopRest(),
  finalizar: () => abrirFinalizar(),
  finSens: el => { S.finNota = ($('#fin-nota') || {}).value || ''; S.finSens = el.dataset.v; sheetBody(finHTML()); },
  salvarTreino: () => salvarTreino(),
  descartar: () => openSheet(t('discard_q'), `<p>${t('discard_text')}</p><button class="btn danger block" data-a="descartarSim">${t('discard')}</button><button class="btn quiet block" data-a="fecharSheet">${t('keep_training')}</button>`),
  descartarSim: () => { const pid = S.live && S.live.pid; S.live = null; stopRest(); stopWakeLock(); if (pid) Store.del('aovivo/' + pid).catch(() => {}); closeSheet(); render(); },
  fecharSheet: () => closeSheet(),
  chatEnviar: () => enviarChat(($('#chatTxt') || {}).value),
  chatChip: el => enviarChat(el.dataset.v),
  chatStop: () => { if (S.chatCtl) S.chatCtl.abort(); },
  limparChat: () => openSheet(t('clear_q'), `<p>${t('clear_text')}</p><button class="btn danger block" data-a="limparChatSim">${t('clear_chat')}</button>`),
  limparChatSim: () => { S.chat[S.me] = []; if (S.canWrite) Store.set('conversas/' + S.me, { msgs: [], atualizadoEm: Date.now() }).catch(() => {}); closeSheet(); render(); },
  apagarSessao: el => openSheet(el.dataset.col === 'cardio' ? t('delete_q_cardio') : t('delete_q_workout'), `<p>${t('delete_text')}</p><button class="btn danger block" data-a="apagarSessaoSim" data-col="${el.dataset.col === 'cardio' ? 'cardio' : 'sessoes'}" data-id="${esc(el.dataset.id)}">${t('delete')}</button>`),
  apagarSessaoSim: async el => { const id = el.dataset.id, col = el.dataset.col === 'cardio' ? 'cardio' : 'sessoes'; try { await remove(col + '/' + id); } catch { return; } S[col] = S[col].filter(s => s._id !== id); closeSheet(); render(); },
  cardioAbrir: el => abrirCardio(el.dataset.k),
  cfSess: el => { S.cform.sess = Number(el.dataset.v); prefillCardio(cardioSemanaInfo(S.me)); sheetBody(cardioHTML()); },
  cfModo: el => { S.cform.modo = el.dataset.v; sheetBody(cardioHTML()); },
  cfEsforco: el => { S.cform.esforco = Number(el.dataset.v); sheetBody(cardioHTML()); },
  cfSalvar: () => salvarCardio(),
  stModo: el => { estudioState().modo = el.dataset.v; render(); },
  stConteudo: el => { const st = estudioState(), c = CONTEUDOS.find(x => x[0] === el.dataset.v); st.conteudo = c[0]; st.minutos = c[1]; st.rodadas = null; render(); },
  stMin: el => { const st = estudioState(); st.minutos = clamp(st.minutos + Number(el.dataset.d) * 5, 15, 180); st.conteudo = (CONTEUDOS.find(x => x[1] === st.minutos) || [''])[0]; st.rodadas = null; render(); },
  stEstilo: el => { const st = estudioState(); st.estilo = el.dataset.v; st.rodadas = null; render(); },
  stRod: el => { const st = estudioState(), p = PROTO[st.estilo]; st.rodadas = clamp(montarAssistir(st).param + Number(el.dataset.d), p.min, p.max); render(); },
  stEncher: () => { const st = estudioState(); st.encher = !st.encher; render(); },
  stMaq: el => { estudioState().maqW = el.dataset.v; render(); },
  stProtoL: el => { estudioState().protoL = el.dataset.v; render(); },
  stIniciarW: () => iniciarAssistir(),
  protoAbrir: el => abrirProto(el.dataset.id, el.dataset.k),
  suParam: el => { const s = S.setup, p = PROTO[s.id]; s.param = clamp(s.param + Number(el.dataset.d) * (p.modo === 'dur' ? 5 : 1), p.min, p.max); sheetBody(setupHTML()); },
  suMaq: el => { S.setup.maq = el.dataset.v; sheetBody(setupHTML()); },
  somToggle: () => { proximoAlerta(); if (S.setup && !$('#sheet').hidden) sheetBody(setupHTML()); else render(); },
  testarSom: () => testarSom(),
  suIniciar: () => { const s = S.setup; closeSheet(); iniciarDeConfig(s.id, s.param, s.maq, s.sessao); },
  plPausa: () => pausarPlayer(),
  plPular: () => pularSeg(),
  plSom: () => { proximoAlerta(); unlockAudio(); syncNativo(); tickPlayer(true); if (vozLigada()) VOZ.falar(nomeAlerta()); },
  plFim: () => terminarPlayer(false),
  forcarAbrir: () => { if (S.forceReady) S.forceReady(); },
};
const INP = {
  wz: el => { S.wizard.d[el.dataset.k] = el.value; },
  gymOutros: el => { S.gymDraft.outros = el.value; },
  casaPedido: el => { if (S.casa) S.casa.pedido = el.value.slice(0, 300); },
  kg: el => {
    const i = +el.dataset.i, j = +el.dataset.j, x = S.live.exs[i], v = parseNum(el.value);
    x.sets[j].kg = v; x.sets[j].manual = true;
    for (let k = j + 1; k < x.sets.length; k++) if (!x.sets[k].ok) { x.sets[k].kg = v; const o = $(`#kg-${i}-${k}`); if (o) o.value = el.value; }
    saveLiveSoon();
  },
  reps: el => { const v = parseNum(el.value); live(el).sets[+el.dataset.j].reps = v == null ? null : Math.round(v); saveLiveSoon(); },
  chatTxt: el => { S.chatDraft = el.value; },
  cf: el => { if (S.cform) S.cform[el.dataset.k] = el.value; },
  heroiNome: el => { if (S.heroiDraft) S.heroiDraft.nome = el.value; },
  heroiPremio: el => { if (S.heroiDraft) S.heroiDraft.premio = el.value; },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (el && ACT[el.dataset.a] && !el.disabled) { e.preventDefault(); ACT[el.dataset.a](el, e); return; }
  if (e.target.id === 'sheet') closeSheet();
});
document.addEventListener('input', e => { const el = e.target.closest('[data-in]'); if (el && INP[el.dataset.in]) INP[el.dataset.in](el, e); });
document.addEventListener('change', e => { const el = e.target.closest('[data-in="formaVideo"]'); if (el) analisarForma(el); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

/* ---------- start ---------- */
function use(name) {
  try { return window.claude && typeof window.claude.use === 'function' ? window.claude.use(name).catch(() => null) : Promise.resolve(null); }
  catch { return Promise.resolve(null); }
}
async function boot() {
  if (atualizacaoNoInicio(boot)) return;
  setLang(LS.get('td_lang') || 'en');
  aplicarTema();
  if (!TABS_OK.includes(S.tab)) S.tab = S.tab === 'evolucao' ? 'jornada' : 'hoje';
  render();
  const [db, sample, user] = await Promise.all([use('db'), use('sample'), use('user')]);
  Store.init(db); S.mode = Store.mode; AI.fn = sample || (CHAVE.get() ? iaComChave : null);
  if (db && user) { try { S.canWrite = (await user.can('data.write')) !== false; } catch { S.canWrite = true; } }
  startSync();
  iniciarNativo();
}
boot();
