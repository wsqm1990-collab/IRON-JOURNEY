import Foundation
import UIKit

/// Runs a guided timeline (HIIT intervals or a rest timer) so the voice, beeps and vibration keep
/// coming while another app (Netflix, YouTube...) fills the screen. The web app sends the whole
/// timeline once; after that this clock owns the time. Same behaviour as the Android service.
///
/// Time model (same as the web player): elapsed = (pausedAt || now) - start - pausedTotal.
///
/// To keep running behind other apps, the app plays a silent sound the whole time (iPhones only
/// keep apps running in the background while they play audio). If iOS stops the app anyway,
/// notifications scheduled for the next changes still announce them.
final class IronClock {
    static let shared = IronClock()
    weak var plugin: IronTimerPlugin?

    struct Seg {
        var ms: Double
        var label: String
        var say: String
        var strong: Bool
        var round: String
    }

    private(set) var running = false
    private var kind = "hiit", id = "", title = "", mode = "voz", lang = "en-US"
    private var duck = true, fresh = false
    private var segs: [Seg] = []
    private var intro = "", half = "", done = ""
    private var labels: [String: String] = [:]
    private var ini: Double = 0, pausa: Double = 0, pausadoEm: Double = 0
    private var idx = -1, halfIdx = -1
    private var lastBeep = ""
    private var timer: DispatchSourceTimer?
    private var everyMs = 0
    private static let stateKey = "ij_timer_state"

    // MARK: plan

    func start(_ o: [AnyHashable: Any]) -> Bool {
        guard let raw = o["segs"] as? [Any], !raw.isEmpty else { return false }
        kind = jStr(o["kind"], "hiit")
        id = jStr(o["id"])
        title = jStr(o["title"])
        mode = jStr(o["mode"], "voz")
        lang = jStr(o["lang"], "en-US")
        duck = jBool(o["duck"], true)
        fresh = jBool(o["fresh"], false)
        intro = jStr(o["intro"])
        half = jStr(o["half"])
        done = jStr(o["done"])
        labels = [:]
        if let lb = o["labels"] as? [AnyHashable: Any] {
            for (k, v) in lb { if let key = k as? String { labels[key] = jStr(v) } }
        }
        segs = raw.map { item in
            let s = (item as? [AnyHashable: Any]) ?? [:]
            return Seg(ms: max(1000, (jNum(s["s"], 1) * 1000).rounded()), label: jStr(s["label"]), say: jStr(s["say"]),
                       strong: jBool(s["strong"], false), round: jStr(s["round"]))
        }
        let now = ijNow()
        ini = jNum(o["ini"], now)
        pausa = jNum(o["pausa"], 0)
        pausadoEm = jNum(o["pausadoEm"], 0)
        idx = -1
        halfIdx = -1
        lastBeep = ""
        running = true
        IronAudio.shared.prepare(lang)
        IronAudio.shared.startKeepAlive()
        saveState(ended: false, complete: false, endedAt: 0)
        schedule()
        rescheduleBackup()
        ijLog("start kind=\(kind) id=\(id) segs=\(segs.count) fresh=\(fresh) mode=\(mode)")
        return true
    }

    /// New timing or settings from the app (pause, resume, skip, alert mode).
    func apply(_ o: [AnyHashable: Any]) {
        guard running else { return }
        if o["ini"] != nil { ini = jNum(o["ini"], ini) }
        if o["pausa"] != nil { pausa = jNum(o["pausa"], pausa) }
        if o["pausadoEm"] != nil { pausadoEm = jNum(o["pausadoEm"], pausadoEm) }
        if o["mode"] != nil { mode = jStr(o["mode"], mode) }
        if o["duck"] != nil { duck = jBool(o["duck"], duck) }
        saveState(ended: false, complete: false, endedAt: 0)
        schedule()
        rescheduleBackup()
        ijLog("update paused=\(pausadoEm > 0) mode=\(mode)")
    }

    func stopFromApp(_ onlyKind: String) {
        guard running else { return }
        if !onlyKind.isEmpty && onlyKind != kind { return }
        finish(complete: false, by: "app")
    }

    private func elapsed() -> Double {
        let e = (pausadoEm > 0 ? pausadoEm : ijNow()) - ini - pausa
        return max(0, e)
    }

    // MARK: the clock

    private func schedule() {
        let ms = pausadoEm > 0 ? 1000 : 200
        if timer != nil && ms == everyMs {
            tick()
            return
        }
        timer?.cancel()
        everyMs = ms
        let t = DispatchSource.makeTimerSource(queue: .main)
        t.schedule(deadline: .now(), repeating: .milliseconds(ms), leeway: .milliseconds(25))
        t.setEventHandler { [weak self] in self?.tick() }
        t.resume()
        timer = t
    }

