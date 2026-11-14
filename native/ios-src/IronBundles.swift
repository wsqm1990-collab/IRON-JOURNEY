import Foundation
import CryptoKit
import Compression

/// The app's page arrives as a small zip with every release. These are downloaded, checked and
/// unpacked next to each other; the one that started fine is kept and opened at the next launch.
enum IronBundles {
    private static let nameKey = "ij_bundle_name"
    private static let binaryKey = "ij_bundle_binary"

    /// Library/NoCloud/ionic_built_snapshots: where Capacitor itself keeps downloaded web versions.
    static var root: URL {
        let lib = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
        return lib.appendingPathComponent("NoCloud", isDirectory: true).appendingPathComponent("ionic_built_snapshots", isDirectory: true)
    }

    /// This installed version of the app; a kept page only stays with the version it was kept on.
    static var binary: String {
        let i = Bundle.main.infoDictionary ?? [:]
        return "\(i["CFBundleShortVersionString"] ?? "")-\(i["CFBundleVersion"] ?? "")"
    }

    static func keptURL() -> URL? {
        let d = UserDefaults.standard
        guard let name = d.string(forKey: nameKey), !name.isEmpty else { return nil }
        let url = root.appendingPathComponent(name, isDirectory: true)
        if d.string(forKey: binaryKey) != binary || !FileManager.default.fileExists(atPath: url.appendingPathComponent("index.html").path) {
            forget()
            return nil
        }
        return url
    }

    static func keep(_ path: String) -> Bool {
        // only the folder name is saved: iOS may move the app's folders when it is updated
        let name = URL(fileURLWithPath: path).lastPathComponent
        let index = root.appendingPathComponent(name, isDirectory: true).appendingPathComponent("index.html")
        guard !name.isEmpty, FileManager.default.fileExists(atPath: index.path) else { return false }
        UserDefaults.standard.set(name, forKey: nameKey)
        UserDefaults.standard.set(binary, forKey: binaryKey)
        UserDefaults.standard.synchronize()  // the app may be closed right after an update
        ijLog("keeping bundle \(name)")
        return true
    }

    static func forget() {
        UserDefaults.standard.removeObject(forKey: nameKey)
        UserDefaults.standard.removeObject(forKey: binaryKey)
    }

    static func clean(keep: [String]) {
        let fm = FileManager.default
        let kept = UserDefaults.standard.string(forKey: nameKey)
        guard let items = try? fm.contentsOfDirectory(atPath: root.path) else { return }
        for name in items where !keep.contains(name) && name != kept {
            try? fm.removeItem(at: root.appendingPathComponent(name))
        }
    }

    static func fetch(url: String, build: String, sha256: String, done: @escaping (String?, String?) -> Void) {
        let fm = FileManager.default
        let dest = root.appendingPathComponent(build, isDirectory: true)
        if fm.fileExists(atPath: dest.appendingPathComponent("index.html").path) { done(dest.path, nil); return }
        guard let u = URL(string: url) else { done(nil, "bad_args"); return }
        let req = URLRequest(url: u, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 60)
        URLSession.shared.dataTask(with: req) { data, resp, err in
            do {
                if let err = err { throw err }
                let code = (resp as? HTTPURLResponse)?.statusCode ?? 0
                guard code == 200, let data = data else { throw ZipError("HTTP \(code)") }
                if !sha256.isEmpty && sha256.lowercased() != IronBundles.hex(SHA256.hash(data: data)) { throw ZipError("checksum") }
                try fm.createDirectory(at: IronBundles.root, withIntermediateDirectories: true)
                var noBackup = URLResourceValues()
                noBackup.isExcludedFromBackup = true  // downloaded again whenever needed
                var r = IronBundles.root
                try? r.setResourceValues(noBackup)
                let tmp = IronBundles.root.appendingPathComponent(build + ".tmp", isDirectory: true)
                try? fm.removeItem(at: tmp)
                try MiniZip.unzip(data, into: tmp)
                guard fm.fileExists(atPath: tmp.appendingPathComponent("index.html").path) else { throw ZipError("no index.html") }
                try? fm.removeItem(at: dest)
                try fm.moveItem(at: tmp, to: dest)
                ijLog("bundle ready \(build)")
                done(dest.path, nil)
            } catch {
                ijLog("bundle failed: \(error)")
                done(nil, "bundle_failed: \(error.localizedDescription)")
            }
        }.resume()
    }

