/* ---------- AI coach with the person's own Anthropic key ----------
   The installed app has no Claude account behind it, so it calls the Claude API directly with a
   key the person pastes in Settings. The key stays on this phone. Same interface as before:
   aiText(input, {onText, signal, modelTier}) and aiJSON(prompt, opts). */
const CHAVE = { get: () => LS.get('ij_key') || '', set: v => { LS.set('ij_key', v); LS.del('ij_ws'); }, del: () => { LS.del('ij_key'); LS.del('ij_ws'); } };
/* keys that aren't tied to a workspace must name one on every request; the app finds the Default one */
const WORKSPACE = { get: () => LS.get('ij_ws') || '', set: v => LS.set('ij_ws', v) };
async function descobrirWorkspace(key) {
  try {
    const r = await fetch('https://api.anthropic.com/v1/organizations/workspaces?include_default=true&limit=20', {
      credentials: 'omit', referrerPolicy: 'no-referrer',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    });
    if (!r.ok) return '';
    const lista = ((await r.json()) || {}).data || [];
    const w = lista.find(x => /default/i.test(x.name || '') || /default/i.test(x.id || '')) || lista[0];
    return (w && w.id) || '';
  } catch { return ''; }
}
const MODELOS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-sonnet-5-5' };
const MAX_TOKENS = { quick: 2000, default: 4000, complex: 16000 };
const erroIA = (code, extra) => Object.assign({ code }, extra || {});

async function claudeStream({ system, messages, tier = 'default', signal, onText, maxTokens }) {
  const key = CHAVE.get();
  if (!key) throw erroIA('no_key');
  let model = MODELOS[tier] || MODELOS.default, buscouWs = false;
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    let resp;
    const headers = { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    if (WORKSPACE.get()) headers['anthropic-workspace-id'] = WORKSPACE.get();
    try {
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', signal, credentials: 'omit', referrerPolicy: 'no-referrer', headers,
        body: JSON.stringify({ model, max_tokens: maxTokens || MAX_TOKENS[tier] || 4000, stream: true, ...(system ? { system } : {}), messages }),
      });
    } catch (e) {
      if (e && e.name === 'AbortError') throw erroIA('cancelled');
      throw erroIA(navigator.onLine === false ? 'offline' : 'net');
    }
    if (!resp.ok) {
      let msg = '';
      try { const j = await resp.json(); msg = (j && j.error && j.error.message) || ''; } catch { /* no body */ }
      if (resp.status === 400 && /workspace/i.test(msg)) {
        if (!buscouWs) { buscouWs = true; const ws = await descobrirWorkspace(key); if (ws && ws !== WORKSPACE.get()) { WORKSPACE.set(ws); continue; } }
        throw erroIA('no_workspace', { message: msg });
      }
      if ((resp.status === 404 || (resp.status === 400 && /model/i.test(msg))) && model !== MODELOS.default) { model = MODELOS.default; continue; }
      const code = resp.status === 401 || resp.status === 403 ? 'bad_key'
        : resp.status === 402 || /credit|billing|balance/i.test(msg) ? 'no_credit'
          : resp.status === 429 ? 'rate_limited'
            : resp.status === 413 ? 'prompt_too_large'
              : resp.status >= 500 ? 'busy' : 'refused';
      throw erroIA(code, { message: msg });
    }
    const reader = resp.body.getReader(), dec = new TextDecoder();
    let buf = '', text = '', stop = null;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true }).replace(/\r\n/g, '\n');
        let cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) {
          const chunk = buf.slice(0, cut); buf = buf.slice(cut + 2);
          const data = chunk.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('');
          if (!data) continue;
          let ev; try { ev = JSON.parse(data); } catch { continue; }
          if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') { text += ev.delta.text; if (onText) onText({ text, delta: ev.delta.text }); }
          else if (ev.type === 'message_delta' && ev.delta && ev.delta.stop_reason) stop = ev.delta.stop_reason;
          else if (ev.type === 'error') throw erroIA(ev.error && ev.error.type === 'overloaded_error' ? 'busy' : 'net', { text });
        }
      }
    } catch (e) {
      if (e && e.code) throw e;
      if (e && e.name === 'AbortError') throw erroIA('cancelled', { text });
      throw erroIA('net', { text });
    }
    if (stop === 'refusal') throw erroIA('refused', { text });
    if (!text.trim()) throw erroIA('empty_completion');
    return { text, truncated: stop === 'max_tokens' };
  }
  throw erroIA('net');
}

