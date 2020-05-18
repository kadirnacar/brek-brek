package com.bengsoft.brekbrek;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class BackgroundCallerRestarterBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        //context.startService(new Intent(context, BackgroundCallerService.class));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(new Intent(context, BackgroundCallerService.class));
        } else {
            context.startService(new Intent(context, BackgroundCallerService.class));
        }
    }
}
