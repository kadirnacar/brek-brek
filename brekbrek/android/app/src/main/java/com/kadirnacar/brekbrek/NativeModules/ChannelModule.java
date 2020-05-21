package com.kadirnacar.brekbrek.NativeModules;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.kadirnacar.brekbrek.BackgroundCallerService;
import com.kadirnacar.brekbrek.MainApplication;
import com.kadirnacar.brekbrek.utils.Player;
import com.kadirnacar.brekbrek.utils.Recorder;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.Arrays;

public class ChannelModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static Context aContext;

    Intent mServiceIntent;
    private BackgroundCallerService mBackgroundCallerService;

    public ChannelModule(ReactApplicationContext context, Context aContext) {
        super(context);
        reactContext = context;
        aContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ChannelModule";
    }

    @ReactMethod
    public void startService() {
        Player.init();
        mBackgroundCallerService = new BackgroundCallerService();
        mServiceIntent = new Intent(reactContext, mBackgroundCallerService.getClass());
        if (!isMyServiceRunning(mBackgroundCallerService.getClass())) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(mServiceIntent);
            } else {
                reactContext.startService(mServiceIntent);
            }
        }
    }

    @ReactMethod
    public void stopService() {
        if (mServiceIntent != null) {
            reactContext.stopService(mServiceIntent);
        }
        Recorder.stop();
        Player.stop();
    }

    @ReactMethod
    public void startRecord() {
        Recorder.start();
    }

    @ReactMethod
    public void stopRecord() {
        Recorder.stop();
    }

    @ReactMethod
    public void startPlay() {
        Player.start();
    }

    @ReactMethod
    public void stopPlay() {
        Player.stop();
    }

    @ReactMethod
    public void stream(String baseData) {
        try {
            Player.stream(Base64.decode(baseData, Base64.DEFAULT));
        } catch (Exception ex) {

        }
    }

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }


    public static void callScript(String msg, @Nullable byte[] data, @Nullable int size) {
        MainApplication application = (MainApplication) reactContext.getApplicationContext();
        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext != null) {
            try {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                WritableNativeArray params = new WritableNativeArray();
                params.pushString(msg);
                if (data != null) {
                    params.pushString(Base64.encodeToString(Arrays.copyOf(data, size), Base64.DEFAULT));
                    params.pushInt(size);
                }
                catalystInstance.callFunction("JavaScriptVisibleToJava", "getCommand", params);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    static byte[] readableArrayToByteArray(ReadableArray readableArray) {
        byte[] arr = new byte[readableArray.size()];
        for (int i = 0; i < readableArray.size(); i++) {
            arr[i] = (byte) readableArray.getInt(i);
        }

        return arr;
    }

    static ReadableArray byteArrayToBoolReadableArray(byte[] arr, int size) {
        WritableArray writableArray = new WritableNativeArray();
        int x = 0;
        for (int i : arr) {
            writableArray.pushInt(i);
            x++;
            if (x == size) {
                break;
            }
        }

        return writableArray;
    }

}