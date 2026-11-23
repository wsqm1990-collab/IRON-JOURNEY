import Foundation
import UIKit
import AVFoundation
import AudioToolbox
import UserNotifications

/// Beeps, the voice, and the silent sound that keeps the app running behind other apps.
/// All of it mixes with what is already playing (a show, music) and never stops it; while the
/// voice talks, the other app's volume is lowered for a moment ("ducking"), if the user wants.
final class IronAudio: NSObject, AVSpeechSynthesizerDelegate, AVAudioPlayerDelegate {
    static let shared = IronAudio()

    private let session = AVAudioSession.sharedInstance()
    private let synth = AVSpeechSynthesizer()
    private var keepAlive: AVAudioPlayer?
    private var keepAliveWanted = false
    private var playing: [AVAudioPlayer] = []
    private var toneData: [String: Data] = [:]
    private var voices: [String: AVSpeechSynthesisVoice] = [:]
    private var ducked = false
    private var talking = 0
    private var unduckTries = 0

    private override init() {
        super.init()
        synth.delegate = self
        let nc = NotificationCenter.default
        nc.addObserver(self, selector: #selector(onInterruption(_:)), name: AVAudioSession.interruptionNotification, object: nil)
        nc.addObserver(self, selector: #selector(onReset(_:)), name: AVAudioSession.mediaServicesWereResetNotification, object: nil)
    }

    /// At launch: our sounds mix with whatever plays and ignore the silent switch, like a timer should.
    func configure() {
        setCategory(duck: false)
    }

    private func setCategory(duck: Bool) {
        var opts: AVAudioSession.CategoryOptions = [.mixWithOthers]
        if duck { opts.insert(.duckOthers) }
        do {
            try session.setCategory(.playback, mode: .default, options: opts)
        } catch {
            ijLog("audio category: \(error)")
        }
    }

    private func activate() {
        do {
            try session.setActive(true)
        } catch {
            ijLog("audio activate: \(error)")
        }
    }

    // MARK: staying alive behind other apps

    func startKeepAlive() {
        keepAliveWanted = true
        activate()
        if keepAlive == nil {
            do {
                let p = try AVAudioPlayer(data: Self.silence())
                p.numberOfLoops = -1
                p.volume = 1  // the samples themselves are silent
                p.prepareToPlay()
                keepAlive = p
            } catch {
                ijLog("keep alive: \(error)")
            }
        }
        if keepAlive?.isPlaying != true { keepAlive?.play() }
    }

    /// Stops the silent sound a little later, so the last beep and words can still play.
    func stopKeepAlive(after seconds: Double) {
        keepAliveWanted = false
        DispatchQueue.main.asyncAfter(deadline: .now() + seconds) { [weak self] in
            guard let self = self, !self.keepAliveWanted else { return }
            self.keepAlive?.stop()
        }
    }

    // MARK: beeps

    func tone(_ kind: String) {
        let data = toneData[kind] ?? Self.makeTone(kind)
        toneData[kind] = data
        activate()
        do {
            let p = try AVAudioPlayer(data: data)
            p.delegate = self
            p.volume = 1
            playing.append(p)
            p.play()
        } catch {
            ijLog("tone: \(error)")
        }
    }

    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        playing.removeAll { $0 === player }
    }

    // MARK: the voice

    func prepare(_ lang: String) {
        _ = voice(lang)
    }

    /// The best voice installed for the language (an enhanced one when the phone has it).
    private func voice(_ lang: String) -> AVSpeechSynthesisVoice? {
        let key = lang.isEmpty ? "en-US" : lang
        if let v = voices[key] { return v }
        let want = key.replacingOccurrences(of: "_", with: "-").lowercased()
        let base = String(want.split(separator: "-").first ?? Substring(want))
        let all = AVSpeechSynthesisVoice.speechVoices()
        let exact = all.filter { $0.language.lowercased() == want }
        var pick = exact.filter { $0.quality.rawValue >= AVSpeechSynthesisVoiceQuality.enhanced.rawValue }
            .max { $0.quality.rawValue < $1.quality.rawValue }
        if pick == nil { pick = AVSpeechSynthesisVoice(language: key) }
        if pick == nil { pick = exact.first ?? all.first(where: { $0.language.lowercased().hasPrefix(base) }) }
        voices[key] = pick
        return pick
    }

    func say(_ text: String, lang: String, duck: Bool) {
        let t = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if t.isEmpty { return }
        if duck && !ducked {
            ducked = true
            setCategory(duck: true)
        }
        activate()
        let u = AVSpeechUtterance(string: t)
        u.voice = voice(lang)
        u.rate = 0.52
        u.volume = 1
        if synth.isSpeaking { synth.stopSpeaking(at: .immediate) }
        talking += 1
        synth.speak(u)
        ijLog("speak \(t)")
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) { spoke() }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) { spoke() }

