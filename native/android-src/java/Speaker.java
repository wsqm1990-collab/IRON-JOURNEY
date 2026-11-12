package com.wsqm1990.ironjourney;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;

import java.util.ArrayList;
import java.util.Locale;

/**
 * The phone's own text-to-speech voice. While it speaks, other apps (the show) are asked to
 * lower their volume for a moment ("ducking") instead of pausing.
 */
final class Speaker implements TextToSpeech.OnInitListener {
    private static Speaker inst;

    static synchronized Speaker get(Context c) {
        if (inst == null) inst = new Speaker(c.getApplicationContext());
        return inst;
    }

    private final Context ctx;
    private final AudioManager am;
    private final ArrayList<String[]> pending = new ArrayList<>();
    private TextToSpeech tts;
    private boolean ready = false, failed = false;
    private String lang = "en-US", appliedLang = "";
    private int counter = 0;
    private String lastId = "";
    private AudioFocusRequest focusReq;
    private final AudioManager.OnAudioFocusChangeListener focusListener = new AudioManager.OnAudioFocusChangeListener() {
        @Override public void onAudioFocusChange(int change) { }
    };

    private Speaker(Context c) {
        ctx = c;
        am = (AudioManager) c.getSystemService(Context.AUDIO_SERVICE);
        init();
    }

    private void init() {
        try {
            ready = false;
            failed = false;
            tts = new TextToSpeech(ctx, this);
        } catch (Exception e) {
            failed = true;
            Log.w(IronTimerService.TAG, "tts create failed", e);
        }
    }

    static AudioAttributes attrs() {
        return new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build();
    }

    @Override
    public synchronized void onInit(int status) {
        ready = status == TextToSpeech.SUCCESS;
        Log.i(IronTimerService.TAG, "tts init status=" + status);
        if (!ready) {
            failed = true;
            pending.clear();
            return;
        }
        try {
            tts.setAudioAttributes(attrs());
            tts.setSpeechRate(1.05f);
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String utteranceId) { }
                @Override public void onDone(String utteranceId) { finished(utteranceId); }
                @Override public void onError(String utteranceId) { finished(utteranceId); }
                @Override public void onStop(String utteranceId, boolean interrupted) { finished(utteranceId); }
            });
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "tts setup", e);
        }
        applyLang(lang);
        for (String[] p : pending) speakNow(p[0], p[1], "1".equals(p[2]));
        pending.clear();
    }

    synchronized void prepare(String l) {
        if (l != null && l.length() > 0) lang = l;
        if (ready) applyLang(lang);
        else if (failed) init();
    }

    synchronized void say(String text, String l, boolean duck) {
        if (text == null || text.trim().length() == 0) return;
        if (l == null || l.length() == 0) l = lang;
        if (failed) init();
        if (!ready) {
            if (pending.size() < 4) pending.add(new String[]{text, l, duck ? "1" : "0"});
            return;
        }
        speakNow(text, l, duck);
    }

    synchronized void stop() {
        try { if (tts != null && ready) tts.stop(); } catch (Exception ignored) { }
        abandonFocus();
    }

    private void applyLang(String l) {
        if (tts == null || l.equals(appliedLang)) return;
        try {
            Locale loc = Locale.forLanguageTag(l);
            int r = tts.setLanguage(loc);
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                r = tts.setLanguage(new Locale(loc.getLanguage()));
            }
            appliedLang = l;
            Log.i(IronTimerService.TAG, "tts language " + l + " result=" + r);
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "tts language", e);
        }
    }

    private void speakNow(String text, String l, boolean duck) {
        try {
            lang = l;
            applyLang(l);
            if (duck) requestFocus();
            Bundle params = new Bundle();
            params.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1.0f);
            lastId = "ij" + (++counter);
            int r = tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, lastId);
            Log.i(IronTimerService.TAG, "speak result=" + r + " text=" + text);
            if (r != TextToSpeech.SUCCESS) abandonFocus();
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "speak failed", e);
            abandonFocus();
        }
    }

    private synchronized void finished(String utteranceId) {
        if (utteranceId != null && utteranceId.equals(lastId)) abandonFocus();
    }

    @SuppressWarnings("deprecation")
    private void requestFocus() {
        if (am == null) return;
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                if (focusReq == null) {
                    focusReq = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                            .setAudioAttributes(attrs())
                            .setOnAudioFocusChangeListener(focusListener)
                            .build();
                }
                am.requestAudioFocus(focusReq);
            } else {
                am.requestAudioFocus(focusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
            }
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "audio focus", e);
        }
    }

    @SuppressWarnings("deprecation")
    private void abandonFocus() {
        if (am == null) return;
        try {
            if (Build.VERSION.SDK_INT >= 26) { if (focusReq != null) am.abandonAudioFocusRequest(focusReq); }
            else am.abandonAudioFocus(focusListener);
        } catch (Exception ignored) { }
    }
}
