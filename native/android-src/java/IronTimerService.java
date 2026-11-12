package com.wsqm1990.ironjourney;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Runs a guided timeline (HIIT intervals or a rest timer) as a foreground service, so the
 * voice, beeps and vibration keep coming while another app (Netflix, YouTube...) fills the
 * screen. The web app sends the whole timeline once; after that this service owns the clock.
 *
 * Time model (same as the web player): elapsed = (pausedAt || now) - start - pausedTotal.
 */
public class IronTimerService extends Service {
    static final String TAG = "IronTimer";
    static final String ACTION_START = "com.wsqm1990.ironjourney.START";
    static final String ACTION_TOGGLE = "com.wsqm1990.ironjourney.TOGGLE";
    static final String ACTION_SKIP = "com.wsqm1990.ironjourney.SKIP";
    static final String ACTION_STOP = "com.wsqm1990.ironjourney.STOP";
    static final String EXTRA_PLAN = "plan";
    static final String CHANNEL = "workout_timer";
    static final int NOTIF_ID = 4711;
    static final int DONE_ID = 4712;
    private static final String PREFS = "iron_timer";

    static volatile IronTimerService instance;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wakeLock;

    private String kind = "hiit", id = "", title = "", mode = "voz", lang = "en-US";
    private boolean duck = true, fresh = false, running = false;
    private long[] segMs = new long[0];
    private String[] labels = new String[0], says = new String[0], rounds = new String[0];
    private boolean[] strong = new boolean[0];
    private String intro = "", half = "", done = "";
    private String nextTpl = "Next: {s} · {t}", lastTxt = "Last part", pausedTxt = "Paused";
    private String lblPause = "Pause", lblResume = "Resume", lblSkip = "Skip", lblStop = "Finish";
    private String channelName = "Workout timer", doneTitle = "", doneText = "";
    private long ini, pausa, pausadoEm, totalMs;
    private int idx = -1, halfIdx = -1;
    private String lastBeep = "";

    private final Runnable tick = new Runnable() { @Override public void run() { onTick(); } };

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        instance = this;
        String action = intent != null ? intent.getAction() : null;
        if (ACTION_START.equals(action)) {
            // A foreground start must reach startForeground() quickly, whatever happens next.
            ensureChannel();
            startInForeground(simpleNotification());
            if (!startPlan(intent.getStringExtra(EXTRA_PLAN))) {
                stopForeground(STOP_FOREGROUND_REMOVE);
                stopSelf();
            }
        } else if (ACTION_TOGGLE.equals(action)) {
            togglePause(true);
        } else if (ACTION_SKIP.equals(action)) {
            skip(true);
        } else if (ACTION_STOP.equals(action)) {
            finish(false, true);
        } else if (!running) {
            stopSelf();
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        releaseWake();
        if (instance == this) instance = null;
        super.onDestroy();
    }

    /** Runs a job on the service's thread (the main looper). */
    void post(Runnable r) { handler.post(r); }

    // ---------------------------------------------------------------- plan

