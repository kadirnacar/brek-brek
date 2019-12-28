
package com.brekbrek;

import android.util.JsonWriter;
import android.widget.Toast;

import com.facebook.react.bridge.JsonWriterHelper;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import java.util.zip.Deflater;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;

import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.WritableNativeArray;

import org.json.JSONException;
import org.json.JSONObject;

import static android.Manifest.permission.RECORD_AUDIO;

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

    private void callScript(WritableNativeArray params) {
        if (reactContext != null) {
            try {
                CatalystInstance catalystInstance = reactContext.getCatalystInstance();

                catalystInstance.callFunction("JavaScriptVisibleToJava", "checkLocation", params);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    @ReactMethod
    public void init(ReadableMap options) {
        if (eventEmitter == null) {
            eventEmitter = reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        WritableNativeArray params = new WritableNativeArray();

        params.pushBoolean(running);
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
        callScript(params);

        recordingThread = new Thread(new Runnable() {
            public void run() {
                recording();
            }
        }, "RecordingThread");
    }

    @ReactMethod
    public void start() {
        int state = audioRecord.getState();
        if (!running && audioRecord != null && state != AudioRecord.STATE_UNINITIALIZED && recordingThread != null) {
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

    private void recording()  {
        short buffer[] = new short[bufferSize];
        byte encoded[] = new byte[bufferSize];
        G711UCodec codec = new G711UCodec();


        while (running && !reactContext.getCatalystInstance().isDestroyed()) {
            WritableArray dataBuffer = Arguments.createArray();
            WritableArray dataCodec = Arguments.createArray();
            WritableArray dataCodecCompress = Arguments.createArray();
            WritableMap info = new WritableNativeMap();

            audioRecord.read(buffer, 0, bufferSize);
            codec.encode(buffer, bufferSize, encoded, 0);
            for (short value : buffer) {
                dataBuffer.pushInt((int) value);
            }
            for (byte value : encoded) {
                dataCodec.pushInt((byte) value);
            }
            try {
                for (byte value : compress(encoded)) {
                    dataCodecCompress.pushInt((byte) value);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            try {

                info.putArray("buffer", dataBuffer);
                info.putArray("codec", dataCodec);
                info.putArray("compressCodec", dataCodecCompress);
            } catch (Exception e) {
                e.printStackTrace();
            }
            eventEmitter.emit("audioData", info);
        }
    }


    public static byte[] compress(byte[] data) throws IOException {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        deflater.finish();
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer); // returns the generated code... index
            outputStream.write(buffer, 0, count);
        }
        outputStream.close();
        byte[] output = outputStream.toByteArray();

        return output;
    }
}