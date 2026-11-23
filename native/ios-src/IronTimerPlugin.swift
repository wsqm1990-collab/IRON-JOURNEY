import Foundation
import UIKit
import Capacitor

/// Everything the web app asks of the iPhone: the workout timer, voice, sounds, other apps, files,
/// updates. Same methods and answers as the Android plugin (IronTimerPlugin.java), so the page
/// doesn't care which phone it runs on.
@objc(IronTimerPlugin)
public class IronTimerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "IronTimerPlugin"
    public let jsName = "IronTimer"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getState", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "ack", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "speak", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "tone", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "vibrate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepAwake", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openApp", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "apps", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "notifStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "askNotif", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openNotifSettings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "batteryStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openBattery", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openAppSettings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shareFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "info", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "fetchBundle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "fetchText", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cleanBundles", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepBundle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "forgetBundle", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reloadApp", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveSnapshot", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadSnapshot", returnType: CAPPluginReturnPromise),
    ]

    override public func load() {
        IronClock.shared.plugin = self
    }

    /// Timer events for the page; kept until the page listens, if it isn't listening yet.
    func emit(_ data: [String: Any]) {
        notifyListeners("timer", data: data, retainUntilConsumed: true)
    }

    private func args(_ call: CAPPluginCall) -> [AnyHashable: Any] {
        let o: [AnyHashable: Any]? = call.options
        return o ?? [:]
    }

    // MARK: timer

    @objc func start(_ call: CAPPluginCall) {
        let o = args(call)
        DispatchQueue.main.async {
            if IronClock.shared.start(o) { call.resolve() } else { call.reject("start_failed") }
        }
    }

    @objc func update(_ call: CAPPluginCall) {
        let o = args(call)
        DispatchQueue.main.async {
            IronClock.shared.apply(o)
            call.resolve()
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        let kind = call.getString("kind") ?? ""
        DispatchQueue.main.async {
            IronClock.shared.stopFromApp(kind)
            call.resolve()
        }
    }

    @objc func getState(_ call: CAPPluginCall) {
        DispatchQueue.main.async { call.resolve(IronClock.shared.readState()) }
    }

    @objc func ack(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            IronClock.shared.clearEnded()
            call.resolve()
        }
    }

    // MARK: voice, sound, vibration, screen

    @objc func speak(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        let lang = call.getString("lang") ?? "en-US"
        let duck = call.getBool("duck") ?? true
        DispatchQueue.main.async {
            IronAudio.shared.say(text, lang: lang, duck: duck)
            call.resolve()
        }
    }

    @objc func tone(_ call: CAPPluginCall) {
        let kind = call.getString("kind") ?? "strong"
        DispatchQueue.main.async {
            IronAudio.shared.tone(kind)
            call.resolve()
        }
    }

    @objc func vibrate(_ call: CAPPluginCall) {
        let raw = (args(call)["pattern"] as? [Any]) ?? []
        let pattern = raw.map { jNum($0, 0) }
        if !pattern.isEmpty { IronHaptics.play(pattern) }
        call.resolve()
    }

    @objc func keepAwake(_ call: CAPPluginCall) {
        let on = call.getBool("on") ?? false
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = on
            call.resolve()
        }
    }

    // MARK: other apps (Netflix, Spotify...)

    /// Android package names the page sends, and the iPhone app each one is opened with.
    private static let schemes: [String: String] = [
        "com.netflix.mediaclient": "nflx://",
        "com.amazon.avod.thirdpartyclient": "aiv://",
        "com.disney.disneyplus": "disneyplus://",
        "com.wbd.stream": "hbomax://",
        "com.globo.globotv": "globoplay://",
        "com.google.android.youtube": "youtube://",
        "com.crunchyroll.crunchyroid": "crunchyroll://",
        "com.apple.atve.androidtv.appletv": "videos://",
        "com.spotify.music": "spotify://",
        "com.google.android.apps.youtube.music": "youtubemusic://",
        "deezer.android.app": "deezer://",
        "com.apple.android.music": "music://",
        "com.amazon.mp3": "amznmp3://",
    ]

    @objc func openApp(_ call: CAPPluginCall) {
        let urlText = call.getString("url") ?? ""
        let pkg = call.getString("pkg") ?? ""
        let preferUrl = call.getBool("preferUrl") ?? false
        var tries: [(URL, Bool, Bool)] = []  // (address, only if an app takes it, counts as "installed")
        let scheme = Self.schemes[pkg].flatMap { URL(string: $0) }
        if let web = URL(string: urlText), let s = web.scheme?.lowercased(), s == "http" || s == "https" {
            // the app itself first (on its home screen, or at this page if it takes web links), then the site
            if !preferUrl, let app = scheme { tries.append((app, false, true)) }
            tries.append((web, true, true))
            tries.append((web, false, false))
        } else if let other = URL(string: urlText), !urlText.isEmpty {
            tries.append((other, false, true))
        } else if let app = scheme {
            tries.append((app, false, true))
        }
        if tries.isEmpty { call.reject("nothing_to_open"); return }
        DispatchQueue.main.async { Self.open(tries, call) }
    }

    private static func open(_ tries: [(URL, Bool, Bool)], _ call: CAPPluginCall) {
        guard let (url, appOnly, installed) = tries.first else { call.reject("cannot_open"); return }
        let options: [UIApplication.OpenExternalURLOptionsKey: Any] = appOnly ? [.universalLinksOnly: true] : [:]
        UIApplication.shared.open(url, options: options) { ok in
            if ok { call.resolve(["installed": installed]) } else { IronTimerPlugin.open(Array(tries.dropFirst()), call) }
        }
    }

    @objc func apps(_ call: CAPPluginCall) {
        let list = (args(call)["pkgs"] as? [Any]) ?? []
        DispatchQueue.main.async {
            var r: [String: Any] = [:]
            for item in list {
                let p = jStr(item)
                if p.isEmpty { continue }
                if let s = Self.schemes[p], let u = URL(string: s) { r[p] = UIApplication.shared.canOpenURL(u) } else { r[p] = false }
            }
            call.resolve(r)
        }
    }

    // MARK: permissions and phone settings

    @objc func notifStatus(_ call: CAPPluginCall) {
        IronNotes.status { call.resolve(["granted": $0]) }
    }

    @objc func askNotif(_ call: CAPPluginCall) {
        IronNotes.ask { call.resolve(["granted": $0]) }
    }

    @objc func openNotifSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var address = UIApplication.openSettingsURLString
            if #available(iOS 16.0, *) { address = UIApplication.openNotificationSettingsURLString }
            if let u = URL(string: address) { UIApplication.shared.open(u) }
            call.resolve()
        }
    }

    /// iPhones have no battery saver that stops a playing app, so this is always fine.
    @objc func batteryStatus(_ call: CAPPluginCall) {
        call.resolve(["ignoring": true, "maker": "Apple"])
    }

    @objc func openBattery(_ call: CAPPluginCall) { openAppSettings(call) }

    @objc func openAppSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if let u = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(u) }
            call.resolve()
        }
    }

    // MARK: backup file

    @objc func shareFile(_ call: CAPPluginCall) {
        let raw = call.getString("name") ?? "iron-journey-backup.json"
        let name = String(raw.map { $0.isLetter || $0.isNumber || $0 == "." || $0 == "-" || $0 == "_" ? $0 : "_" })
        let text = call.getString("text") ?? ""
        DispatchQueue.main.async {
            do {
                let dir = FileManager.default.temporaryDirectory.appendingPathComponent("share", isDirectory: true)
                try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
                let file = dir.appendingPathComponent(name.isEmpty ? "iron-journey-backup.json" : name)
                try Data(text.utf8).write(to: file, options: .atomic)
                guard let vc = self.bridge?.viewController else { call.reject("share_failed"); return }
                let sheet = UIActivityViewController(activityItems: [file], applicationActivities: nil)
                if let pop = sheet.popoverPresentationController {  // iPad: a popover needs a place to point at
                    pop.sourceView = vc.view
                    pop.sourceRect = CGRect(x: vc.view.bounds.midX, y: vc.view.bounds.maxY - 90, width: 1, height: 1)
                    pop.permittedArrowDirections = []
                }
                vc.present(sheet, animated: true)
                call.resolve()
            } catch {
                ijLog("share failed: \(error)")
                call.reject("share_failed")
            }
        }
    }

    // MARK: app info and automatic updates

    @objc func info(_ call: CAPPluginCall) {
        let i = Bundle.main.infoDictionary ?? [:]
        let name = i["CFBundleShortVersionString"] as? String ?? ""
        let build = i["CFBundleVersion"] as? String ?? ""
        let code = Int(build.split(separator: ".").first.map(String.init) ?? "") ?? 0
        DispatchQueue.main.async {
            call.resolve([
                "versionName": name, "versionCode": code, "build": build,
                "shell": 4,  // 2: locked upright, like the Android app; 3: the Swordbell name and icon; 4: the shield logo
                "platform": "ios", "sdk": UIDevice.current.systemVersion,
                "maker": "Apple", "model": ijModel(),
            ])
        }
    }

    /// Downloads a web bundle (a zip of index.html and friends), checks it and unpacks it into the
    /// app's own storage. Returns the folder; the page then switches to it.
    @objc func fetchBundle(_ call: CAPPluginCall) {
        let url = call.getString("url") ?? ""
        let build = String((call.getString("build") ?? "").filter { $0.isLetter || $0.isNumber || $0 == "." || $0 == "_" || $0 == "-" })
        let sha = call.getString("sha256") ?? ""
        if url.isEmpty || build.isEmpty { call.reject("bad_args"); return }
        IronBundles.fetch(url: url, build: build, sha256: sha) { path, err in
            if let path = path { call.resolve(["path": path]) } else { call.reject(err ?? "bundle_failed") }
        }
    }

    /// A small text file from the internet (the update check), read outside the page.
    @objc func fetchText(_ call: CAPPluginCall) {
        guard let u = URL(string: call.getString("url") ?? ""), u.scheme != nil else { call.reject("bad_args"); return }
        var req = URLRequest(url: u, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 20)
        req.setValue("no-cache", forHTTPHeaderField: "Cache-Control")
        URLSession.shared.dataTask(with: req) { data, resp, err in
            let code = (resp as? HTTPURLResponse)?.statusCode ?? 0
            if let err = err { call.reject("fetch_failed: \(err.localizedDescription)"); return }
            guard code == 200, let data = data, data.count < 1_000_000 else { call.reject("fetch_failed: HTTP \(code)"); return }
            call.resolve(["text": String(decoding: data, as: UTF8.self)])
        }.resume()
    }

    /// Removes downloaded bundles except the ones listed (by folder name) and the kept one.
    @objc func cleanBundles(_ call: CAPPluginCall) {
        let keep = ((args(call)["keep"] as? [Any]) ?? []).map { jStr($0) }
        IronBundles.clean(keep: keep)
        call.resolve()
    }

    /// Keeps a downloaded web bundle as the app's page from now on. It is dropped when a new app
    /// version is installed (that one brings newer files) or when its folder is gone.
    @objc func keepBundle(_ call: CAPPluginCall) {
        if IronBundles.keep(call.getString("path") ?? "") { call.resolve() } else { call.reject("no_bundle") }
    }

    @objc func forgetBundle(_ call: CAPPluginCall) {
        IronBundles.forget()
        call.resolve()
    }

    /// Starts the page again from the kept web bundle (or the one inside the app).
    @objc func reloadApp(_ call: CAPPluginCall) {
        call.resolve()
        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController as? CAPBridgeViewController else { return }
            if let kept = IronBundles.keptURL() {
                vc.setServerBasePath(path: kept.path)
            } else if let inside = Bundle.main.url(forResource: "public", withExtension: nil) {
                vc.setServerBasePath(path: inside.path)
            }
        }
    }

    // MARK: a copy of the data outside the web view

    /// iOS may clear a web view's storage when the phone runs out of space; this copy brings it back.
    @objc func saveSnapshot(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        DispatchQueue.global(qos: .utility).async {
            call.resolve(["ok": IronSnapshot.save(text)])
        }
    }

    @objc func loadSnapshot(_ call: CAPPluginCall) {
        DispatchQueue.global(qos: .utility).async {
            if let text = IronSnapshot.load() { call.resolve(["text": text]) } else { call.resolve(["text": NSNull()]) }
        }
    }
}

// MARK: small helpers shared by the iPhone files

func ijLog(_ s: String) { NSLog("IronTimer: %@", s) }

func ijNow() -> Double { Date().timeIntervalSince1970 * 1000 }

func jStr(_ v: Any?, _ fallback: String = "") -> String {
    if let s = v as? String { return s }
    if let n = v as? NSNumber {
        let d = n.doubleValue
        if d == d.rounded(), abs(d) < 9e15 { return String(Int64(d)) }
        return n.stringValue
    }
    return fallback
}

func jNum(_ v: Any?, _ fallback: Double) -> Double {
    if let n = v as? NSNumber { return n.doubleValue }
    if let s = v as? String, let d = Double(s) { return d }
    return fallback
}

func jBool(_ v: Any?, _ fallback: Bool) -> Bool {
    if let b = v as? Bool { return b }
    if let n = v as? NSNumber { return n.boolValue }
    return fallback
}

func ijModel() -> String {
    var info = utsname()
    uname(&info)
    let id = withUnsafeBytes(of: &info.machine) { raw -> String in
        String(decoding: raw.prefix { $0 != 0 }, as: UTF8.self)
    }
    return id.isEmpty ? UIDevice.current.model : id
}
