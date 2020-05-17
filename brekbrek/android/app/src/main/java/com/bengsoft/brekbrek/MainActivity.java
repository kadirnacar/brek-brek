package com.bengsoft.brekbrek;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;

import android.app.ActivityManager;
import android.content.Context;
import android.app.Service;
import android.os.IBinder;
import android.app.Activity;
import androidx.core.content.ContextCompat;

public class MainActivity extends ReactActivity {
    Intent mServiceIntent;
    private BackgroundCallerService mBackgroundCallerService;

    Context ctx;

    public Context getCtx() {
        return ctx;
    }

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
        mBackgroundCallerService = new BackgroundCallerService(getCtx());
        mServiceIntent = new Intent(getCtx(), mBackgroundCallerService.getClass());
        if (!isMyServiceRunning(mBackgroundCallerService.getClass())) {
            startService(mServiceIntent);
        }
    }

    @Override
    protected void onDestroy() {
        stopService(mServiceIntent);
        super.onDestroy();
    }

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}