    private func spoke() {
        talking = max(0, talking - 1)
        unduckTries = 0
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { [weak self] in self?.unduck() }
    }

    /// Gives the other app its volume back. iOS only does that when our audio stops for an instant,
    /// so the silent sound pauses, the session is switched off and on again, and the sound goes on.
    private func unduck() {
        guard ducked, talking == 0, !synth.isSpeaking else { return }
        if !playing.isEmpty && unduckTries < 6 {
            unduckTries += 1
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in self?.unduck() }
            return
        }
        let wasAlive = keepAlive?.isPlaying == true
        keepAlive?.pause()
        do {
            try session.setActive(false, options: .notifyOthersOnDeactivation)
            ducked = false
            setCategory(duck: false)
        } catch {
            ijLog("unduck: \(error)")
            if unduckTries < 6 {
                unduckTries += 1
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { [weak self] in self?.unduck() }
            }
        }
        if wasAlive || keepAliveWanted {
            activate()
            keepAlive?.play()
        }
    }

    // MARK: interruptions (a phone call, Siri)

    @objc private func onInterruption(_ n: Notification) {
        guard let raw = n.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }
        DispatchQueue.main.async {
            if type == .ended && self.keepAliveWanted {
                self.activate()
                self.keepAlive?.play()
            }
        }
    }

    @objc private func onReset(_ n: Notification) {
        DispatchQueue.main.async {
            self.keepAlive = nil
            self.playing.removeAll()
            self.ducked = false
            self.setCategory(duck: false)
            if self.keepAliveWanted { self.startKeepAlive() }
        }
    }

    // MARK: sounds made in code (same notes as the web player and the Android app)

    static func makeTone(_ kind: String) -> Data {
        var volume = 0.85
        let notes: [(Double, Double, Double)]  // (frequency Hz, duration s, start s)
        switch kind {
        case "easy": notes = [(523, 0.60, 0)]
        case "count": notes = [(880, 0.12, 0)]; volume = 0.6
        case "done": notes = [(784, 0.20, 0), (988, 0.20, 0.22), (1318, 0.50, 0.44)]
        case "rest": notes = [(880, 0.20, 0), (880, 0.20, 0.28)]
        default: notes = [(1046, 0.18, 0), (1318, 0.30, 0.20)]
        }
        let rate = 44100.0
        var end = 0.0
        for n in notes { end = max(end, n.1 + n.2) }
        let len = Int((end + 0.05) * rate)
        var pcm = [Int16](repeating: 0, count: len)
        for n in notes {
            let start = Int(n.2 * rate), count = Int(n.1 * rate)
            var k = 0
            while k < count && start + k < len {
                let t = Double(k) / rate
                var env = t < 0.015 ? t / 0.015 : exp(-3.5 * (t - 0.015) / n.1)
                let tail = (n.1 - t) / 0.012
                if tail < 1 { env *= max(0, tail) }
                let v = sin(2 * Double.pi * n.0 * t) * env * volume
                let s = Int(pcm[start + k]) + Int(v * 32767 * 0.9)
                pcm[start + k] = Int16(max(-32768, min(32767, s)))
                k += 1
            }
        }
        return wav(pcm, rate: Int(rate))
    }

    /// Half a second of (practically) nothing: a tiny 1-bit ripple, far below hearing.
    static func silence() -> Data {
        let n = 11025
        var pcm = [Int16](repeating: 0, count: n)
        for i in 0..<n where i % 2 == 1 { pcm[i] = 1 }
        return wav(pcm, rate: 22050)
    }

    static func wav(_ pcm: [Int16], rate: Int) -> Data {
        var d = Data()
        func u32(_ v: UInt32) { withUnsafeBytes(of: v.littleEndian) { d.append(contentsOf: $0) } }
        func u16(_ v: UInt16) { withUnsafeBytes(of: v.littleEndian) { d.append(contentsOf: $0) } }
        let bytes = UInt32(pcm.count * 2)
        d.append(contentsOf: Array("RIFF".utf8)); u32(36 + bytes)
        d.append(contentsOf: Array("WAVE".utf8))
        d.append(contentsOf: Array("fmt ".utf8)); u32(16); u16(1); u16(1); u32(UInt32(rate)); u32(UInt32(rate * 2)); u16(2); u16(16)
        d.append(contentsOf: Array("data".utf8)); u32(bytes)
        for s in pcm { u16(UInt16(bitPattern: s)) }
        return d
    }
}

