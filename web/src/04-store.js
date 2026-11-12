/* ---------- storage: shared database inside Claude, or this device only as a fallback ---------- */
const Store = (() => {
  let db = null;
  const mem = new Map();
  const watchers = new Map();
  const chains = {};
  const PREFIX = 'td:';
  const collOf = p => p.split('/').slice(0, -1).join('/');
  const sortList = (arr, q) => {
    if (q && q.where) arr = arr.filter(r => r.data[q.where[0]] === q.where[2]);
    if (q && q.order) { const [f, dir] = q.order; arr.sort((a, b) => ((a.data[f] ?? 0) > (b.data[f] ?? 0) ? 1 : -1) * (dir === 'desc' ? -1 : 1)); }
    if (q && q.limit) arr = arr.slice(0, q.limit);
    return arr;
  };
  const localList = c => { const out = []; for (const [p, v] of mem) if (collOf(p) === c) out.push({ id: p.split('/').pop(), data: clone(v) }); return out; };
  const notify = path => {
    (watchers.get(path) || []).forEach(cb => cb(clone(mem.get(path) ?? null)));
    (watchers.get(collOf(path)) || []).forEach(cb => cb(localList(collOf(path))));
  };
  const addWatch = (key, cb) => { if (!watchers.has(key)) watchers.set(key, []); watchers.get(key).push(cb); return () => watchers.set(key, watchers.get(key).filter(f => f !== cb)); };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function retry(fn) {
    try { return await fn(); } catch (e) {
      if (e && e.code === 'unavailable') { await wait(500 + Math.random() * 800); return fn(); }
      throw e;
    }
  }
  function queue(path, job) {
    const p = (chains[path] || Promise.resolve()).catch(() => {}).then(job);
    chains[path] = p;
    return p;
  }
  return {
    get mode() { return db ? 'db' : 'local'; },
    init(d) {
      db = d || null;
      if (!db) for (const k of LS.keys()) if (k.startsWith(PREFIX)) mem.set(k.slice(PREFIX.length), LS.get(k));
    },
    async get(path) {
      if (!db) return clone(mem.get(path) ?? null);
      const s = await retry(() => db.doc(path).get());
      return s.exists ? clone(s.data()) : null;
    },
    set(path, data) {
      const body = clone(data);
      return queue(path, async () => {
        if (!db) { mem.set(path, body); LS.set(PREFIX + path, body); notify(path); return; }
        await retry(() => db.doc(path).set(body));
      });
    },
    del(path) {
      return queue(path, async () => {
        if (!db) { mem.delete(path); LS.del(PREFIX + path); notify(path); return; }
        await retry(() => db.doc(path).delete());
      });
    },
    watchDoc(path, cb, onErr) {
      if (!db) { const off = addWatch(path, cb); setTimeout(() => cb(clone(mem.get(path) ?? null), { fromCache: false })); return off; }
      return db.doc(path).onSnapshot(s => cb(s.exists ? clone(s.data()) : null, s.metadata), onErr);
    },
    watchColl(coll, q, cb, onErr) {
      if (!db) {
        const wrapped = list => cb(sortList(list, q), { fromCache: false });
        const off = addWatch(coll, wrapped);
        setTimeout(() => wrapped(localList(coll)));
        return off;
      }
      let ref = db.collection(coll);
      if (q && q.order) ref = ref.orderBy(q.order[0], q.order[1]);
      if (q && q.limit) ref = ref.limit(q.limit);
      return ref.onSnapshot(s => cb(s.docs.map(d => ({ id: d.id, data: clone(d.data()) })), s.metadata), onErr);
    },
  };
})();

