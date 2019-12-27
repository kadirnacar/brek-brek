
package com.brekbrek;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class PushTalkModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private AudioRecord audioRecord;
    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;
    private boolean running;
    private int bufferSize;
    private Thread recordingThread;

  PushTalkModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

   @Override
  public String getName() {
    return "pushtalk";
  }

  @ReactMethod
    public void init(ReadableMap options) {
        if (eventEmitter == null) {
            eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        Toast.makeText(getReactApplicationContext(), "audioRecord", Toast.LENGTH_SHORT).show();

        if (running || (recordingThread != null && recordingThread.isAlive())) {
            return;
        }

        if (audioRecord != null && audioRecord.getState() != AudioRecord.STATE_UNINITIALIZED) {
            audioRecord.stop();
            audioRecord.release();
        }

        // for parameter description, see
        // https://developer.android.com/reference/android/media/AudioRecord.html

        int sampleRateInHz = 44100;
        if (options.hasKey("sampleRate")) {
            sampleRateInHz = options.getInt("sampleRate");
        }

        int channelConfig = AudioFormat.CHANNEL_IN_MONO;
        if (options.hasKey("channelsPerFrame")) {
            int channelsPerFrame = options.getInt("channelsPerFrame");

            // every other case --> CHANNEL_IN_MONO
            if (channelsPerFrame == 2) {
                channelConfig = AudioFormat.CHANNEL_IN_STEREO;
            }
        }

        // we support only 8-bit and 16-bit PCM
        int audioFormat = AudioFormat.ENCODING_PCM_16BIT;
        if (options.hasKey("bitsPerChannel")) {
            int bitsPerChannel = options.getInt("bitsPerChannel");

            if (bitsPerChannel == 8) {
                audioFormat = AudioFormat.ENCODING_PCM_8BIT;
            }
        }

        if (options.hasKey("bufferSize")) {
            this.bufferSize = options.getInt("bufferSize");
        } else {
            this.bufferSize = 8192;
        }

        audioRecord = new AudioRecord(
                MediaRecorder.AudioSource.VOICE_COMMUNICATION,
                sampleRateInHz,
                channelConfig,
                audioFormat,
                this.bufferSize * 2);

        recordingThread = new Thread(new Runnable() {
            public void run() {
                recording();
            }
        }, "RecordingThread");
    }

    @ReactMethod
    public void start() {
        if (!running && audioRecord != null && audioRecord.getState() != AudioRecord.STATE_UNINITIALIZED && recordingThread != null) {
        Toast.makeText(getReactApplicationContext(), "start", Toast.LENGTH_SHORT).show();
            running = true;
            audioRecord.startRecording();
            recordingThread.start();
        }
    }

    @ReactMethod
    public void pause() {
        if (audioRecord != null && audioRecord.getState() == AudioRecord.RECORDSTATE_RECORDING) {
            running = false;
            audioRecord.stop();
        }
    }

    @ReactMethod
    public void stop() {
        if (audioRecord != null && audioRecord.getState() != AudioRecord.STATE_UNINITIALIZED) {
            running = false;
            audioRecord.stop();
            audioRecord.release();
            audioRecord = null;
        }
    }

    private void recording() {
        short buffer[] = new short[bufferSize];
        byte encoded[] = new byte[bufferSize];
        G711UCodec codec = new G711UCodec();
            Toast.makeText(getReactApplicationContext(), "recording", Toast.LENGTH_SHORT).show();

        while (running && !reactContext.getCatalystInstance().isDestroyed()) {
            WritableArray data = Arguments.createArray();
            audioRecord.read(buffer, 0, bufferSize);
            codec.encode(buffer, bufferSize, encoded, 0);
            for (byte value : encoded) {
                data.pushInt((int) value);
            }
            Toast.makeText(getReactApplicationContext(), "recording", Toast.LENGTH_SHORT).show();
            eventEmitter.emit("audioData", data);
        }
    }
}