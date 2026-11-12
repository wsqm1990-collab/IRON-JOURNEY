package com.wsqm1990.ironjourney;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.util.Log;

/** Short synthesized beeps (same notes as the web player), played on the media volume. */
final class Tones {
    private Tones() { }

    static void strong() { play(new double[][]{{1046, 0.18, 0}, {1318, 0.30, 0.20}}, 0.85); }
    static void easy() { play(new double[][]{{523, 0.60, 0}}, 0.85); }
    static void countdown() { play(new double[][]{{880, 0.12, 0}}, 0.6); }
    static void done() { play(new double[][]{{784, 0.20, 0}, {988, 0.20, 0.22}, {1318, 0.50, 0.44}}, 0.85); }
    static void restDone() { play(new double[][]{{880, 0.20, 0}, {880, 0.20, 0.28}}, 0.85); }

    /** notes: {frequency Hz, duration s, start s} */
    static void play(final double[][] notes, final double volume) {
        new Thread(new Runnable() {
            @Override public void run() { playBlocking(notes, volume); }
        }, "ij-tone").start();
    }

    private static void playBlocking(double[][] notes, double volume) {
        final int rate = 44100;
        double end = 0;
        for (double[] n : notes) end = Math.max(end, n[1] + n[2]);
        int len = (int) ((end + 0.05) * rate);
        short[] pcm = new short[len];
        for (double[] n : notes) {
            int start = (int) (n[2] * rate);
            int count = (int) (n[1] * rate);
            for (int k = 0; k < count && start + k < len; k++) {
                double t = k / (double) rate;
                double env = t < 0.015 ? t / 0.015 : Math.exp(-3.5 * (t - 0.015) / n[1]);
                double tail = (n[1] - t) / 0.012;
                if (tail < 1) env *= Math.max(0, tail);
                double v = Math.sin(2 * Math.PI * n[0] * t) * env * volume;
                int sample = pcm[start + k] + (int) (v * 32767 * 0.9);
                pcm[start + k] = (short) Math.max(-32768, Math.min(32767, sample));
            }
        }
        AudioTrack track = null;
        try {
            track = new AudioTrack.Builder()
                    .setAudioAttributes(new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ASSISTANCE_NAVIGATION_GUIDANCE)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build())
                    .setAudioFormat(new AudioFormat.Builder()
                            .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                            .setSampleRate(rate)
                            .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                            .build())
                    .setBufferSizeInBytes(len * 2)
                    .setTransferMode(AudioTrack.MODE_STATIC)
                    .build();
            track.write(pcm, 0, len);
            track.play();
            Log.i(IronTimerService.TAG, "tone notes=" + notes.length);
            Thread.sleep((long) ((end + 0.15) * 1000));
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "tone failed", e);
        } finally {
            if (track != null) {
                try { track.stop(); } catch (Exception ignored) { }
                track.release();
            }
        }
    }
}

/** Vibration patterns: {delay, on, off, on, ...} in milliseconds. */
final class Haptics {
    private Haptics() { }

    @SuppressWarnings("deprecation")
    static void vibrate(Context c, long[] pattern) {
        try {
            Vibrator v;
            if (Build.VERSION.SDK_INT >= 31) {
                VibratorManager vm = (VibratorManager) c.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                v = vm == null ? null : vm.getDefaultVibrator();
            } else {
                v = (Vibrator) c.getSystemService(Context.VIBRATOR_SERVICE);
            }
            if (v == null || !v.hasVibrator()) return;
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(pattern, -1));
            else v.vibrate(pattern, -1);
        } catch (Exception e) {
            Log.w(IronTimerService.TAG, "vibrate failed", e);
        }
    }
}
