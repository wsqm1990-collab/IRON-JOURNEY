package com.wsqm1990.ironjourney;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IronTimerPlugin.class);
        super.onCreate(savedInstanceState);
        // After Capacitor has switched from the launch theme, or the launch theme's title bar sticks.
        try {
            EdgeToEdge.enable(this);
        } catch (Exception ignored) { }
        IronTimerPlugin.applySavedBundle(this, getBridge());
    }
}
