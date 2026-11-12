/* ---------- Settings: language, look, AI key, alerts, backup, version ---------- */
I.gear = SV('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>');
const REPO = 'wsqm1990-collab/iron-journey';
const APK_URL = `https://github.com/${REPO}/releases/latest/download/IronJourney.apk`;
const versaoTexto = () => (Number(window.IJ_BUILD) ? '1.0.' + window.IJ_BUILD : 'dev');
Object.assign(STR, {
  settings: ['Settings', 'Configurações', 'Ajustes'], appearance: ['Appearance', 'Aparência', 'Apariencia'], open_settings: ['Open Settings', 'Abrir Configurações', 'Abrir Ajustes'],
  ai_coach: ['AI coach', 'Treinador com IA', 'Entrenador con IA'],
  key_why: ['The app works without it, with a built-in plan. With your own Anthropic key, the coach builds a fully personalized plan, adjusts it when you ask, explains technique and answers anything. You pay Anthropic only for what you use, usually a few cents per question.', 'O app funciona sem ela, com um plano embutido. Com a sua própria chave da Anthropic, o treinador monta um plano totalmente personalizado, ajusta quando você pede, explica a execução e responde qualquer dúvida. Você paga à Anthropic só pelo que usar, normalmente alguns centavos por pergunta.', 'La app funciona sin ella, con un plan integrado. Con tu propia clave de Anthropic, el entrenador crea un plan totalmente personalizado, lo ajusta cuando lo pides, explica la técnica y responde cualquier duda. Pagas a Anthropic solo por lo que uses, normalmente unos céntimos por pregunta.'],
  key_s1: ['Open platform.claude.com and sign in (or create an account).', 'Abra platform.claude.com e entre (ou crie uma conta).', 'Abre platform.claude.com e inicia sesión (o crea una cuenta).'],
  key_s2: ['In platform.claude.com/settings/billing, tap Buy credits and add a little credit.', 'Em platform.claude.com/settings/billing, toque em Buy credits e coloque um pouco de crédito.', 'En platform.claude.com/settings/billing, toca Buy credits y añade un poco de crédito.'],
  key_s3: ['In platform.claude.com/settings/keys, tap Create key, choose the Default workspace, copy the key and paste it below.', 'Em platform.claude.com/settings/keys, toque em Create key, escolha o workspace Default, copie a chave e cole aqui embaixo.', 'En platform.claude.com/settings/keys, toca Create key, elige el workspace Default, copia la clave y pégala abajo.'],
  key_label: ['Your Anthropic API key', 'Sua chave de API da Anthropic', 'Tu clave de API de Anthropic'], key_save: ['Save and test', 'Salvar e testar', 'Guardar y probar'],
  key_testing: ['Testing the key...', 'Testando a chave...', 'Probando la clave...'], key_ok: ['Key works. The AI coach is on.', 'A chave funciona. O treinador com IA está ligado.', 'La clave funciona. El entrenador con IA está activo.'],
  key_on: ['AI coach on', 'Treinador com IA ligado', 'Entrenador con IA activo'], key_remove: ['Remove key', 'Remover chave', 'Quitar clave'], key_removed: ['Key removed from this phone.', 'Chave removida deste celular.', 'Clave eliminada de este móvil.'],
  key_empty: ['Paste the key first.', 'Cole a chave primeiro.', 'Pega la clave primero.'], key_stays: ['The key stays only on this phone.', 'A chave fica só neste celular.', 'La clave se queda solo en este móvil.'],
  alerts_mode: ['During cardio and rest', 'No cardio e no descanso', 'En el cardio y el descanso'],
  duck_label: ['Lower the show\'s volume while the voice talks', 'Baixar o som da série enquanto a voz fala', 'Bajar el volumen de la serie mientras habla la voz'],
  bg_title: ['So alerts keep coming while you watch something:', 'Para os avisos continuarem enquanto você assiste:', 'Para que los avisos sigan mientras ves algo:'],
  bg_notif: ['Notifications allowed', 'Notificações permitidas', 'Notificaciones permitidas'], bg_battery: ['Running in the background allowed', 'Funcionar em segundo plano permitido', 'Funcionar en segundo plano permitido'],
  bg_note: ['If the phone ever cuts the voice mid-workout, open Settings > Apps > Iron Journey > Battery and choose "Unrestricted" (or turn on autostart).', 'Se o celular cortar a voz no meio do treino, abra Configurações > Apps > Iron Journey > Bateria e escolha "Sem restrições" (ou ative a inicialização automática).', 'Si el móvil corta la voz a mitad del entrenamiento, abre Ajustes > Apps > Iron Journey > Batería y elige "Sin restricciones" (o activa el inicio automático).'],
  allow: ['Allow', 'Permitir', 'Permitir'],
  backup: ['Backup', 'Cópia de segurança', 'Copia de seguridad'],
  backup_note: ['Your workouts are saved only on this phone. Save a copy now and then (to Google Drive, for example) so you never lose them.', 'Seus treinos ficam salvos só neste celular. Salve uma cópia de vez em quando (no Google Drive, por exemplo) para nunca perder.', 'Tus entrenamientos se guardan solo en este móvil. Guarda una copia de vez en cuando (en Google Drive, por ejemplo) para no perderlos.'],
  backup_save: ['Save a copy', 'Salvar uma cópia', 'Guardar una copia'], backup_restore: ['Restore from a copy', 'Restaurar de uma cópia', 'Restaurar desde una copia'],
  backup_bad: ['That file isn\'t an Iron Journey copy.', 'Esse arquivo não é uma cópia do Iron Journey.', 'Ese archivo no es una copia de Iron Journey.'], backup_fail: ['Couldn\'t create the copy. Try again.', 'Não deu para criar a cópia. Tente de novo.', 'No se pudo crear la copia. Inténtalo de nuevo.'],
  restore_q: ['Replace everything on this phone with the copy from {d}? Workouts saved after that date will be lost.', 'Trocar tudo deste celular pela cópia de {d}? Treinos salvos depois dessa data serão perdidos.', '¿Reemplazar todo en este móvil por la copia del {d}? Se perderán los entrenamientos guardados después de esa fecha.'],
  restore_yes: ['Restore', 'Restaurar', 'Restaurar'],
  version_x: ['Iron Journey {v} · updates install by themselves', 'Iron Journey {v} · as atualizações chegam sozinhas', 'Iron Journey {v} · las actualizaciones se instalan solas'],
  updating: ['Updating Iron Journey...', 'Atualizando o Iron Journey...', 'Actualizando Iron Journey...'], updated_to: ['Updated to version {v}.', 'Atualizado para a versão {v}.', 'Actualizado a la versión {v}.'],
  need_apk: ['A new version needs a quick reinstall.', 'Uma versão nova precisa de uma reinstalação rápida.', 'Una versión nueva necesita una reinstalación rápida.'], get_apk: ['Download', 'Baixar', 'Descargar'],
  coach_need_key: ['The chat coach uses AI. Add your Anthropic key in Settings to talk to it. Your plan, workouts and journey work without it.', 'O treinador do chat usa IA. Coloque sua chave da Anthropic nas Configurações para conversar com ele. O plano, os treinos e a jornada funcionam sem ela.', 'El entrenador del chat usa IA. Añade tu clave de Anthropic en Ajustes para hablar con él. Tu plan, tus entrenamientos y la jornada funcionan sin ella.'],
  plan_local_note: ['Built-in coach: a solid evidence-based plan right away. Add your AI key in Settings for a plan tailored by AI.', 'Treinador embutido: um plano sólido, baseado em evidências, na hora. Coloque sua chave de IA nas Configurações para um plano feito sob medida pela IA.', 'Entrenador integrado: un plan sólido y basado en evidencia al instante. Añade tu clave de IA en Ajustes para un plan a medida hecho por IA.'],
});