    private static func hex<D: Sequence>(_ digest: D) -> String where D.Element == UInt8 {
        return digest.map { String(format: "%02x", $0) }.joined()
    }
}

struct ZipError: LocalizedError {
    let message: String
    init(_ message: String) { self.message = message }
    var errorDescription: String? { message }
}

/// Just enough of the zip format for our own web.zip: stored or deflated files, no encryption.
enum MiniZip {
    static func unzip(_ data: Data, into dir: URL) throws {
        let fm = FileManager.default
        try fm.createDirectory(at: dir, withIntermediateDirectories: true)
        let base = dir.standardizedFileURL.path + "/"
        let b = [UInt8](data)
        let n = b.count
        func u16(_ o: Int) -> Int { Int(b[o]) | Int(b[o + 1]) << 8 }
        func u32(_ o: Int) -> Int { u16(o) | u16(o + 2) << 16 }
        guard n >= 22 else { throw ZipError("not a zip") }
        // the end-of-central-directory record, near the end of the file
        var eocd = -1
        var i = n - 22
        let stop = max(0, n - 22 - 65_535)
        while i >= stop {
            if b[i] == 0x50 && b[i + 1] == 0x4B && b[i + 2] == 0x05 && b[i + 3] == 0x06 { eocd = i; break }
            i -= 1
        }
        guard eocd >= 0 else { throw ZipError("not a zip") }
        let count = u16(eocd + 10)
        var p = u32(eocd + 16)
        for _ in 0..<count {
            guard p + 46 <= n, u32(p) == 0x0201_4B50 else { throw ZipError("bad directory") }
            let flags = u16(p + 8), method = u16(p + 10)
            let csize = u32(p + 20), usize = u32(p + 24)
            let nlen = u16(p + 28), xlen = u16(p + 30), clen = u16(p + 32)
            let local = u32(p + 42)
            guard p + 46 + nlen <= n else { throw ZipError("bad name") }
            let name = String(decoding: b[(p + 46)..<(p + 46 + nlen)], as: UTF8.self)
            p += 46 + nlen + xlen + clen
            if flags & 1 != 0 { throw ZipError("encrypted") }
            guard local + 30 <= n, u32(local) == 0x0403_4B50 else { throw ZipError("bad entry header") }
            let start = local + 30 + u16(local + 26) + u16(local + 28)
            guard start + csize <= n else { throw ZipError("cut short") }
            let out = dir.appendingPathComponent(name)
            guard out.standardizedFileURL.path.hasPrefix(base) else { throw ZipError("bad entry") }
            if name.hasSuffix("/") {
                try fm.createDirectory(at: out, withIntermediateDirectories: true)
                continue
            }
            try fm.createDirectory(at: out.deletingLastPathComponent(), withIntermediateDirectories: true)
            let packed = Data(b[start..<(start + csize)])
            let file: Data
            switch method {
            case 0: file = packed
            case 8: file = try inflate(packed, size: usize)
            default: throw ZipError("method \(method)")
            }
            guard file.count == usize else { throw ZipError("size of \(name)") }
            try file.write(to: out)
        }
    }

    /// Raw DEFLATE, which is what Apple's COMPRESSION_ZLIB reads.
    private static func inflate(_ packed: Data, size: Int) throws -> Data {
        if size == 0 { return Data() }
        var out = Data(count: size)
        let got = out.withUnsafeMutableBytes { (dst: UnsafeMutableRawBufferPointer) -> Int in
            packed.withUnsafeBytes { (src: UnsafeRawBufferPointer) -> Int in
                guard let d = dst.bindMemory(to: UInt8.self).baseAddress,
                      let s = src.bindMemory(to: UInt8.self).baseAddress else { return 0 }
                return compression_decode_buffer(d, size, s, packed.count, nil, COMPRESSION_ZLIB)
            }
        }
        guard got == size else { throw ZipError("inflate") }
        return out
    }
}

/// A copy of the app's data in the app's own files (Application Support, part of iCloud backups).
enum IronSnapshot {
    private static var file: URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("IronJourney", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("data-copy.json")
    }

    static func save(_ text: String) -> Bool {
        if text.isEmpty { return false }
        do {
            try Data(text.utf8).write(to: file, options: .atomic)
            return true
        } catch {
            ijLog("data copy: \(error)")
            return false
        }
    }

    static func load() -> String? {
        guard let d = try? Data(contentsOf: file), !d.isEmpty else { return nil }
        return String(decoding: d, as: UTF8.self)
    }
}
