package com.bengsoft.brekbrek;

import android.content.Context;
import android.content.Intent;
import android.app.Service;
import android.database.ContentObserver;
import android.media.AudioManager;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.KeyEvent;

import androidx.annotation.Nullable;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;


public class BackgroundCallerService extends Service {

    Context appCtx;

    public BackgroundCallerService(Context applicationContext) {
        super();
        this.appCtx = applicationContext;

    }

    public BackgroundCallerService() {
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        startTimer();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Intent broadcastIntent = new Intent(this, BackgroundCallerRestarterBroadcastReceiver.class);
        sendBroadcast(broadcastIntent);
        stoptimertask();
    }

    private Timer timer;
    private TimerTask timerTask;

    public void startTimer() {
        timer = new Timer();

        initializeTimerTask();

        timer.schedule(timerTask, 0, 1000); //

    }

    public void initializeTimerTask() {
        MainApplication application = (MainApplication) this.getApplication();
        timerTask = new TimerTask() {
            public void run() {
                //callScript(application,"timer");
            }
        };
    }

    private void callScript(MainApplication application, String msg) {
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

    public void stoptimertask() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

}
