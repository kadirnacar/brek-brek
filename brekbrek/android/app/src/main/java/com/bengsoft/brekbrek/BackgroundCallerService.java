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

import com.bengsoft.brekbrek.NativeModules.ChannelModule;
import com.bengsoft.brekbrek.utils.VolumeKeyController;

import java.util.Timer;
import java.util.TimerTask;


public class BackgroundCallerService extends Service {

    VolumeKeyController mVolumeKeyController;

    public BackgroundCallerService() {
        super();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= 26) {
            String CHANNEL_ID = "brekbrek";
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                    "BrekBrek",
                    NotificationManager.IMPORTANCE_DEFAULT);

            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);

            Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle("")
                    .setContentText("").build();

            startForeground(1, notification);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        this.startTimer();
        this.mVolumeKeyController = new VolumeKeyController(getApplicationContext());
        this.mVolumeKeyController.setActive(true);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        //this.mVolumeKeyController.setActive(false);
        this.mVolumeKeyController.destroy();
        stoptimertask();
        super.onDestroy();
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
                ChannelModule.callScript("timer", null, 0);
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
