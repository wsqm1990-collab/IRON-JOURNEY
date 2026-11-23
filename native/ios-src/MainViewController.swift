import UIKit
import Capacitor

/// The app's screen: Capacitor's web view, plus Swordbell's own native plugin, background
/// audio, and the newest downloaded page when one was kept (see IronBundles).
class MainViewController: CAPBridgeViewController {
    override func instanceDescriptor() -> InstanceDescriptor {
        let descriptor = super.instanceDescriptor()
        if let kept = IronBundles.keptURL() {
            descriptor.appLocation = kept
            ijLog("using kept bundle \(kept.lastPathComponent)")
        }
        return descriptor
    }

    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(IronTimerPlugin())
        IronAudio.shared.configure()
        #if DEBUG || IJ_SELFTEST
        IronSelfTest.startIfAsked(self)
        #endif
    }
}
