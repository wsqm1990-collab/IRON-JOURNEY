'use strict';
/* ---------- languages: English is always the default; the viewer can switch ---------- */
const LANGS = [['en', 'English', 'en-US', 'English'], ['pt', 'Português', 'pt-BR', 'Brazilian Portuguese'], ['es', 'Español', 'es-ES', 'Spanish']];
let LI = 0;
const STR = {};
function setLang(code) {
  const i = LANGS.findIndex(l => l[0] === code);
  LI = i < 0 ? 0 : i;
  try { document.documentElement.lang = LANGS[LI][2]; } catch { /* sem documento */ }
}
const LANG = () => LANGS[LI][0];
const LOC = () => LANGS[LI][2];
const LANG_IA = () => LANGS[LI][3];
/* pick from an [en, pt, es] triple */
const L3 = a => (Array.isArray(a) ? (a[LI] != null && a[LI] !== '' ? a[LI] : a[0]) : a);
function t(k, v) {
  const e = STR[k];
  let s = e ? L3(e) : k;
  if (v) s = s.replace(/\{(\w+)\}/g, (m, n) => (v[n] != null ? v[n] : m));
  return s;
}
const tn = (n, one, many, v) => t(n === 1 ? one : many, { n, ...(v || {}) });
Object.assign(STR, {
  app_sub: ['strength and cardio', 'musculação e cardio', 'fuerza y cardio'],
  close: ['Close', 'Fechar', 'Cerrar'],
  cancel: ['Cancel', 'Cancelar', 'Cancelar'],
  continue: ['Continue', 'Continuar', 'Continuar'],
  back: ['Back', 'Voltar', 'Volver'],
  save: ['Save', 'Salvar', 'Guardar'],
  delete: ['Delete', 'Apagar', 'Borrar'],
  try_again: ['Try again', 'Tentar de novo', 'Intentar de nuevo'],
  language: ['Language', 'Idioma', 'Idioma'],
  language_note: ['The coach answers in the language you choose. Plans already created keep the language they were written in.', 'O treinador responde no idioma escolhido. Planos já criados continuam no idioma em que foram escritos.', 'El entrenador responde en el idioma que elijas. Los planes ya creados siguen en el idioma en que se escribieron.'],
  tab_today: ['Today', 'Hoje', 'Hoy'],
  tab_journey: ['Journey', 'Jornada', 'Jornada'],
  tab_plan: ['Plan', 'Plano', 'Plan'],
  tab_coach: ['Coach', 'Treinador', 'Entrenador'],
  tab_progress: ['Progress', 'Evolução', 'Progreso'],
  workout_live: ['workout in progress', 'treino em andamento', 'entrenamiento en curso'],
  read_only: ['You can view but not save. Ask the person who created the app to invite you by email as an Editor.', 'Você pode ver, mas não salvar. Peça para quem criou o app te convidar pelo e-mail como Editor.', 'Puedes ver, pero no guardar. Pide a quien creó la app que te invite por correo como Editor.'],
  read_only_short: ['You can only view. Ask for an Editor invite.', 'Seu acesso é só para ver. Peça um convite como Editor.', 'Solo puedes ver. Pide una invitación como Editor.'],
  local_mode: ['This device is keeping the data only here. Open the app through Claude to save and sync.', 'Este aparelho está guardando os dados só aqui. Abra o app pelo Claude para salvar e sincronizar.', 'Este dispositivo guarda los datos solo aquí. Abre la app desde Claude para guardar y sincronizar.'],
  loading: ['Loading your training...', 'Carregando seus treinos...', 'Cargando tus entrenamientos...'],
  slow: ['This is taking longer than usual. Check your internet connection.', 'Está demorando mais que o normal. Confira a internet.', 'Está tardando más de lo normal. Revisa tu conexión.'],
  open_anyway: ['Open anyway', 'Abrir assim mesmo', 'Abrir de todos modos'],
  err_write: ['Couldn\'t save. Your access to this app is view-only: ask the person who created it to invite you by email as an Editor.', 'Não deu para salvar. Seu acesso a este app é só para ver: peça para quem criou o app te convidar pelo e-mail como Editor.', 'No se pudo guardar. Tu acceso a esta app es solo de lectura: pide a quien la creó que te invite por correo como Editor.'],
  err_quota: ['The app\'s storage is full. Delete old workouts to free up space.', 'O espaço do app encheu. Apague treinos antigos para liberar.', 'El espacio de la app está lleno. Borra entrenamientos antiguos para liberar espacio.'],
  err_busy: ['Too many actions in a row. Wait a few seconds and try again.', 'Muitas ações seguidas. Espere alguns segundos e tente de novo.', 'Demasiadas acciones seguidas. Espera unos segundos e inténtalo de nuevo.'],
  err_revoked: ['Your access to this app changed. Open the link again.', 'Seu acesso a este app mudou. Abra o link de novo.', 'Tu acceso a esta app cambió. Abre el enlace de nuevo.'],
  err_net: ['No connection to the app right now. Check your internet and try again.', 'Sem conexão com o app agora. Confira a internet e tente de novo.', 'Sin conexión con la app ahora. Revisa tu internet e inténtalo de nuevo.'],
  ai_off: ['The AI coach isn\'t available on this account. Logging workouts still works normally.', 'O treinador com IA não foi liberado nesta conta. Registrar treinos continua funcionando normalmente.', 'El entrenador con IA no está disponible en esta cuenta. Registrar entrenamientos sigue funcionando.'],
  ai_rate: ['Too many questions in a row, or your Claude usage limit was reached. Try again in a little while.', 'Muitas perguntas seguidas, ou o limite de uso da sua conta do Claude chegou. Tente de novo daqui a pouco.', 'Demasiadas preguntas seguidas, o se alcanzó el límite de uso de tu cuenta de Claude. Inténtalo de nuevo en un rato.'],
  ai_session: ['Your Claude session expired. Sign in again and retry.', 'Sua sessão do Claude expirou. Entre de novo e tente outra vez.', 'Tu sesión de Claude expiró. Inicia sesión de nuevo e inténtalo otra vez.'],
  ai_refused: ['The coach didn\'t answer that request. Try different words.', 'O treinador não respondeu a esse pedido. Tente com outras palavras.', 'El entrenador no respondió a esa petición. Prueba con otras palabras.'],
  ai_json: ['The answer came back incomplete. Tap try again.', 'A resposta veio incompleta. Toque em tentar de novo.', 'La respuesta llegó incompleta. Toca intentar de nuevo.'],
  ai_big: ['Too much information at once. Try a shorter request.', 'Informação demais de uma vez. Tente um pedido mais curto.', 'Demasiada información a la vez. Prueba una petición más corta.'],
  ai_empty: ['The coach didn\'t answer. Try again.', 'O treinador não respondeu. Tente de novo.', 'El entrenador no respondió. Inténtalo de nuevo.'],
  ai_net: ['The connection to the coach failed. Try again.', 'A conexão com o treinador falhou. Tente de novo.', 'Falló la conexión con el entrenador. Inténtalo de nuevo.'],
  ai_unavailable: ['The AI coach isn\'t available on this account.', 'O treinador com IA não está disponível nesta conta.', 'El entrenador con IA no está disponible en esta cuenta.'],
});