function dbErrorText(e) {
  const c = e && e.code;
  if (c === 'invalid_argument') return t('err_write');
  if (c === 'quota_exceeded') return t('err_quota');
  if (c === 'resource_exhausted') return t('err_busy');
  if (c === 'revoked') return t('err_revoked');
  return t('err_net');
}
async function save(path, data, okMsg) {
  if (!S.canWrite) { toast(t('read_only_short')); throw { code: 'invalid_argument' }; }
  try { await Store.set(path, data); if (okMsg) toast(okMsg); }
  catch (e) { toast(dbErrorText(e)); throw e; }
}
async function remove(path) {
  try { await Store.del(path); } catch (e) { toast(dbErrorText(e)); throw e; }
}

/* ---------- app state ---------- */
const S = {
  ready: false, slow: false, mode: 'local', canWrite: true, ai: null,
  perfis: {}, ordem: [], gym: null, planos: {}, sessoes: [], cardio: [],
  me: LS.get('td_me'), tab: LS.get('td_tab') || 'hoje', sub: null,
  wizard: null, live: null, liveFor: null, chat: {}, chatLoaded: {},
  rest: null, gen: null, lastReward: null,
};
const perfil = (pid = S.me) => S.perfis[pid] || null;
const plano = (pid = S.me) => S.planos[pid] || null;
const sessoesDe = pid => S.sessoes.filter(s => s.pid === pid);
const cardioDe = pid => S.cardio.filter(s => s.pid === pid);

function setMe(pid) {
  S.me = pid; LS.set('td_me', pid);
  S.live = null; S.liveFor = null;
  loadLive();
}
async function loadLive() {
  const pid = S.me;
  if (!pid) return;
  try {
    const live = await Store.get('aovivo/' + pid);
    if (S.me !== pid) return;
    S.live = live && live.exs ? live : null;
    S.liveFor = pid;
    if (S.live) startWakeLock();
    render();
  } catch { S.liveFor = pid; }
}

function startSync() {
  const got = { perfis: false, gym: false, planos: false, sessoes: false, cardio: false };
  const slowTimer = setTimeout(() => { S.slow = true; render(); }, 10000);
  // A cached snapshot counts only when it carries data, so an empty cache never shows the
  // "create your profile" screen to someone who already has one.
  const arrived = (k, meta, hasData) => {
    if (meta && meta.fromCache && !hasData) return;
    got[k] = true;
    if (!S.ready && Object.values(got).every(Boolean)) becomeReady();
  };
  const onErr = e => { toast(dbErrorText(e)); becomeReady(); };
  function becomeReady() {
    if (S.ready) { render(); return; }
    S.ready = true; S.slow = false; clearTimeout(slowTimer);
    if (!S.perfis[S.me]) S.me = S.ordem[0] || null;
    if (S.me) loadLive();
    if (typeof aoFicarPronto === 'function') aoFicarPronto();
    render();
  }
  S.forceReady = becomeReady;
  Store.watchColl('perfis', { order: ['criadoEm', 'asc'] }, (list, meta) => {
    S.perfis = {}; S.ordem = [];
    for (const r of list) { S.perfis[r.id] = r.data; S.ordem.push(r.id); }
    if (S.ready && S.me && !S.perfis[S.me] && !(meta && meta.fromCache)) S.me = S.ordem[0] || null;
    arrived('perfis', meta, list.length > 0); softRender();
  }, onErr);
  Store.watchDoc('academia/principal', (d, meta) => { S.gym = d; arrived('gym', meta, !!d); softRender(); }, onErr);
  Store.watchColl('planos', {}, (list, meta) => {
    S.planos = {}; for (const r of list) S.planos[r.id] = r.data;
    arrived('planos', meta, list.length > 0); softRender();
  }, onErr);
  Store.watchColl('sessoes', { order: ['inicio', 'desc'], limit: 600 }, (list, meta) => {
    S.sessoes = list.map(r => ({ ...r.data, _id: r.id }));
    arrived('sessoes', meta, list.length > 0); softRender();
  }, onErr);
  Store.watchColl('cardio', { order: ['inicio', 'desc'], limit: 600 }, (list, meta) => {
    S.cardio = list.map(r => ({ ...r.data, _id: r.id }));
    arrived('cardio', meta, list.length > 0); softRender();
  }, onErr);
}