function abrirAjustes() { S.ajustes = true; openSheet(t('settings'), ajustesHTML(), () => { S.ajustes = false; }); statusSegundoPlano(); }
function ajustesHTML() {
  const k = CHAVE.get();
  const ia = k
    ? `<p class="small"><b style="color:var(--ok)">✓ ${t('key_on')}</b> · <span class="muted num">${esc(k.slice(0, 10))}…${esc(k.slice(-4))}</span></p><button class="btn ghost block" data-a="chaveRemover">${t('key_remove')}</button>`
    : `<p class="small muted">${t('key_why')}</p><ol class="small stack" style="margin:0;padding-left:20px"><li>${t('key_s1')}</li><li>${t('key_s2')}</li><li>${t('key_s3')}</li></ol>
       <label class="f" for="key-in">${t('key_label')}<input class="inp" id="key-in" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="sk-ant-..."></label>
       <button class="btn block" data-a="chaveSalvar">${t('key_save')}</button><p class="xs muted">${t('key_stays')}</p><div id="keyMsg"></div>`;
  return `<div class="stack">
    <div class="stack"><p class="eyebrow">${t('language')}</p><div class="seg">${LANGS.map(([c, n]) => `<button data-a="setIdioma" data-v="${c}" aria-pressed="${LANG() === c}">${n}</button>`).join('')}</div></div>
    <div class="stack"><p class="eyebrow">${t('appearance')}</p><div class="seg">${TEMAS.map(([v, n]) => `<button data-a="setTema" data-v="${v}" aria-pressed="${temaAtual() === v}">${esc(L3(n))}</button>`).join('')}</div></div>
    <div class="card pad stack"><h3 class="h3">${t('ai_coach')}</h3>${ia}</div>
    <div class="card pad stack"><h3 class="h3">${t('alerts')}</h3>
      <div class="row between"><span class="small">${t('alerts_mode')}</span><button class="chip" data-a="somToggleAj" aria-pressed="true">${nomeAlerta()}</button></div>
      <div class="row between" style="gap:12px"><span class="small">${t('duck_label')}</span><button class="chip" data-a="duckToggle" aria-pressed="${duckOn()}">${duckOn() ? t('on') : t('off')}</button></div>
      <button class="btn ghost block" data-a="testarSom">${t('test_sound')}</button>
      ${Nat.on ? '<div id="bgStatus" class="stack"></div>' : ''}
    </div>
    <div class="card pad stack"><h3 class="h3">${t('backup')}</h3><p class="small muted">${t('backup_note')}</p>
      <button class="btn ghost block" data-a="backupSalvar">${t('backup_save')}</button>
      <label class="btn ghost block" for="backupIn">${t('backup_restore')}</label><input type="file" id="backupIn" accept="application/json,.json" hidden>
    </div>
    <p class="xs muted num">${t('version_x', { v: versaoTexto() })}</p>
  </div>`;
}
async function statusSegundoPlano() {
  if (!Nat.on || !$('#bgStatus')) return;
  const [n, b] = await Promise.all([Nat.safe('notifStatus'), Nat.safe('batteryStatus')]);
  const el = $('#bgStatus');
  if (!el) return;
  const linha = (txt, ok, acao) => `<div class="row between" style="gap:12px"><span class="small">${txt}</span>${ok ? '<b class="small" style="color:var(--ok)">✓</b>' : `<button class="btn small" data-a="${acao}">${t('allow')}</button>`}</div>`;
  el.innerHTML = `<p class="small">${t('bg_title')}</p>${linha(t('bg_notif'), n && n.granted, 'pedirNotif')}${linha(t('bg_battery'), b && b.ignoring, 'abrirBateria')}<p class="xs muted">${t('bg_note')}</p>`;
}
async function salvarChave() {
  const inp = $('#key-in'), k = ((inp && inp.value) || '').trim();
  if (!k) { toast(t('key_empty')); return; }
  const msg = $('#keyMsg');
  if (msg) msg.innerHTML = `<p class="small muted">${t('key_testing')}</p>`;
  const erro = await testarChave(k);
  if (erro) { if (msg) msg.innerHTML = `<div class="note err">${esc(aiErrorText(erro) || t('ai_bad_key'))}</div>`; return; }
  AI.fn = iaComChave; AI.off = false;
  toast(t('key_ok')); sheetBody(ajustesHTML()); statusSegundoPlano(); render();
}

