#if DEBUG || IJ_SELFTEST
import UIKit
import WebKit
import Capacitor

/// Simulator self-test, only in debug builds. native/ci/ios-sim-test.sh starts the app with
/// `-ijSelfTest 1`, then again with `-ijSelfTest 2`; the test drives the page the way a person
/// would, checks the native parts and asks the script for screenshots (files in Documents/selftest).
final class IronSelfTest {
    private static var current: IronSelfTest?
    private weak var vc: CAPBridgeViewController?
    private let phase: String
    private let dir: URL
    private var checks: [[String: Any]] = []

    static func startIfAsked(_ vc: CAPBridgeViewController) {
        let a = ProcessInfo.processInfo.arguments
        guard let i = a.firstIndex(of: "-ijSelfTest") else { return }
        let test = IronSelfTest(vc, phase: i + 1 < a.count ? a[i + 1] : "1")
        current = test
        Task { @MainActor in await test.run() }
    }

    private init(_ vc: CAPBridgeViewController, phase: String) {
        self.vc = vc
        self.phase = phase
        dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("selftest", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    }

    @MainActor private func run() async {
        ijLog("self test phase \(phase)")
        let modes = Bundle.main.infoDictionary?["UIBackgroundModes"] as? [String] ?? []
        record("allowed to play audio in the background", modes.contains("audio"), modes)
        let turns = Bundle.main.infoDictionary?["UISupportedInterfaceOrientations"] as? [String] ?? []
        record("upright only", turns == ["UIInterfaceOrientationPortrait"], turns)
        let ready = await waitReady(150)
        record("page starts", ready, ready ? "ok" : "the page never got ready")
        if ready {
            if phase == "2" { await phaseTwo() } else { await phaseOne() }
        }
        save()
        try? Data().write(to: dir.appendingPathComponent("done-\(phase)"))
        ijLog("self test phase \(phase) done")
    }

    // MARK: first launch

    @MainActor private func phaseOne() async {
        await check("native bridge on iPhone", """
          return { pass: Capacitor.getPlatform() === 'ios' && Nat.on === true && Nat.ios === true, detail: [Capacitor.getPlatform(), Nat.on, Nat.ios] };
        """)
        await check("app info", """
          const i = await Nat.call('info');
          return { pass: i.shell === 3 && i.platform === 'ios' && !!i.versionName, detail: i };
        """)
        await check("notification permission can be read", """
          const n = await Nat.call('notifStatus');
          return { pass: typeof n.granted === 'boolean', detail: n };
        """)
        await shot("home")
        await check("beep, voice, vibration, screen kept on", """
          await Nat.call('tone', { kind: 'strong' });
          await Nat.call('speak', { text: 'Teste de voz do Swordbell', lang: 'pt-BR', duck: true });
          await Nat.call('vibrate', { pattern: [200, 100, 200] });
          await Nat.call('keepAwake', { on: true });
          await Nat.call('keepAwake', { on: false });
          return { pass: true, detail: 'ok' };
        """)
        await check("interval timer runs to the end", """
          window.__ijEv = window.__ijEv || [];
          if (!window.__ijListening) { window.__ijListening = true; Nat.listen('timer', e => window.__ijEv.push(e)); }
          const t0 = Date.now();
          await Nat.call('start', { kind: 'hiit', id: 'selftest', title: 'Teste', mode: 'voz', lang: 'pt-BR', duck: true, fresh: true,
            ini: t0, pausa: 0, pausadoEm: 0, intro: 'Vamos', half: '', done: 'Fim',
            segs: [{ s: 1.5, label: 'Forte', say: '', strong: true }, { s: 1.5, label: 'Leve', say: 'Recupera', strong: false }],
            labels: { next: 'Próximo: {s} · {t}', last: 'Última parte', doneTitle: '', doneText: '' } });
          const mid = await Nat.call('getState');
          const seen = () => window.__ijEv.find(e => e.id === 'selftest' && e.type === 'done');
          for (let k = 0; k < 48 && !seen(); k++) await new Promise(r => setTimeout(r, 250));
          const end = await Nat.call('getState');
          const ev = seen();
          await Nat.call('ack');
          return { pass: !!ev && mid.running === true && end.ended === true && end.complete === true, detail: { mid, end, ev, ms: Date.now() - t0 } };
        """)
        await check("timer pause and stop from the app", """
          window.__ijEv = window.__ijEv || [];
          const t0 = Date.now();
          await Nat.call('start', { kind: 'hiit', id: 'selftest2', title: 'Teste', mode: 'mudo', lang: 'pt-BR', duck: false, fresh: false,
            ini: t0, pausa: 0, pausadoEm: 0, segs: [{ s: 30, label: 'A', say: '', strong: true }], labels: {} });
          await new Promise(r => setTimeout(r, 700));
          const p = Date.now();
          await Nat.call('update', { pausadoEm: p });
          const paused = await Nat.call('getState');
          await Nat.call('stop', { kind: 'hiit' });
          await new Promise(r => setTimeout(r, 500));
          const ev = window.__ijEv.find(e => e.id === 'selftest2' && e.type === 'stopped');
          const after = await Nat.call('getState');
          await Nat.call('ack');
          return { pass: paused.pausadoEm === p && !!ev && ev.by === 'app' && after.ended === true && after.complete === false, detail: { paused, ev, after } };
        """)
        await check("rest timer", """
          window.__ijEv = window.__ijEv || [];
          await Nat.call('start', { kind: 'rest', id: 'r-selftest', title: 'Descanso', mode: 'bipe', lang: 'pt-BR', duck: true, fresh: false,
            ini: Date.now(), pausa: 0, pausadoEm: 0, done: 'Próxima série', segs: [{ s: 1, label: 'Descanso', say: '', strong: false }], labels: { last: 'Próxima série' } });
          const seen = () => window.__ijEv.find(e => e.id === 'r-selftest' && e.type === 'done');
          for (let k = 0; k < 24 && !seen(); k++) await new Promise(r => setTimeout(r, 250));
          await Nat.call('ack');
          return { pass: !!seen(), detail: seen() || 'no done event' };
        """)
        await check("data copy outside the web view", """
          const txt = JSON.stringify({ app: 'iron-journey', v: 1, em: Date.now(), build: 'selftest', dados: { 'td:selftest/a': '{"a":1}' } });
          const s = await Nat.call('saveSnapshot', { text: txt });
          const r = await Nat.call('loadSnapshot');
          return { pass: s.ok === true && r.text === txt, detail: { saved: s.ok, length: r.text ? r.text.length : 0 } };
        """)
        await check("update check", """
          const r = await Nat.call('fetchText', { url: UPD.url });
          const v = JSON.parse(r.text);
          return { pass: Number(v.build) > 0 && String(v.zip).endsWith('web.zip'), detail: v };
        """)
        let path = await check("download and unpack the update", """
          const v = JSON.parse((await Nat.call('fetchText', { url: UPD.url })).text);
          const b = await Nat.call('fetchBundle', { url: v.zip, build: 'selftest' + v.build, sha256: v.sha256 || '' });
          return { pass: String(b.path).endsWith('selftest' + v.build), detail: b.path };
        """) as? String
        _ = await js("abrirGuia('agachamento'); return 'ok'")
        await shot("guide")
        _ = await js("closeSheet(); S.tab = 'cardio'; render(); window.scrollTo(0, 0); return 'ok'")
        await shot("cardio")
        _ = await js("S.tab = 'hoje'; render(); abrirAjustes(); return 'ok'")
        await shot("settings")
        _ = await js("closeSheet(); return 'ok'")
        if let path = path {
            _ = await js("window.__ijOld = true; setTimeout(() => Nat.call('setServerBasePath', { path: \(quoted(path)) }, 'WebView'), 100); return 'ok'")
            try? await Task.sleep(nanoseconds: 1_500_000_000)
            let fresh = await waitReady(120, fresh: true)
            record("page restarts from the downloaded update", fresh, fresh ? "ok" : "no restart")
            await check("the page now comes from the update", """
              const r = await Nat.call('getServerBasePath', {}, 'WebView');
              return { pass: String(r.path || '').indexOf('selftest') >= 0, detail: r.path };
            """)
            await check("keep the update for the next start", """
              await Nat.call('keepBundle', { path: \(quoted(path)) });
              return { pass: true, detail: 'kept' };
            """)
        }
        // for the second launch: a known data copy, and the web storage emptied as if iOS had cleared it
        await check("ready for the restore test", """
          const txt = JSON.stringify({ app: 'iron-journey', v: 1, em: Date.now(), build: 'selftest', dados: { 'td:selftest/x': '{"a":1}' } });
          const s = await Nat.call('saveSnapshot', { text: txt });
          for (const k of Object.keys(localStorage)) if (k.startsWith('td:')) localStorage.removeItem(k);
          return { pass: s.ok === true, detail: 'web storage emptied' };
        """)
        UserDefaults.standard.synchronize()
        try? await Task.sleep(nanoseconds: 3_000_000_000)  // let the web view write its storage to disk
    }

    // MARK: second launch (dark mode)

    @MainActor private func phaseTwo() async {
        await check("the kept update opens at start", """
          const r = await Nat.call('getServerBasePath', {}, 'WebView');
          return { pass: String(r.path || '').indexOf('selftest') >= 0, detail: r.path };
        """)
        await check("data comes back from the copy", """
          const v = localStorage.getItem('td:selftest/x');
          return { pass: v === '{"a":1}', detail: v };
        """)
        await shot("dark-home")
        _ = await js("abrirGuia('supino_reto_barra'); return 'ok'")
        await shot("dark-guide")
        _ = await js("closeSheet(); localStorage.removeItem('td:selftest/x'); return 'ok'")
        await check("forget the update again", """
          await Nat.call('forgetBundle');
          await Nat.call('cleanBundles', { keep: [] });
          return { pass: true, detail: 'clean' };
        """)
    }

    // MARK: helpers

    private func quoted(_ s: String) -> String {
        return "'" + s.replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "'", with: "\\'") + "'"
    }

