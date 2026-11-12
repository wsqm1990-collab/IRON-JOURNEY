/* ---------- the phone: native Android features when the app is installed (Capacitor) ----------
   In a normal browser every call here quietly does nothing, so the same page still works there. */
const Nat = (() => {
  const C = () => window.Capacitor;
  const nativo = () => { try { return !!(C() && C().isNativePlatform && C().isNativePlatform()); } catch { return false; } };
  const cache = {};
  function plugin(name) {
    if (!nativo()) return null;
    if (cache[name]) return cache[name];
    try {
      const reg = (window.capacitorExports && window.capacitorExports.registerPlugin) || (C().registerPlugin && C().registerPlugin.bind(C()));
      cache[name] = reg ? reg(name) : (C().Plugins && C().Plugins[name]) || null;
    } catch { cache[name] = (C().Plugins && C().Plugins[name]) || null; }
    return cache[name];
  }
  return {
    get on() { return nativo() && !!plugin('IronTimer'); },
    async call(m, o, name = 'IronTimer') {
      const p = plugin(name);
      if (!p || typeof p[m] !== 'function') throw { code: 'unavailable' };
      return p[m](o || {});
    },
    safe(m, o, name) { return this.call(m, o, name).catch(e => { try { console.warn('native ' + (name || 'IronTimer') + '.' + m + ': ' + ((e && (e.message || e.code)) || String(e))); } catch { /* none */ } return null; }); },
    listen(evt, fn, name = 'IronTimer') { const p = plugin(name); if (p && typeof p.addListener === 'function') { try { p.addListener(evt, fn); } catch { /* none */ } } },
  };
})();

/* light / dark / follow the phone */
const TEMAS = [['system', ['Same as the phone', 'Igual ao celular', 'Igual que el móvil']], ['light', ['Light', 'Claro', 'Claro']], ['dark', ['Dark', 'Escuro', 'Oscuro']]];
function temaAtual() { const v = LS.get('ij_theme'); return TEMAS.some(x => x[0] === v) ? v : 'system'; }
function aplicarTema() {
  const v = temaAtual(), r = document.documentElement;
  if (v === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', v);
  if (Nat.on) Nat.safe('setStyle', { style: v === 'dark' ? 'DARK' : v === 'light' ? 'LIGHT' : 'DEFAULT' }, 'SystemBars');
}
