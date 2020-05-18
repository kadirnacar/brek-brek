package com.bengsoft.brekbrek;

import android.content.Context;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.media.VolumeProviderCompat;

import com.bengsoft.brekbrek.utils.OpusEncoder;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
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
        init();
    }

    int state = 0;

    private VolumeProviderCompat getVolumeProvider() {
        final AudioManager audio = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);

        int STREAM_TYPE = AudioManager.STREAM_MUSIC;
        int currentVolume = audio.getStreamVolume(STREAM_TYPE);
        int maxVolume = audio.getStreamMaxVolume(STREAM_TYPE);
        return new VolumeProviderCompat(VolumeProviderCompat.VOLUME_CONTROL_RELATIVE, maxVolume, currentVolume) {
            @Override
            public void onAdjustVolume(int direction) {
                // Up = 1, Down = -1, Release = 0
                // Replace with your action, if you don't want to adjust system volume
                if (direction == 0) {
                    state = 0;
                    stop();
                } else if (direction != state) {
                    state = direction;
                    start();
                }
            }
        };
    }

    private void callScript(String msg, @Nullable byte[] data, @Nullable int size) {
        MainApplication application = (MainApplication) this.mContext.getApplicationContext();
        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if (reactContext != null) {
            try {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();
                WritableNativeArray params = new WritableNativeArray();
                params.pushString(msg);
                if (data != null) {
                    params.pushArray(byteArrayToBoolReadableArray(data, size));
                    params.pushInt(size);
                }
                catalystInstance.callFunction("JavaScriptVisibleToJava", "getCommand", params);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    public ReadableArray byteArrayToBoolReadableArray(byte[] arr, int size) {
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

    private AudioRecord audioRecord;
    private boolean running;
    private Thread recordingThread;
    private int bufferSize;
    final int SAMPLE_RATE = 16000;
    final int FRAME_SIZE = 160;
    public final int BUF_SIZE = FRAME_SIZE;
    private OpusEncoder opusEncoder;
    final int NUM_CHANNELS = 1;

    public void init() {
        int minBufSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                minBufSize);
        opusEncoder = new OpusEncoder();
        //opusEncoder.init(SAMPLE_RATE, 1, FRAME_SIZE);

        opusEncoder.init(SAMPLE_RATE, NUM_CHANNELS, OpusEncoder.OPUS_APPLICATION_VOIP);
    }

    public void start() {

        int state = audioRecord.getState();
        if (!running && audioRecord != null && state != AudioRecord.STATE_UNINITIALIZED) {
            callScript("start", null, 0);

            running = true;
            audioRecord.startRecording();

            if (recordingThread != null && recordingThread.isAlive()) {
                recordingThread.interrupt();
            }
            recordingThread = new Thread(this::recording, "RecordingThread");
            recordingThread.start();
        }
    }

    public void stop() {
        if (audioRecord != null && audioRecord.getState() != AudioRecord.STATE_UNINITIALIZED) {
            running = false;
            audioRecord.stop();
            if (recordingThread != null && recordingThread.isAlive()) {
                recordingThread.interrupt();
            }
            recordingThread = null;
        }
    }

    private void recording() {
        byte[] inBuf = new byte[FRAME_SIZE * NUM_CHANNELS * 2];
        byte[] encBuf = new byte[1024];
        short[] outBuf = new short[FRAME_SIZE * NUM_CHANNELS];
        while (!Thread.interrupted()) {

            int to_read = inBuf.length;
            int offset = 0;
            while (to_read > 0) {
                int read = audioRecord.read(inBuf, offset, to_read);
                if (read < 0) {
                    throw new RuntimeException("recorder.read() returned error " + read);
                }
                to_read -= read;
                offset += read;
            }

            int encoded = opusEncoder.encode(inBuf, FRAME_SIZE, encBuf);

            try {
                callScript("data", encBuf, encoded);
            } catch (Exception e) {
                e.printStackTrace();
                Log.d("Encoder", "Recorder error --- " + running);
            }
        }
        callScript("stop", null, 0);
    }
}