/* ---------- backup: one JSON file the person keeps wherever they like ---------- */
const PREFS_BACKUP = ['td_lang', 'td_alerta', 'td_me', 'ij_theme', 'ij_duck', 'ij_svc'];
function dadosBackup() {
  const dados = {};
  for (const k of LS.keys()) if (k.startsWith('td:') || PREFS_BACKUP.includes(k)) { try { dados[k] = localStorage.getItem(k); } catch { /* skip */ } }
  return { app: 'iron-journey', v: 1, em: Date.now(), build: window.IJ_BUILD || 'dev', dados };
}
async function salvarBackup() {
  const txt = JSON.stringify(dadosBackup()), nome = 'iron-journey-' + dayKey(Date.now()) + '.json';
  if (Nat.on) { try { await Nat.call('shareFile', { name: nome, text: txt, mime: 'application/json', title: t('backup_save') }); } catch { toast(t('backup_fail')); } return; }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = nome; document.body.appendChild(a); a.click(); a.remove(); } catch { toast(t('backup_fail')); }
}
document.addEventListener('change', e => {
  if (!e.target || e.target.id !== 'backupIn' || !e.target.files || !e.target.files[0]) return;
  const fr = new FileReader();
  fr.onload = () => {
    let j = null; try { j = JSON.parse(fr.result); } catch { /* not JSON */ }
    if (!j || j.app !== 'iron-journey' || !j.dados) { toast(t('backup_bad')); return; }
    S.backupPend = j;
    openSheet(t('backup_restore'), `<div class="stack"><p>${esc(t('restore_q', { d: new Date(j.em).toLocaleDateString(LOC()) }))}</p><button class="btn danger block" data-a="backupAplicar">${t('restore_yes')}</button><button class="btn quiet block" data-a="fecharSheet">${t('cancel')}</button></div>`);
  };
  fr.readAsText(e.target.files[0]);
});
function aplicarBackup() {
  const j = S.backupPend;
  if (!j) return;
  for (const k of LS.keys()) if (k.startsWith('td:')) LS.del(k);
  for (const [k, v] of Object.entries(j.dados)) { try { localStorage.setItem(k, v); } catch { /* full */ } }
  location.reload();
}

