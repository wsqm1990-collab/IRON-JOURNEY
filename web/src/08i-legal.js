/* ---------- privacy policy, terms, consent and "delete my data" ----------
   The texts live in docs/*.md (public on GitHub, where the store pages link to) and the build puts
   the same texts inside the app (window.IJ_LEGAL), so they read offline too. Health data (weight,
   measurements, pain) needs each person's consent: a new profile ticks it in the first step, an
   older profile is asked once. "Delete my data" wipes everything the app keeps on the phone. */
Object.assign(STR, {
  privacy: ['Privacy policy', 'Política de privacidade', 'Política de privacidad'],
  terms: ['Terms of use', 'Termos de uso', 'Términos de uso'],
  legal_title: ['Privacy and terms', 'Privacidade e termos', 'Privacidad y términos'],
  legal_online: ['Open the online version', 'Abrir a versão online', 'Abrir la versión en línea'],
  consent_check: ['I have read and accept the Terms of use and the Privacy policy, and I allow the app to use my health data (such as weight, measurements and pain) to build and follow my training.', 'Li e aceito os Termos de uso e a Política de privacidade, e autorizo o app a usar meus dados de saúde (como peso, medidas e dores) para montar e acompanhar meu treino.', 'He leído y acepto los Términos de uso y la Política de privacidad, y autorizo a la app a usar mis datos de salud (como peso, medidas y dolores) para crear y seguir mi entrenamiento.'],
  consent_err: ['To continue, tick that you agree to the terms.', 'Para continuar, marque que você concorda com os termos.', 'Para continuar, marca que aceptas los términos.'],
  health_note: ['Swordbell does not replace a doctor. If you have a health condition, talk to a doctor before you start, and stop if you feel strong pain, chest pain or dizziness.', 'O Swordbell não substitui um médico. Se você tem algum problema de saúde, converse com um médico antes de começar, e pare se sentir dor forte, dor no peito ou tontura.', 'Swordbell no reemplaza a un médico. Si tienes algún problema de salud, habla con un médico antes de empezar, y para si sientes dolor fuerte, dolor en el pecho o mareo.'],
  consent_title: ['Before you continue', 'Antes de continuar', 'Antes de continuar'],
  consent_intro: ['{n}, the app now has terms of use and a privacy policy. Your data stays on your phone, and the AI coach only receives what each answer needs.', '{n}, o app agora tem termos de uso e política de privacidade. Seus dados continuam no seu celular, e o treinador de IA só recebe o que cada resposta precisa.', '{n}, la app ahora tiene términos de uso y política de privacidad. Tus datos siguen en tu móvil, y el entrenador de IA solo recibe lo que cada respuesta necesita.'],
  consent_ok: ['I agree', 'Concordo', 'Acepto'],
  consent_later: ['Not now', 'Agora não', 'Ahora no'],
  delete_data: ['Delete my data', 'Apagar meus dados', 'Borrar mis datos'],
  delete_all_q: ['Delete all your data?', 'Apagar todos os seus dados?', '¿Borrar todos tus datos?'],
  delete_all_text: ['Profiles, plans, workouts, cardio, conversations with the coach, your AI key and the journey are deleted from this phone. This can\'t be undone, so save a copy first if you want one.', 'Perfis, planos, treinos, cardio, conversas com o treinador, sua chave de IA e a jornada saem deste celular. Não dá para desfazer, então salve uma cópia antes, se quiser.', 'Se borran de este móvil los perfiles, planes, entrenamientos, cardio, conversaciones con el entrenador, tu clave de IA y la jornada. No se puede deshacer, así que guarda una copia antes si quieres.'],
  delete_all_yes: ['Delete everything', 'Apagar tudo', 'Borrar todo'],
});
const ACEITE_V = 1;
const aceitouPerfil = p => !!(p && p.aceite && p.aceite.v >= ACEITE_V);
const LEGAL_ARQ = { privacidade: ['privacy.md', 'privacidade.md', 'privacidad.md'], termos: ['terms.md', 'termos.md', 'terminos.md'] };
const legalURL = q => `https://github.com/${REPO}/blob/main/docs/${L3(LEGAL_ARQ[q])}`;
/* the markdown of docs/, without the language links and the title (the sheet shows it) */
function legalTexto(q) {
  const txt = (window.IJ_LEGAL || {})[q] || [];
  return String(L3(txt) || txt[0] || '').split('\n').filter(l => !/^\s*\[[^\]]+\]\([^)]*\)\s*(·|$)/.test(l) && !/^#\s/.test(l)).join('\n')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
}
function abrirLegal(q) {
  if (!LEGAL_ARQ[q]) return;
  const volta = S.aceitePend ? `<button class="btn block" data-a="aceiteVoltar">${t('back')}</button>` : '';
  openSheet(t(q === 'termos' ? 'terms' : 'privacy'), `<div class="stack">${volta}<div class="md legal">${md(legalTexto(q))}</div>
    <a class="svc" href="${esc(legalURL(q))}" data-pkg="" data-url="1" target="_blank" rel="noopener noreferrer">${t('legal_online')} <span aria-hidden="true">↗</span></a>${volta}</div>`);
}
function aceiteHTML(d) {
  const on = aceitouPerfil(d);
  return `<div class="stack" style="gap:10px">
    <button type="button" class="aceite" data-a="wzAceite" role="checkbox" aria-checked="${on}"><i>${on ? I.check : ''}</i><span>${t('consent_check')}</span></button>
    <div class="row" style="gap:4px;flex-wrap:wrap"><button class="btn quiet small" data-a="legal" data-v="termos">${t('terms')}</button><button class="btn quiet small" data-a="legal" data-v="privacidade">${t('privacy')}</button></div>
    <p class="xs muted" style="margin:0">${t('health_note')}</p>
  </div>`;
}
/* a profile from before the terms: ask once, at a calm moment */
function pedirAceite(forcar) {
  const p = perfil();
  if (!p || aceitouPerfil(p) || S.live || S.sub || (!forcar && !$('#sheet').hidden)) return;
  S.aceitePend = true;
  openSheet(t('consent_title'), `<div class="stack">
    <p>${esc(t('consent_intro', { n: p.nome }))}</p>
    <div class="row" style="gap:4px;flex-wrap:wrap"><button class="btn quiet small" data-a="legal" data-v="termos">${t('terms')}</button><button class="btn quiet small" data-a="legal" data-v="privacidade">${t('privacy')}</button></div>
    <p class="small">${t('consent_check')}</p>
    <p class="xs muted">${t('health_note')}</p>
    <button class="btn ok big block" data-a="aceiteOk">${t('consent_ok')}</button>
    <button class="btn quiet block" data-a="fecharSheet">${t('consent_later')}</button>
  </div>`, () => { S.aceitePend = false; });
}
async function registrarAceite() {
  const pid = S.me, p = perfil(pid);
  if (!p) return;
  const np = { ...p, aceite: { v: ACEITE_V, em: Date.now() } };
  try { await save('perfis/' + pid, np); } catch { return; }
  S.perfis[pid] = np;
  closeSheet();
}
function pedirApagarDados() {
  openSheet(t('delete_all_q'), `<div class="stack"><p>${t('delete_all_text')}</p>
    <button class="btn ghost block" data-a="backupSalvar">${t('backup_save')}</button>
    <button class="btn danger block" data-a="apagarTudoSim">${t('delete_all_yes')}</button>
    <button class="btn quiet block" data-a="fecharSheet">${t('cancel')}</button></div>`);
}
/* keeps only the app's own update bookkeeping and the look (language, theme): nothing about the person */
const MANTER_AO_APAGAR = ['ij_staged', 'ij_trying', 'ij_trying_path', 'ij_bad', 'ij_upd_em', 'ij_theme', 'td_lang'];
async function apagarTudo() {
  try { stopRest(); } catch { /* not resting */ }
  Nat.safe('stop', { kind: 'rest' }); Nat.safe('stop', { kind: 'hiit' });
  for (const k of LS.keys()) if (!MANTER_AO_APAGAR.includes(k)) LS.del(k);
  /* the iPhone keeps a copy of the data in the app's files: replace it with an empty one */
  if (Nat.ios) await Nat.safe('saveSnapshot', { text: JSON.stringify({ app: 'iron-journey', dados: {}, apagadoEm: Date.now() }) });
  location.reload();
}