    @MainActor private func js(_ body: String) async -> Any? {
        guard let wv = vc?.webView else { return nil }
        return await withCheckedContinuation { (c: CheckedContinuation<Any?, Never>) in
            wv.callAsyncJavaScript(body, arguments: [:], in: nil, in: .page) { result in
                switch result {
                case .success(let v): c.resume(returning: v)
                case .failure(let e): c.resume(returning: "js error: \(e.localizedDescription)")
                }
            }
        }
    }

    /// Waits for the page to be up (and, with `fresh`, for a page other than the one marked before).
    @MainActor private func waitReady(_ seconds: Double, fresh: Bool = false) async -> Bool {
        let end = Date().addingTimeInterval(seconds)
        let probe = (fresh ? "if (window.__ijOld) return 'old'; " : "")
            + "return (typeof S !== 'undefined' && S.ready && typeof Nat !== 'undefined' && Nat.on) ? 'yes' : 'no'"
        while Date() < end {
            if let r = await js(probe) as? String, r == "yes" { return true }
            try? await Task.sleep(nanoseconds: 500_000_000)
        }
        return false
    }

    /// Runs page JavaScript that returns { pass, detail } and records it.
    @MainActor @discardableResult private func check(_ name: String, _ body: String) async -> Any? {
        let wrapped = """
        try {
          const r = await (async () => {
        \(body)
          })();
          return JSON.stringify(r || { pass: false, detail: 'no result' });
        } catch (e) {
          return JSON.stringify({ pass: false, detail: 'error: ' + String((e && (e.message || e.code)) || e) });
        }
        """
        let res = await js(wrapped)
        var pass = false
        var detail: Any = "no answer"
        if let s = res as? String, let d = s.data(using: .utf8), let j = (try? JSONSerialization.jsonObject(with: d)) as? [String: Any] {
            pass = (j["pass"] as? Bool) ?? false
            detail = j["detail"] ?? NSNull()
        } else if let s = res as? String {
            detail = s
        }
        record(name, pass, detail)
        return detail
    }