/* ---------- automatic updates ----------
   Every build publishes the app's page as a small zip with the release. The installed app checks
   for a newer one, downloads it in the background and switches to it the next time it's idle.
   A new version only stays if it starts fine; otherwise the app goes back to the previous one. */
const UPD = { busy: false, url: `https://github.com/${REPO}/releases/latest/download/version.json` };
const buildAtual = () => Number(window.IJ_BUILD) || 0;
function ocioso() {
  return !S.live && !(typeof P !== 'undefined' && P.on) && $('#sheet').hidden && !S.wizard && !S.chatBusy && !S.gen && document.visibilityState === 'visible';
}
async function checarAtualizacao(forcar) {
  if (!Nat.on || !buildAtual() || UPD.busy) return;
  const ult = LS.get('ij_upd_em') || 0;
  if (!forcar && Date.now() - ult < 3 * 3600000) return;
  UPD.busy = true;
  try {
    const r = await Nat.call('fetchText', { url: UPD.url });
    LS.set('ij_upd_em', Date.now());
    const v = JSON.parse((r && r.text) || '{}');
    const ruins = LS.get('ij_bad') || [];
    if (!(Number(v.build) > buildAtual()) || ruins.includes(Number(v.build))) return;
    const info = await Nat.safe('info');
    if (v.minShell && (!info || (info.shell || 1) < v.minShell)) { S.precisaApk = true; render(); return; }
    const res = await Nat.call('fetchBundle', { url: v.zip, build: String(v.build), sha256: v.sha256 || '' });
    LS.set('ij_staged', { build: Number(v.build), path: res.path });
    if (ocioso()) aplicarAtualizacao();
  } catch (e) {
    try { console.warn('update check', (e && (e.message || e.code)) || e); } catch { /* none */ }
  } finally { UPD.busy = false; }
}
function aplicarAtualizacao(seFalhar) {
  const st = LS.get('ij_staged');
  if (!Nat.on || !st || !(st.build > buildAtual())) { if (st && !(st.build > buildAtual())) LS.del('ij_staged'); return false; }
  LS.set('ij_trying', st.build); LS.set('ij_trying_path', st.path); LS.del('ij_staged');
  toast(t('updating'));
  Nat.call('setServerBasePath', { path: st.path }, 'WebView').catch(() => { LS.del('ij_trying'); if (seFalhar) seFalhar(); });
  return true;
}
/* a new version that started fine becomes the saved one; one that fell back is never tried again */
function confirmarVersao() {
  const tr = LS.get('ij_trying'), caminho = LS.get('ij_trying_path');
  if (tr == null) return;
  LS.del('ij_trying'); LS.del('ij_trying_path');
  if (Number(tr) === buildAtual()) {
    Nat.safe('keepBundle', { path: caminho || '' });
    Nat.safe('cleanBundles', { keep: [String(tr), String(caminho || '').split('/').pop()] });
    toast(t('updated_to', { v: versaoTexto() }));
  } else {
    const ruins = LS.get('ij_bad') || [];
    if (!ruins.includes(Number(tr))) ruins.push(Number(tr));
    LS.set('ij_bad', ruins.slice(-10));
  }
}
/* at start: a downloaded update is applied right away when nothing is in progress */
function atualizacaoNoInicio(seFalhar) {
  if (!Nat.on) return false;
  const st = LS.get('ij_staged');
  if (!st || !(st.build > buildAtual())) return false;
  const me = LS.get('td_me'), aoVivo = me && LS.get('td:aovivo/' + me);
  if (LS.get('td_player') || (aoVivo && aoVivo.exs)) return false;
  return aplicarAtualizacao(seFalhar);
}

/* ---------- Android back button, coming back to the app ---------- */
function voltar() {
  if (!$('#sheet').hidden) { closeSheet(); return; }
  if (typeof P !== 'undefined' && P.on) { Nat.safe('minimizeApp', {}, 'App'); return; }
  if (S.sub === 'wizard' && S.wizard) { if (S.wizard.step > 0) ACT.wzVoltar(); else ACT.wzSair(); return; }
  if (S.sub === 'gym') { ACT.gymSair(); return; }
  if (S.tab !== 'hoje') { S.tab = 'hoje'; LS.set('td_tab', 'hoje'); render(); window.scrollTo(0, 0); return; }
  Nat.safe('minimizeApp', {}, 'App');
}
function iniciarNativo() {
  if (!Nat.on) return;
  Nat.listen('timer', eventoTimer);
  Nat.listen('backButton', voltar, 'App');
  Nat.listen('resume', () => {
    if (typeof P !== 'undefined' && P.on) sincronizarDoNativo();
    if (S.ajustes) statusSegundoPlano();
    if (LS.get('ij_staged') && ocioso()) aplicarAtualizacao(); else checarAtualizacao();
  }, 'App');
}
