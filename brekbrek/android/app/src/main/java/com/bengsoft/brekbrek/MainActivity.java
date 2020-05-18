package com.bengsoft.brekbrek;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    Context ctx;

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BrekBrek";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ctx = this;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
