package com.wsqm1990.ironjourney;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.view.WindowManager;

import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/** Everything the web app asks of the phone: the workout timer, voice, sounds, apps, files, updates. */
@CapacitorPlugin(
        name = "IronTimer",
        permissions = {@Permission(alias = "notifications", strings = {Manifest.permission.POST_NOTIFICATIONS})}
)
public class IronTimerPlugin extends Plugin {
    private static volatile IronTimerPlugin current;

    @Override
    public void load() {
        current = this;
    }

    /** Called by the timer service, from any thread. Kept until the page listens, if it isn't yet. */
    static void emit(JSONObject data) {
        IronTimerPlugin p = current;
        if (p == null || data == null) return;
        try {
            p.notifyListeners("timer", new JSObject(data.toString()), true);
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "emit failed", e);
        }
    }

    // ------------------------------------------------------------ timer

    @PluginMethod
    public void start(PluginCall call) {
        Context ctx = getContext();
        Intent i = new Intent(ctx, IronTimerService.class);
        i.setAction(IronTimerService.ACTION_START);
        i.putExtra(IronTimerService.EXTRA_PLAN, call.getData().toString());
        try {
            ContextCompat.startForegroundService(ctx, i);
            call.resolve();
        } catch (Exception e) {
            Log.e(IronTimerService.TAG, "start failed", e);
            call.reject("start_failed");
        }
    }

    @PluginMethod
    public void update(PluginCall call) {
        final String json = call.getData().toString();
        final IronTimerService s = IronTimerService.instance;
        if (s != null) s.post(new Runnable() { @Override public void run() { s.applyState(json); } });
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        final String kind = call.getString("kind", "");
        final IronTimerService s = IronTimerService.instance;
        if (s != null) s.post(new Runnable() { @Override public void run() { s.stopFromApp(kind); } });
        call.resolve();
    }

    @PluginMethod
    public void getState(PluginCall call) {
        try {
            call.resolve(new JSObject(IronTimerService.readState(getContext()).toString()));
        } catch (Exception e) {
            call.resolve(new JSObject());
        }
    }

    @PluginMethod
    public void ack(PluginCall call) {
        IronTimerService.clearEnded(getContext());
        call.resolve();
    }

    // ------------------------------------------------------------ voice, sound, vibration, screen

    @PluginMethod
    public void speak(PluginCall call) {
        Speaker.get(getContext()).say(call.getString("text", ""), call.getString("lang", "en-US"), Boolean.TRUE.equals(call.getBoolean("duck", true)));
        call.resolve();
    }

    @PluginMethod
    public void tone(PluginCall call) {
        String kind = call.getString("kind", "strong");
        if ("easy".equals(kind)) Tones.easy();
        else if ("count".equals(kind)) Tones.countdown();
        else if ("done".equals(kind)) Tones.done();
        else if ("rest".equals(kind)) Tones.restDone();
        else Tones.strong();
        call.resolve();
    }

    @PluginMethod
    public void vibrate(PluginCall call) {
        JSONArray a = call.getData().optJSONArray("pattern");
        int n = a == null ? 0 : a.length();
        long[] p = new long[n + 1];
        p[0] = 0;
        for (int k = 0; k < n; k++) p[k + 1] = Math.max(0, a.optLong(k, 0));
        if (n > 0) Haptics.vibrate(getContext(), p);
        call.resolve();
    }

    @PluginMethod
    public void keepAwake(PluginCall call) {
        final boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        final Activity a = getActivity();
        if (a != null) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    if (on) a.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    else a.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        }
        call.resolve();
    }

    // ------------------------------------------------------------ other apps (Netflix, Spotify...)

    @SuppressWarnings("deprecation")
    private boolean installed(String pkg) {
        if (pkg == null || pkg.length() == 0) return false;
        try {
            getContext().getPackageManager().getPackageInfo(pkg, 0);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @PluginMethod
    public void openApp(PluginCall call) {
        String url = call.getString("url", "");
        String pkg = call.getString("pkg", "");
        boolean preferUrl = Boolean.TRUE.equals(call.getBoolean("preferUrl", false));
        Context ctx = getContext();
        boolean has = installed(pkg);
        Intent i = null;
        if (has && !preferUrl) i = ctx.getPackageManager().getLaunchIntentForPackage(pkg);
        if (i == null && url != null && url.length() > 0) {
            i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            if (has) i.setPackage(pkg);
        }
        if (i == null) {
            call.reject("nothing_to_open");
            return;
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            ctx.startActivity(i);
            JSObject r = new JSObject();
            r.put("installed", has);
            call.resolve(r);
        } catch (ActivityNotFoundException e) {
            try {
                Intent b = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                b.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(b);
                call.resolve();
            } catch (Exception e2) {
                call.reject("cannot_open");
            }
        }
    }

    @PluginMethod
    public void apps(PluginCall call) {
        JSONArray list = call.getData().optJSONArray("pkgs");
        JSObject r = new JSObject();
        if (list != null) for (int k = 0; k < list.length(); k++) {
            String p = list.optString(k, "");
            if (p.length() > 0) r.put(p, installed(p));
        }
        call.resolve(r);
    }

    // ------------------------------------------------------------ permissions and phone settings

    private boolean notificationsOn() {
        boolean enabled = NotificationManagerCompat.from(getContext()).areNotificationsEnabled();
        if (Build.VERSION.SDK_INT < 33) return enabled;
        return enabled && getPermissionState("notifications") == PermissionState.GRANTED;
    }

    @PluginMethod
    public void notifStatus(PluginCall call) {
        JSObject r = new JSObject();
        r.put("granted", notificationsOn());
        call.resolve(r);
    }

    @PluginMethod
    public void askNotif(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "notifCallback");
        } else {
            notifCallback(call);
        }
    }

    @PermissionCallback
    private void notifCallback(PluginCall call) {
        JSObject r = new JSObject();
        r.put("granted", notificationsOn());
        call.resolve(r);
    }

    @PluginMethod
    public void openNotifSettings(PluginCall call) {
        Context ctx = getContext();
        try {
            Intent i;
            if (Build.VERSION.SDK_INT >= 26) {
                i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                i.putExtra(Settings.EXTRA_APP_PACKAGE, ctx.getPackageName());
            } else {
                i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + ctx.getPackageName()));
            }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(i);
        } catch (Exception e) {
            openDetails(ctx);
        }
        call.resolve();
    }

    @PluginMethod
    public void batteryStatus(PluginCall call) {
        Context ctx = getContext();
        PowerManager pm = (PowerManager) ctx.getSystemService(Context.POWER_SERVICE);
        JSObject r = new JSObject();
        r.put("ignoring", pm != null && pm.isIgnoringBatteryOptimizations(ctx.getPackageName()));
        r.put("maker", Build.MANUFACTURER);
        call.resolve(r);
    }

    @PluginMethod
    public void openBattery(PluginCall call) {
        Context ctx = getContext();
        try {
            Intent i = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + ctx.getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(i);
        } catch (Exception e) {
            openDetails(ctx);
        }
        call.resolve();
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        openDetails(getContext());
        call.resolve();
    }

    private static void openDetails(Context ctx) {
        try {
            Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + ctx.getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(i);
        } catch (Exception ignored) { }
    }

    // ------------------------------------------------------------ backup file

    @PluginMethod
    public void shareFile(PluginCall call) {
        String name = call.getString("name", "iron-journey-backup.json").replaceAll("[^A-Za-z0-9._-]", "_");
        String text = call.getString("text", "");
        String mime = call.getString("mime", "application/json");
        try {
            Context ctx = getContext();
            File dir = new File(ctx.getCacheDir(), "share");
            if (!dir.exists() && !dir.mkdirs()) throw new IOException("mkdir");
            File f = new File(dir, name);
            try (OutputStream out = new FileOutputStream(f)) { out.write(text.getBytes(StandardCharsets.UTF_8)); }
            Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".fileprovider", f);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType(mime);
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.putExtra(Intent.EXTRA_SUBJECT, name);
            send.setClipData(ClipData.newRawUri(name, uri));
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send, call.getString("title", name));
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Activity a = getActivity();
            if (a != null) a.startActivity(chooser);
            else { chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); ctx.startActivity(chooser); }
            call.resolve();
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "share failed", e);
            call.reject("share_failed");
        }
    }

    // ------------------------------------------------------------ app info and automatic updates

    @SuppressWarnings("deprecation")
    @PluginMethod
    public void info(PluginCall call) {
        JSObject r = new JSObject();
        try {
            Context ctx = getContext();
            PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            r.put("versionName", pi.versionName);
            r.put("versionCode", Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : (long) pi.versionCode);
        } catch (Exception ignored) { }
        r.put("shell", 1);
        r.put("sdk", Build.VERSION.SDK_INT);
        r.put("maker", Build.MANUFACTURER);
        r.put("model", Build.MODEL);
        call.resolve(r);
    }

    /**
     * Downloads a web bundle (a zip of index.html and friends), checks it and unpacks it into
     * the app's own storage. Returns the folder; the page then switches to it.
     */
    @PluginMethod
    public void fetchBundle(final PluginCall call) {
        final String url = call.getString("url", "");
        final String build = call.getString("build", "").replaceAll("[^0-9A-Za-z._-]", "");
        final String sha = call.getString("sha256", "");
        if (url.length() == 0 || build.length() == 0) { call.reject("bad_args"); return; }
        new Thread(new Runnable() {
            @Override public void run() {
                File root = new File(getContext().getFilesDir(), "bundles");
                File dest = new File(root, build);
                File zip = new File(getContext().getCacheDir(), "bundle-" + build + ".zip");
                try {
                    if (new File(dest, "index.html").exists()) {
                        JSObject r = new JSObject();
                        r.put("path", dest.getAbsolutePath());
                        call.resolve(r);
                        return;
                    }
                    download(url, zip);
                    if (sha.length() > 0 && !sha.equalsIgnoreCase(sha256(zip))) throw new IOException("checksum");
                    File tmp = new File(root, build + ".tmp");
                    deleteTree(tmp);
                    unzip(zip, tmp);
                    if (!new File(tmp, "index.html").exists()) throw new IOException("no index.html");
                    deleteTree(dest);
                    if (!tmp.renameTo(dest)) throw new IOException("rename");
                    JSObject r = new JSObject();
                    r.put("path", dest.getAbsolutePath());
                    call.resolve(r);
                    Log.i(IronTimerService.TAG, "bundle ready " + build);
                } catch (Exception e) {
                    Log.w(IronTimerService.TAG, "bundle failed", e);
                    call.reject("bundle_failed: " + e.getMessage());
                } finally {
                    if (zip.exists() && !zip.delete()) Log.w(IronTimerService.TAG, "zip not deleted");
                }
            }
        }, "ij-bundle").start();
    }

    /** A small text file from the internet (the update check), read outside the page. */
    @PluginMethod
    public void fetchText(final PluginCall call) {
        final String url = call.getString("url", "");
        if (url.length() == 0) { call.reject("bad_args"); return; }
        new Thread(new Runnable() {
            @Override public void run() {
                try {
                    HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                    c.setConnectTimeout(15000);
                    c.setReadTimeout(20000);
                    c.setUseCaches(false);
                    c.setInstanceFollowRedirects(true);
                    try {
                        int code = c.getResponseCode();
                        if (code != 200) throw new IOException("HTTP " + code);
                        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
                        try (InputStream in = c.getInputStream()) {
                            byte[] buf = new byte[8192];
                            int n;
                            while ((n = in.read(buf)) > 0 && out.size() < 1000000) out.write(buf, 0, n);
                        }
                        JSObject r = new JSObject();
                        r.put("text", new String(out.toByteArray(), StandardCharsets.UTF_8));
                        call.resolve(r);
                    } finally {
                        c.disconnect();
                    }
                } catch (Exception e) {
                    call.reject("fetch_failed: " + e.getMessage());
                }
            }
        }, "ij-fetch").start();
    }

    /** Removes downloaded bundles except the ones listed (by folder name). */
    @PluginMethod
    public void cleanBundles(PluginCall call) {
        JSONArray keep = call.getData().optJSONArray("keep");
        File root = new File(getContext().getFilesDir(), "bundles");
        File[] all = root.listFiles();
        if (all != null) for (File f : all) {
            boolean k = false;
            if (keep != null) for (int i = 0; i < keep.length(); i++) if (f.getName().equals(keep.optString(i, ""))) k = true;
            if (!k) deleteTree(f);
        }
        call.resolve();
    }

    /**
     * Keeps a downloaded web bundle as the app's page from now on. It is dropped when a new APK is
     * installed (the APK then brings newer files) or when its folder is gone.
     */
    @PluginMethod
    public void keepBundle(PluginCall call) {
        String path = call.getString("path", "");
        if (path.length() == 0 || !new File(path, "index.html").exists()) { call.reject("no_bundle"); return; }
        getContext().getSharedPreferences(BUNDLE_PREFS, Context.MODE_PRIVATE).edit()
                .putString("path", path).putLong("versionCode", versionCode(getContext())).apply();
        call.resolve();
    }

    @PluginMethod
    public void forgetBundle(PluginCall call) {
        getContext().getSharedPreferences(BUNDLE_PREFS, Context.MODE_PRIVATE).edit().clear().apply();
        call.resolve();
    }

    static final String BUNDLE_PREFS = "iron_bundle";

    @SuppressWarnings("deprecation")
    static long versionCode(Context ctx) {
        try {
            PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            return Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : (long) pi.versionCode;
        } catch (Exception e) {
            return -1;
        }
    }

    /** Called by MainActivity at start: open the kept web bundle instead of the one inside the APK. */
    static void applySavedBundle(Context ctx, Bridge bridge) {
        try {
            SharedPreferences p = ctx.getSharedPreferences(BUNDLE_PREFS, Context.MODE_PRIVATE);
            String path = p.getString("path", null);
            if (path == null || bridge == null) return;
            if (p.getLong("versionCode", -2) != versionCode(ctx) || !new File(path, "index.html").exists()) {
                p.edit().clear().apply();
                return;
            }
            if (path.equals(bridge.getServerBasePath())) return;
            bridge.setServerBasePath(path);
            Log.i(IronTimerService.TAG, "using kept bundle " + path);
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "kept bundle failed", e);
        }
    }

    /** Starts the page again from the saved web bundle (used when a new bundle fails to start). */
    @PluginMethod
    public void reloadApp(PluginCall call) {
        final Activity a = getActivity();
        call.resolve();
        if (a != null) a.runOnUiThread(new Runnable() { @Override public void run() { a.recreate(); } });
    }

    private static void download(String url, File dest) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(30000);
        c.setUseCaches(false);
        c.setInstanceFollowRedirects(true);
        try {
            int code = c.getResponseCode();
            if (code != 200) throw new IOException("HTTP " + code);
            try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(dest)) {
                byte[] buf = new byte[16384];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
        } finally {
            c.disconnect();
        }
    }

    private static String sha256(File f) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        try (InputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) md.update(buf, 0, n);
        }
        StringBuilder sb = new StringBuilder();
        for (byte b : md.digest()) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private static void unzip(File zip, File dir) throws IOException {
        String base = dir.getCanonicalPath() + File.separator;
        if (!dir.exists() && !dir.mkdirs()) throw new IOException("mkdir");
        try (ZipInputStream zin = new ZipInputStream(new FileInputStream(zip))) {
            ZipEntry e;
            byte[] buf = new byte[16384];
            while ((e = zin.getNextEntry()) != null) {
                File out = new File(dir, e.getName());
                if (!out.getCanonicalPath().startsWith(base)) throw new IOException("bad entry");
                if (e.isDirectory()) { if (!out.exists() && !out.mkdirs()) throw new IOException("mkdir"); continue; }
                File parent = out.getParentFile();
                if (parent != null && !parent.exists() && !parent.mkdirs()) throw new IOException("mkdir");
                try (OutputStream os = new FileOutputStream(out)) {
                    int n;
                    while ((n = zin.read(buf)) > 0) os.write(buf, 0, n);
                }
            }
        }
    }

    private static void deleteTree(File f) {
        if (f == null || !f.exists()) return;
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteTree(k);
        if (!f.delete()) Log.w(IronTimerService.TAG, "not deleted " + f.getName());
    }
}
