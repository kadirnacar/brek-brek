package com.bengsoft.brekbrek;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;

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
            //startService(mServiceIntent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(mServiceIntent);
            } else {
                startService(mServiceIntent);
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //stopService(mServiceIntent);
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

    private void callScript(String msg) {
        MainApplication application = (MainApplication) this.getApplication();
        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if (reactContext != null) {
            try {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                WritableNativeArray params = new WritableNativeArray();
                params.pushString(msg);
                catalystInstance.callFunction("JavaScriptVisibleToJava", "getCommand", params);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
}
