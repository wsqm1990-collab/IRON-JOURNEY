// A stand-in for the Android side, so the page's native paths can be tested in a desktop browser.
window.__calls = [];
(function () {
  const listeners = {};
  let state = null;
  function impl(name, m, o) {
    if (name === 'IronTimer') {
      if (m === 'start') { state = { kind: o.kind, id: o.id, ini: o.ini, pausa: o.pausa, pausadoEm: o.pausadoEm, running: true, ended: false }; return Promise.resolve({}); }
      if (m === 'update') { if (state && state.running) { for (const k of ['ini', 'pausa', 'pausadoEm']) if (o[k] != null) state[k] = o[k]; } return Promise.resolve({}); }
      if (m === 'stop') { if (state && state.running && (!o.kind || o.kind === state.kind)) { state.running = false; state.ended = true; state.endedAt = Date.now(); } return Promise.resolve({}); }
      if (m === 'getState') return Promise.resolve(state ? { ...state } : {});
      if (m === 'notifStatus') return Promise.resolve({ granted: false });
      if (m === 'askNotif') return Promise.resolve({ granted: true });
      if (m === 'batteryStatus') return Promise.resolve({ ignoring: false, maker: 'Mock' });
      if (m === 'info') return Promise.resolve({ shell: 1, versionCode: 7 });
      if (m === 'fetchText') return Promise.resolve({ text: JSON.stringify({ build: 8, zip: 'https://example.invalid/web.zip', sha256: '', minShell: 1 }) });
      if (m === 'fetchBundle') return Promise.resolve({ path: '/data/bundles/8' });
      return Promise.resolve({});
    }
    if (name === 'WebView' && m === 'setServerBasePath') { window.__switched = o.path; return Promise.resolve({}); }
    return Promise.resolve({});
  }
  function plugin(name) {
    return new Proxy({}, {
      get(_, m) {
        if (m === 'then') return undefined;
        if (m === 'addListener') return (evt, fn) => { (listeners[name + ':' + evt] = listeners[name + ':' + evt] || []).push(fn); return Promise.resolve({ remove() {} }); };
        return o => { window.__calls.push([name, m, JSON.parse(JSON.stringify(o || {}))]); return impl(name, m, o || {}); };
      },
    });
  }
  window.__emit = (name, evt, data) => (listeners[name + ':' + evt] || []).forEach(f => f(data));
  window.__native = () => state;
  window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', registerPlugin: plugin, Plugins: {} };
})();