    private boolean startPlan(String json) {
        try {
            JSONObject o = new JSONObject(json == null ? "{}" : json);
            JSONArray segs = o.optJSONArray("segs");
            int n = segs == null ? 0 : segs.length();
            if (n == 0) return false;
            kind = o.optString("kind", "hiit");
            id = o.optString("id", "");
            title = o.optString("title", "");
            mode = o.optString("mode", "voz");
            lang = o.optString("lang", "en-US");
            duck = o.optBoolean("duck", true);
            fresh = o.optBoolean("fresh", false);
            intro = o.optString("intro", "");
            half = o.optString("half", "");
            done = o.optString("done", "");
            JSONObject lb = o.optJSONObject("labels");
            if (lb != null) {
                nextTpl = lb.optString("next", nextTpl);
                lastTxt = lb.optString("last", lastTxt);
                pausedTxt = lb.optString("paused", pausedTxt);
                lblPause = lb.optString("pause", lblPause);
                lblResume = lb.optString("resume", lblResume);
                lblSkip = lb.optString("skip", lblSkip);
                lblStop = lb.optString("stop", lblStop);
                channelName = lb.optString("channel", channelName);
                doneTitle = lb.optString("doneTitle", "");
                doneText = lb.optString("doneText", "");
            }
            segMs = new long[n];
            labels = new String[n];
            says = new String[n];
            rounds = new String[n];
            strong = new boolean[n];
            totalMs = 0;
            for (int i = 0; i < n; i++) {
                JSONObject s = segs.optJSONObject(i);
                if (s == null) s = new JSONObject();
                segMs[i] = Math.max(1000L, Math.round(s.optDouble("s", 1) * 1000.0));
                labels[i] = s.optString("label", "");
                says[i] = s.optString("say", "");
                rounds[i] = s.optString("round", "");
                strong[i] = s.optBoolean("strong", false);
                totalMs += segMs[i];
            }
            long now = System.currentTimeMillis();
            ini = o.optLong("ini", now);
            pausa = o.optLong("pausa", 0);
            pausadoEm = o.optLong("pausadoEm", 0);
            idx = -1;
            halfIdx = -1;
            lastBeep = "";
            running = true;
            Speaker.get(this).prepare(lang);
            ensureChannel();
            startInForeground(buildNotification());
            acquireWake();
            saveState(false, false, 0);
            handler.removeCallbacks(tick);
            handler.post(tick);
            Log.i(TAG, "start kind=" + kind + " id=" + id + " segs=" + n + " fresh=" + fresh + " mode=" + mode);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "bad plan", e);
            return false;
        }
    }

    /** New timing or settings from the app (pause, resume, skip, alert mode). */
    void applyState(String json) {
        if (!running) return;
        try {
            JSONObject o = new JSONObject(json == null ? "{}" : json);
            if (o.has("ini")) ini = o.optLong("ini", ini);
            if (o.has("pausa")) pausa = o.optLong("pausa", pausa);
            if (o.has("pausadoEm")) pausadoEm = o.optLong("pausadoEm", pausadoEm);
            if (o.has("mode")) mode = o.optString("mode", mode);
            if (o.has("duck")) duck = o.optBoolean("duck", duck);
            saveState(false, false, 0);
            handler.removeCallbacks(tick);
            handler.post(tick);
            updateNotification();
            Log.i(TAG, "update paused=" + (pausadoEm > 0) + " mode=" + mode);
        } catch (Exception e) {
            Log.w(TAG, "bad update", e);
        }
    }

    void stopFromApp(String onlyKind) {
        if (!running) return;
        if (onlyKind != null && !onlyKind.isEmpty() && !onlyKind.equals(kind)) return;
        finish(false, false);
    }

    void togglePause(boolean fromNotification) {
        if (!running) return;
        long now = System.currentTimeMillis();
        if (pausadoEm > 0) { pausa += now - pausadoEm; pausadoEm = 0; } else { pausadoEm = now; }
        saveState(false, false, 0);
        handler.removeCallbacks(tick);
        handler.post(tick);
        updateNotification();
        if (fromNotification) IronTimerPlugin.emit(stateJson("state"));
    }

    void skip(boolean fromNotification) {
        if (!running) return;
        long e = elapsed();
        long acc = 0;
        for (long s : segMs) { acc += s; if (e < acc) break; }
        ini -= (acc - e) + 50;
        saveState(false, false, 0);
        handler.removeCallbacks(tick);
        handler.post(tick);
        if (fromNotification) IronTimerPlugin.emit(stateJson("state"));
    }

    private long elapsed() {
        long now = System.currentTimeMillis();
        long e = (pausadoEm > 0 ? pausadoEm : now) - ini - pausa;
        return Math.max(0, e);
    }

    // ---------------------------------------------------------------- the clock

    private void onTick() {
        if (!running) return;
        long e = elapsed();
        int i = 0;
        long acc = 0;
        while (i < segMs.length && e >= acc + segMs[i]) { acc += segMs[i]; i++; }
        if (i >= segMs.length) { finish(true, false); return; }
        long left = acc + segMs[i] - e;
        if (i != idx) {
            boolean changed = idx != -1;
            idx = i;
            if (changed) cue(i);
            else if (fresh) {
                fresh = false;
                if ("voz".equals(mode) && intro.length() > 0) speakLater(intro, 300);
            }
            updateNotification();
        }
        if (pausadoEm == 0) {
            int rs = (int) Math.ceil(left / 1000.0);
            String key = i + ":" + rs;
            if (rs >= 1 && rs <= 3 && segMs[i] >= 10000 && !key.equals(lastBeep)) {
                lastBeep = key;
                if (!"mudo".equals(mode)) Tones.countdown();
                Haptics.vibrate(this, new long[]{0, 60});
            }
            if (segMs[i] >= 60000 && halfIdx != i && left <= segMs[i] / 2 && left > segMs[i] / 2 - 2000) {
                halfIdx = i;
                if ("voz".equals(mode) && half.length() > 0) Speaker.get(this).say(half, lang, duck);
            }
        }
        handler.postDelayed(tick, pausadoEm > 0 ? 1000 : 200);
    }

    private void cue(int i) {
        if (!"mudo".equals(mode)) { if (strong[i]) Tones.strong(); else Tones.easy(); }
        Haptics.vibrate(this, strong[i] ? new long[]{0, 250, 90, 250, 90, 250} : new long[]{0, 600});
        if ("voz".equals(mode) && says[i].length() > 0) speakLater(says[i], 450);
        Log.i(TAG, "cue seg=" + i + " strong=" + strong[i] + " mode=" + mode + " say=" + says[i]);
    }

    private void speakLater(final String text, long delayMs) {
        handler.postDelayed(new Runnable() {
            @Override public void run() { Speaker.get(IronTimerService.this).say(text, lang, duck); }
        }, delayMs);
    }

    private void finish(boolean complete, boolean fromNotification) {
        if (!running) return;
        running = false;
        handler.removeCallbacks(tick);
        long endedAt = pausadoEm > 0 ? pausadoEm : System.currentTimeMillis();
        boolean rest = "rest".equals(kind);
        if (complete) {
            if (rest) {
                if (!"mudo".equals(mode)) Tones.restDone();
                Haptics.vibrate(this, new long[]{0, 220, 120, 220});
            } else {
                if (!"mudo".equals(mode)) Tones.done();
                Haptics.vibrate(this, new long[]{0, 200, 80, 200, 80, 400});
            }
            if ("voz".equals(mode) && done.length() > 0) speakLater(done, rest ? 350 : 700);
        }
        saveState(true, complete, endedAt);
        JSONObject ev = stateJson(complete ? "done" : "stopped");
        try { ev.put("by", fromNotification ? "notification" : "app"); ev.put("endedAt", endedAt); } catch (Exception ignored) { }
        IronTimerPlugin.emit(ev);
        Log.i(TAG, "finish complete=" + complete + " kind=" + kind + " by=" + (fromNotification ? "notification" : "app"));
        stopForeground(STOP_FOREGROUND_REMOVE);
        if (complete && !rest && doneTitle.length() > 0) postDone();
        releaseWake();
        handler.postDelayed(new Runnable() {
            @Override public void run() { if (!running) stopSelf(); }
        }, 9000);
    }

    // ---------------------------------------------------------------- state shared with the app

    private JSONObject stateJson(String type) {
        JSONObject o = new JSONObject();
        try {
            o.put("type", type);
            o.put("kind", kind);
            o.put("id", id);
            o.put("ini", ini);
            o.put("pausa", pausa);
            o.put("pausadoEm", pausadoEm);
            o.put("running", running);
        } catch (Exception ignored) { }
        return o;
    }

    private void saveState(boolean ended, boolean complete, long endedAt) {
        JSONObject o = stateJson("state");
        try {
            o.put("ended", ended);
            o.put("complete", complete);
            o.put("endedAt", endedAt);
        } catch (Exception ignored) { }
        getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("state", o.toString()).apply();
    }

    /** What the app sees when it comes back: the live session, or how the last one ended. */
    static JSONObject readState(Context ctx) {
        IronTimerService s = instance;
        if (s != null && s.running) {
            JSONObject o = s.stateJson("state");
            try { o.put("ended", false); } catch (Exception ignored) { }
            return o;
        }
        String raw = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("state", null);
        try {
            JSONObject o = raw == null ? new JSONObject() : new JSONObject(raw);
            o.put("running", false);
            return o;
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    static void clearEnded(Context ctx) {
        IronTimerService s = instance;
        if (s != null && s.running) return;
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove("state").apply();
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(DONE_ID);
    }

    // ---------------------------------------------------------------- notification

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, channelName, NotificationManager.IMPORTANCE_LOW);
        ch.setShowBadge(false);
        ch.setSound(null, null);
        ch.enableVibration(false);
        nm.createNotificationChannel(ch);
    }

    private void startInForeground(Notification n) {
        try {
            if (Build.VERSION.SDK_INT >= 29) startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            else startForeground(NOTIF_ID, n);
        } catch (Exception e) {
            Log.e(TAG, "startForeground failed", e);
        }
    }

    private NotificationCompat.Builder base() {
        return new NotificationCompat.Builder(this, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_iron)
                .setColor(0xFF1C58D2)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(openApp());
    }

    private Notification simpleNotification() {
        return base().setOngoing(true).setContentTitle("Iron Journey")
                .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE).build();
    }

    private Notification buildNotification() {
        NotificationCompat.Builder b = base().setOngoing(true)
                .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE);
        int i = Math.max(0, Math.min(idx, segMs.length - 1));
        if (segMs.length == 0) return b.setContentTitle(title).build();
        b.setContentTitle(labels[i] + (rounds[i].length() > 0 ? " · " + rounds[i] : ""));
        String next = i + 1 < labels.length
                ? nextTpl.replace("{s}", labels[i + 1]).replace("{t}", mmss(segMs[i + 1]))
                : lastTxt;
        b.setContentText(pausadoEm > 0 ? pausedTxt + " · " + next : next);
        if (title.length() > 0) b.setSubText(title);
        if (pausadoEm == 0 && running) {
            long acc = 0;
            for (int k = 0; k < i; k++) acc += segMs[k];
            long left = acc + segMs[i] - elapsed();
            b.setUsesChronometer(true).setChronometerCountDown(true)
                    .setWhen(System.currentTimeMillis() + Math.max(0, left)).setShowWhen(true);
        } else {
            b.setUsesChronometer(false).setShowWhen(false);
        }
        b.addAction(0, pausadoEm > 0 ? lblResume : lblPause, action(ACTION_TOGGLE, 1));
        if (!"rest".equals(kind)) b.addAction(0, lblSkip, action(ACTION_SKIP, 2));
        b.addAction(0, lblStop, action(ACTION_STOP, 3));
        return b.build();
    }

    @SuppressLint("MissingPermission")
    private void updateNotification() {
        if (!running) return;
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(NOTIF_ID, buildNotification());
        } catch (Exception e) {
            Log.w(TAG, "notify failed", e);
        }
    }

    @SuppressLint("MissingPermission")
    private void postDone() {
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(DONE_ID, base().setAutoCancel(true).setContentTitle(doneTitle).setContentText(doneText).build());
        } catch (Exception e) {
            Log.w(TAG, "done notification failed", e);
        }
    }

    private PendingIntent action(String act, int code) {
        Intent i = new Intent(this, IronTimerService.class).setAction(act);
        return PendingIntent.getService(this, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private PendingIntent openApp() {
        Intent i = new Intent(this, MainActivity.class);
        i.setAction(Intent.ACTION_MAIN);
        i.addCategory(Intent.CATEGORY_LAUNCHER);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return PendingIntent.getActivity(this, 10, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static String mmss(long ms) {
        long s = Math.max(0, (ms + 999) / 1000);
        long r = s % 60;
        return (s / 60) + ":" + (r < 10 ? "0" : "") + r;
    }

    // ---------------------------------------------------------------- keep the CPU awake (screen off, music)

    private void acquireWake() {
        try {
            if (wakeLock == null) {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                if (pm == null) return;
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "IronJourney:timer");
                wakeLock.setReferenceCounted(false);
            }
            wakeLock.acquire(Math.max(60000L, totalMs + 15L * 60000L));
        } catch (Exception e) {
            Log.w(TAG, "wake lock", e);
        }
    }

    private void releaseWake() {
        try { if (wakeLock != null && wakeLock.isHeld()) wakeLock.release(); } catch (Exception ignored) { }
    }
}
