package com.bengsoft.brekbrek;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;

import androidx.annotation.Nullable;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Timer;
import java.util.TimerTask;


public class BackgroundCallerService extends Service {

    Context appCtx;
    VolumeKeyController mVolumeKeyController;

    public BackgroundCallerService(Context applicationContext) {
        super();
        this.appCtx = applicationContext;
        this.mVolumeKeyController = new VolumeKeyController(applicationContext);
        this.mVolumeKeyController.setActive(true);
    }

    public BackgroundCallerService() {
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        this.callScript("start");
        this.startTimer();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.callScript("destroy");
        Intent broadcastIntent = new Intent(this, BackgroundCallerRestarterBroadcastReceiver.class);
        sendBroadcast(broadcastIntent);
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


    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    private Timer timer;
    private TimerTask timerTask;

    public void startTimer() {
        timer = new Timer();

        initializeTimerTask();

        timer.schedule(timerTask, 0, 1000); //
    }

    public void initializeTimerTask() {
        timerTask = new TimerTask() {
            public void run() {
                callScript("timer");
            }
        };
    }

    public void stoptimertask() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }
}