    /// Asks the script for a real screenshot (with the status bar), and saves the page's own picture.
    @MainActor private func shot(_ name: String) async {
        try? await Task.sleep(nanoseconds: 900_000_000)
        let fm = FileManager.default
        let ok = dir.appendingPathComponent("shot-\(name).ok")
        try? fm.removeItem(at: ok)
        try? Data().write(to: dir.appendingPathComponent("shot-\(name).req"))
        let end = Date().addingTimeInterval(20)
        while Date() < end && !fm.fileExists(atPath: ok.path) { try? await Task.sleep(nanoseconds: 250_000_000) }
        guard let wv = vc?.webView else { return }
        let file = dir.appendingPathComponent("page-\(name).png")
        await withCheckedContinuation { (c: CheckedContinuation<Void, Never>) in
            wv.takeSnapshot(with: nil) { image, _ in
                if let png = image?.pngData() { try? png.write(to: file) }
                c.resume()
            }
        }
    }

    private func record(_ name: String, _ pass: Bool, _ detail: Any) {
        checks.append(["name": name, "pass": pass, "detail": detail])
        ijLog("selftest \(pass ? "PASS" : "FAIL") \(name)")
        save()
    }

    private func save() {
        let o: [String: Any] = ["phase": phase, "checks": checks]
        guard JSONSerialization.isValidJSONObject(o),
              let d = try? JSONSerialization.data(withJSONObject: o, options: [.prettyPrinted, .sortedKeys]) else { return }
        try? d.write(to: dir.appendingPathComponent("results-\(phase).json"))
    }
}
#endif