/* the same shape the app used with Claude's `sample`: a function plus .json */
const CACHE_IA = 'ij_ai_cache';
function hashTexto(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
async function iaComChave(input, opts = {}) {
  const lista = typeof input === 'string' ? [{ role: 'user', content: input }] : (input || []).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') }));
  const msgs = [];
  for (const m of lista) { const u = msgs[msgs.length - 1]; if (u && u.role === m.role) u.content += '\n\n' + m.content; else msgs.push({ ...m }); }
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  const usaCache = opts.cache && typeof opts.cache === 'object';
  const chave = usaCache ? hashTexto(JSON.stringify(msgs) + (opts.modelTier || '')) : '';
  if (usaCache) {
    const c = LS.get(CACHE_IA) || {}, hit = c[chave];
    if (hit && Date.now() - hit.em < (opts.cache.gcTime || 86400000)) { if (opts.onText) opts.onText({ text: hit.text }); return { text: hit.text, truncated: false }; }
  }
  const r = await claudeStream({ messages: msgs, tier: opts.modelTier || 'default', signal: opts.signal, onText: opts.onText });
  if (usaCache && !r.truncated) {
    const c = LS.get(CACHE_IA) || {};
    c[chave] = { text: r.text, em: Date.now() };
    const ks = Object.keys(c).sort((a, b) => c[b].em - c[a].em).slice(0, 30);
    LS.set(CACHE_IA, Object.fromEntries(ks.map(k => [k, c[k]])));
  }
  return r;
}
function extrairJSON(s) {
  s = String(s || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(s); } catch { /* look inside */ }
  const a = s.search(/[[{]/);
  if (a < 0) return undefined;
  const b = s.lastIndexOf(s[a] === '[' ? ']' : '}');
  if (b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch { /* not JSON */ } }
  return undefined;
}
iaComChave.json = async (prompt, opts = {}) => {
  const pedido = prompt + '\n\nReply with the JSON only: no code fences and no text before or after it.';
  for (let i = 0; i < 2; i++) {
    const { text } = await iaComChave(pedido, { ...opts, onText: null, cache: null });
    const v = extrairJSON(text);
    if (v !== undefined) return v;
  }
  throw erroIA('invalid_json');
};
async function testarChave(k) {
  const antiga = CHAVE.get();
  CHAVE.set(k);
  try { await claudeStream({ messages: [{ role: 'user', content: 'Reply with the single word: OK' }], tier: 'quick', maxTokens: 10 }); return null; }
  catch (e) { if (antiga) CHAVE.set(antiga); else CHAVE.del(); return e; }
}
Object.assign(STR, {
  ai_need_key: ['Add your AI key in Settings to use the coach.', 'Coloque sua chave de IA nas Configurações para usar o treinador.', 'Añade tu clave de IA en Ajustes para usar el entrenador.'],
  ai_bad_key: ['Your AI key was not accepted. Check it in Settings.', 'Sua chave de IA não foi aceita. Confira nas Configurações.', 'Tu clave de IA no fue aceptada. Revísala en Ajustes.'],
  ai_credit: ['Your Anthropic account is out of credit. Add credit at platform.claude.com/settings/billing and try again.', 'Sua conta da Anthropic está sem créditos. Adicione crédito em platform.claude.com/settings/billing e tente de novo.', 'Tu cuenta de Anthropic no tiene crédito. Añade crédito en platform.claude.com/settings/billing e inténtalo de nuevo.'],
  ai_workspace: ['This key isn\'t tied to a workspace. At platform.claude.com/settings/keys, create a new key and choose the Default workspace.', 'Essa chave não está ligada a um workspace. Em platform.claude.com/settings/keys, crie uma chave nova e escolha o workspace Default.', 'Esta clave no está vinculada a un workspace. En platform.claude.com/settings/keys, crea una clave nueva y elige el workspace Default.'],
  ai_busy: ['The AI service is busy right now. Try again in a moment.', 'O serviço de IA está ocupado agora. Tente de novo daqui a pouco.', 'El servicio de IA está ocupado. Inténtalo de nuevo en un momento.'],
  ai_offline: ['No internet. The coach needs a connection; your workouts work offline.', 'Sem internet. O treinador precisa de conexão; os treinos funcionam sem internet.', 'Sin internet. El entrenador necesita conexión; tus entrenamientos funcionan sin internet.'],
  ai_rate: ['Too many questions in a row. Wait a few seconds and try again.', 'Muitas perguntas seguidas. Espere alguns segundos e tente de novo.', 'Demasiadas preguntas seguidas. Espera unos segundos e inténtalo de nuevo.'],
});
