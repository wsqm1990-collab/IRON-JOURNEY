package com.wsqm1990.ironjourney;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IronTimerPlugin.class);
        try {
            EdgeToEdge.enable(this);
        } catch (Exception ignored) { }
        super.onCreate(savedInstanceState);
    }
}
