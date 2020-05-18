package com.bengsoft.brekbrek;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

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
        this.mVolumeKeyController = new VolumeKeyController(this.appCtx);
        this.mVolumeKeyController.setActive(true);
    }

    public BackgroundCallerService() {
    }
    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= 26) {
            String CHANNEL_ID = "my_channel_01";
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);

            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);

            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("")
                    .setContentText("").build();

            startForeground(1, notification);
        }
        //startForeground(1,new Notification());
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        this.startTimer();
        return START_STICKY;
    }
//    @Override
//    public void onTaskRemoved(Intent rootIntent) {
//
////        Intent restartService = new Intent(getApplicationContext(), this.getClass());
////        restartService.setPackage(getPackageName());
////        PendingIntent restartServicePI = PendingIntent.getService(
////                getApplicationContext(), 1, restartService,
////                PendingIntent.FLAG_ONE_SHOT);
////        AlarmManager alarmService = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
////        alarmService.set(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime() + 100, restartServicePI);
//
//        /*if (Build.VERSION.SDK_INT <= 19) {
//            Intent restart = new Intent(getApplicationContext(), this.getClass());
//            restart.setPackage(getPackageName());
//            startService(restart);
//        }*/
////        Intent broadcastIntent = new Intent(getApplicationContext(), BackgroundCallerRestarterBroadcastReceiver.class);
////        sendBroadcast(broadcastIntent);
//
//        super.onTaskRemoved(rootIntent);
//    }

    @Override
    public void onDestroy() {
        super.onDestroy();
//        Intent broadcastIntent = new Intent(this, BackgroundCallerRestarterBroadcastReceiver.class);
//        sendBroadcast(broadcastIntent);
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