    private func tick() {
        guard running else { return }
        let e = elapsed()
        var i = 0
        var acc = 0.0
        while i < segs.count && e >= acc + segs[i].ms { acc += segs[i].ms; i += 1 }
        if i >= segs.count { finish(complete: true, by: "app"); return }
        let left = acc + segs[i].ms - e
        if i != idx {
            let changed = idx != -1
            idx = i
            if changed {
                cue(i)
                rescheduleBackup()
            } else if fresh {
                fresh = false
                if mode == "voz" && !intro.isEmpty { sayLater(intro, 0.3) }
            }
        }
        if pausadoEm == 0 {
            let rs = Int((left / 1000).rounded(.up))
            let key = "\(i):\(rs)"
            if rs >= 1 && rs <= 3 && segs[i].ms >= 10000 && key != lastBeep {
                lastBeep = key
                if mode != "mudo" { IronAudio.shared.tone("count") }
                IronHaptics.play([60])
            }
            if segs[i].ms >= 60000 && halfIdx != i && left <= segs[i].ms / 2 && left > segs[i].ms / 2 - 2000 {
                halfIdx = i
                if mode == "voz" && !half.isEmpty { IronAudio.shared.say(half, lang: lang, duck: duck) }
            }
        }
    }

    private func cue(_ i: Int) {
        let s = segs[i]
        if mode != "mudo" { IronAudio.shared.tone(s.strong ? "strong" : "easy") }
        IronHaptics.play(s.strong ? [250, 90, 250, 90, 250] : [600])
        if mode == "voz" && !s.say.isEmpty { sayLater(s.say, 0.45) }
        ijLog("cue seg=\(i) strong=\(s.strong) mode=\(mode) say=\(s.say)")
    }

    private func sayLater(_ text: String, _ seconds: Double) {
        let l = lang, d = duck
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds) { IronAudio.shared.say(text, lang: l, duck: d) }
    }

    private func finish(complete: Bool, by: String) {
        guard running else { return }
        running = false
        timer?.cancel()
        timer = nil
        everyMs = 0
        IronNotes.cancelBackup()
        let endedAt = pausadoEm > 0 ? pausadoEm : ijNow()
        let rest = kind == "rest"
        if complete {
            if mode != "mudo" { IronAudio.shared.tone(rest ? "rest" : "done") }
            IronHaptics.play(rest ? [220, 120, 220] : [200, 80, 200, 80, 400])
            if mode == "voz" && !done.isEmpty { sayLater(done, rest ? 0.35 : 0.7) }
        }
        saveState(ended: true, complete: complete, endedAt: endedAt)
        var ev = stateDict("state")
        ev["type"] = complete ? "done" : "stopped"
        ev["by"] = by
        ev["endedAt"] = endedAt
        plugin?.emit(ev)
        if complete && !rest, let t = labels["doneTitle"], !t.isEmpty, UIApplication.shared.applicationState != .active {
            IronNotes.postDone(t, labels["doneText"] ?? "")
        }
        IronAudio.shared.stopKeepAlive(after: complete ? 5 : 0.5)
        ijLog("finish complete=\(complete) kind=\(kind) by=\(by)")
    }

    // MARK: notifications in case iOS stops the app anyway

    /// One notification for each of the next changes, 1.5 s after it. While the app runs, every
    /// change it announces itself cancels and re-plans them, so they only show if it was stopped.
    private func rescheduleBackup() {
        guard running, pausadoEm == 0 else { IronNotes.cancelBackup(); return }
        let e = elapsed()
        var acc = 0.0
        var items: [IronNotes.Item] = []
        for (i, s) in segs.enumerated() {
            acc += s.ms
            if acc <= e { continue }
            let inSeconds = (acc - e) / 1000 + 1.5
            if i + 1 < segs.count {
                let n = segs[i + 1]
                let head = n.label + (n.round.isEmpty ? "" : " · " + n.round)
                items.append(IronNotes.Item(seconds: inSeconds, title: head.isEmpty ? title : head, body: n.say.isEmpty ? title : n.say))
            } else if kind == "rest" {
                items.append(IronNotes.Item(seconds: inSeconds, title: labels["last"] ?? title, body: done))
            } else {
                items.append(IronNotes.Item(seconds: inSeconds, title: labels["doneTitle"] ?? title, body: labels["doneText"] ?? done))
            }
            if items.count >= IronNotes.backupIds.count { break }
        }
        IronNotes.scheduleBackup(items)
    }

    // MARK: state shared with the app

    private func stateDict(_ type: String) -> [String: Any] {
        return ["type": type, "kind": kind, "id": id, "ini": ini, "pausa": pausa, "pausadoEm": pausadoEm, "running": running]
    }

    private func saveState(ended: Bool, complete: Bool, endedAt: Double) {
        var o = stateDict("state")
        o["ended"] = ended
        o["complete"] = complete
        o["endedAt"] = endedAt
        UserDefaults.standard.set(o, forKey: Self.stateKey)
    }

    /// What the app sees when it comes back: the live session, or how the last one ended.
    func readState() -> [String: Any] {
        if running {
            var o = stateDict("state")
            o["ended"] = false
            return o
        }
        var o = UserDefaults.standard.dictionary(forKey: Self.stateKey) ?? [:]
        o["running"] = false
        return o
    }

    func clearEnded() {
        if running { return }
        UserDefaults.standard.removeObject(forKey: Self.stateKey)
        IronNotes.clearDone()
    }
}