/// Vibration. iPhones have one fixed buzz (about 0.4 s) that also works behind other apps, and
/// light taps that only work while the app is on screen.
enum IronHaptics {
    /// pattern: [on, off, on, ...] in milliseconds, like the web's navigator.vibrate()
    static func play(_ pattern: [Double]) {
        DispatchQueue.main.async {
            var t = 0.0
            var lastBuzz = -1e9
            var i = 0
            while i < pattern.count {
                let on = max(0, pattern[i])
                let off = i + 1 < pattern.count ? max(0, pattern[i + 1]) : 0
                if on >= 150 {
                    let at = max(t, lastBuzz + 520)  // buzzes closer than this would merge into one
                    lastBuzz = at
                    DispatchQueue.main.asyncAfter(deadline: .now() + at / 1000) {
                        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
                    }
                } else if on > 0 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + t / 1000) { IronHaptics.tap() }
                }
                t += on + off
                i += 2
            }
        }
    }

    private static func tap() {
        guard UIApplication.shared.applicationState == .active else { return }
        let g = UIImpactFeedbackGenerator(style: .heavy)
        g.impactOccurred()
    }
}

/// Notifications: permission, the backup announcements of the timer and the "workout done" note.
enum IronNotes {
    struct Item {
        var seconds: Double
        var title: String
        var body: String
    }

    static let backupIds = (0..<24).map { "ij-next-\($0)" }
    static let doneId = "ij-done"
    private static var center: UNUserNotificationCenter { UNUserNotificationCenter.current() }

    static func status(_ done: @escaping (Bool) -> Void) {
        center.getNotificationSettings { s in
            let st = s.authorizationStatus
            done(st == .authorized || st == .provisional || st == .ephemeral)
        }
    }

    static func ask(_ done: @escaping (Bool) -> Void) {
        center.requestAuthorization(options: [.alert, .sound]) { _, _ in IronNotes.status(done) }
    }

    static func scheduleBackup(_ items: [Item]) {
        let c = center
        let used = min(items.count, backupIds.count)
        if used < backupIds.count { c.removePendingNotificationRequests(withIdentifiers: Array(backupIds[used...])) }
        for (i, it) in items.prefix(used).enumerated() {
            let content = UNMutableNotificationContent()
            content.title = it.title.isEmpty ? "Swordbell" : it.title
            content.body = it.body
            content.sound = .default
            content.threadIdentifier = "ij-timer"
            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: max(1, it.seconds), repeats: false)
            c.add(UNNotificationRequest(identifier: backupIds[i], content: content, trigger: trigger)) { err in
                if let err = err { ijLog("notification: \(err)") }
            }
        }
    }

    static func cancelBackup() {
        center.removePendingNotificationRequests(withIdentifiers: backupIds)
    }

    static func postDone(_ title: String, _ body: String) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        center.add(UNNotificationRequest(identifier: doneId, content: content, trigger: nil)) { _ in }
    }

    static func clearDone() {
        center.removeDeliveredNotifications(withIdentifiers: [doneId])
        center.removePendingNotificationRequests(withIdentifiers: [doneId])
    }
}
