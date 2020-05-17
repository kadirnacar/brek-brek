package com.bengsoft.brekbrek;

import android.content.Context;
import android.media.AudioManager;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

import androidx.media.VolumeProviderCompat;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;

public class VolumeKeyController {

    private MediaSessionCompat mMediaSession;
    private final Context mContext;

    public VolumeKeyController(Context context) {
        mContext = context;
    }

    private void createMediaSession() {
        mMediaSession = new MediaSessionCompat(mContext, "Tag");

        mMediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS |
                MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS |
                MediaSessionCompat.FLAG_HANDLES_QUEUE_COMMANDS);
        mMediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(PlaybackStateCompat.STATE_PLAYING, 0, 1.0f)
                .build());
        mMediaSession.setPlaybackToRemote(getVolumeProvider());
        mMediaSession.setActive(true);
    }

    int state = 0;

    private VolumeProviderCompat getVolumeProvider() {
        final AudioManager audio = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);

        int STREAM_TYPE = AudioManager.STREAM_MUSIC;
        int currentVolume = audio.getStreamVolume(STREAM_TYPE);
        int maxVolume = audio.getStreamMaxVolume(STREAM_TYPE);
        final int VOLUME_UP = 1;
        final int VOLUME_DOWN = -1;
        return new VolumeProviderCompat(VolumeProviderCompat.VOLUME_CONTROL_RELATIVE, maxVolume, currentVolume) {
            @Override
            public void onAdjustVolume(int direction) {
                // Up = 1, Down = -1, Release = 0
                // Replace with your action, if you don't want to adjust system volume
                if (direction == 0) {
                    state = 0;
                    callScript("stop");
                } else if (direction != state) {
                    state = direction;
                    callScript("start");
                }
            }
        };
    }

    private void callScript(String msg) {
        MainApplication application = (MainApplication) this.mContext.getApplicationContext();
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

    // Call when control needed, add a call to constructor if needed immediately
    public void setActive(boolean active) {
        if (mMediaSession != null) {
            mMediaSession.setActive(active);
            return;
        }
        createMediaSession();
    }

    // Call from Service's onDestroy method
    public void destroy() {
        if (mMediaSession != null) {
            mMediaSession.release();
        }
    }
}
