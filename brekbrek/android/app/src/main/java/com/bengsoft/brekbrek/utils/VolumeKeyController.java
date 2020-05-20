package com.kadirnacar.brekbrek.utils;

import android.content.Context;
import android.media.AudioManager;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

import androidx.media.VolumeProviderCompat;

public class VolumeKeyController {

    private MediaSessionCompat mMediaSession;
    private final Context mContext;

    public VolumeKeyController(Context context) {
        mContext = context;
    }

    private void createMediaSession() {
        mMediaSession = new MediaSessionCompat(mContext, "Tag");

        mMediaSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS
                | MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS | MediaSessionCompat.FLAG_HANDLES_QUEUE_COMMANDS);
        mMediaSession.setPlaybackState(
                new PlaybackStateCompat.Builder().setState(PlaybackStateCompat.STATE_PLAYING, 0, 1.0f).build());
        mMediaSession.setPlaybackToRemote(getVolumeProvider());
        mMediaSession.setActive(true);
        Recorder.init();
    }

    int state = 0;

    private VolumeProviderCompat getVolumeProvider() {
        final AudioManager audio = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);

        int STREAM_TYPE = AudioManager.STREAM_MUSIC;
        int currentVolume = audio.getStreamVolume(STREAM_TYPE);
        int maxVolume = audio.getStreamMaxVolume(STREAM_TYPE);
        final int VOLUME_UP = 1;
        final int VOLUME_DOWN = -1;
        // return new VolumeProviderCompat(VolumeProviderCompat.VOLUME_CONTROL_RELATIVE,
        // maxVolume, currentVolume) {
        return new VolumeProviderCompat(VolumeProviderCompat.VOLUME_CONTROL_RELATIVE, maxVolume, currentVolume) {
            @Override
            public void onAdjustVolume(int direction) {
                // Up = 1, Down = -1, Release = 0
                // Replace with your action, if you don't want to adjust system volume
                if (direction == 0) {
                    state = 0;
                    Recorder.stop();
                } else if (direction != state) {
                    state = direction;
                    Recorder.start();
                }
                if (direction == VOLUME_UP) {
                    audio.adjustStreamVolume(STREAM_TYPE,
                            AudioManager.ADJUST_RAISE, AudioManager.FLAG_REMOVE_SOUND_AND_VIBRATE);
                }
                else if (direction == VOLUME_DOWN) {
                    audio.adjustStreamVolume(STREAM_TYPE,
                            AudioManager.ADJUST_LOWER, AudioManager.FLAG_REMOVE_SOUND_AND_VIBRATE);
                }
                setCurrentVolume(audio.getStreamVolume(STREAM_TYPE));
            }
        };
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
