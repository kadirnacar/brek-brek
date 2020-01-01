
package com.brekbrek;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.brekbrek.androidlame.AndroidLame;
import com.brekbrek.androidlame.LameBuilder;

import org.java_websocket.WebSocket;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.enums.ReadyState;
import org.java_websocket.handshake.ServerHandshake;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;


public class PushTalkModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private AudioRecord audioRecord;
    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;
    private boolean running;
    private int bufferSize;
    private int inSamplerate;
    private int channelConfig;
    private int audioFormat;
    private Thread recordingThread;
    private AndroidLame androidLame;
    private WebSocketClient mWebSocketClient;
    private URI uri;

    PushTalkModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    private void connectSocket() {
        mWebSocketClient = new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake handshakedata) {
                mWebSocketClient.send("Connect");
            }


            @Override
            public void onMessage(String s) {
                final String message = s;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {

                    }
                });
            }

            @Override
            public void onClose(int i, String s, boolean b) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                mWebSocketClient.reconnect();
            }

            @Override
            public void onError(Exception e) {
                e.printStackTrace();
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                mWebSocketClient = null;
                connectSocket();
            }
        };

        mWebSocketClient.connect();
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
        if (running || (recordingThread != null && recordingThread.isAlive())) {
            return;
        }

        if (audioRecord != null && audioRecord.getState() != AudioRecord.STATE_UNINITIALIZED) {
            audioRecord.stop();
            audioRecord.release();
        }

        String wsUrl = "ws://192.168.42.253:3001";

        if (options.hasKey("wsUrl")) {
            wsUrl = options.getString("wsUrl");
        }

        try {
            uri = new URI(wsUrl);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }

        connectSocket();

        inSamplerate = 44100;
        channelConfig = AudioFormat.CHANNEL_IN_MONO;
        audioFormat = AudioFormat.ENCODING_PCM_16BIT;
        bufferSize = AudioRecord.getMinBufferSize(inSamplerate, channelConfig, audioFormat);

        audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, inSamplerate, channelConfig,
                audioFormat, this.bufferSize * 2);

        androidLame = new LameBuilder()
                .setInSampleRate(inSamplerate)
                .setOutChannels(1)
                .setOutBitrate(32)
                .setOutSampleRate(inSamplerate)
                .build();
    }

    @ReactMethod
    public void start() {
        int state = audioRecord.getState();
        if (!running && audioRecord != null && state != AudioRecord.STATE_UNINITIALIZED) {
            running = true;
            audioRecord.startRecording();
            ReadyState socketState = mWebSocketClient.getReadyState();
            if (socketState == ReadyState.OPEN) {
                mWebSocketClient.send("start");
            }
            if (recordingThread != null && recordingThread.isAlive()) {
                recordingThread.interrupt();
            }
            recordingThread = new Thread(this::recording, "RecordingThread");
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
            if (recordingThread != null && recordingThread.isAlive()) {
                recordingThread.interrupt();
            }
            recordingThread = null;
            ReadyState socketState = mWebSocketClient.getReadyState();
            if (socketState == ReadyState.OPEN) {
                mWebSocketClient.send("stop");
            }
//            audioRecord.release();
//            audioRecord = null;
//            androidLame.close();
//            androidLame = null;
        }
    }

    private void recording() {
        short buffer[] = new short[bufferSize];
        byte[] mp3buffer = new byte[(int) (7200 + (buffer.length * 1.25))];
        int bytesRead = 0;
        ByteArrayOutputStream out;
        while (running && !reactContext.getCatalystInstance().isDestroyed()) {
            out = new ByteArrayOutputStream();

            bytesRead = audioRecord.read(buffer, 0, bufferSize);

            if (bytesRead > 0) {
                int bytesEncoded = androidLame.encode(buffer, buffer, bytesRead, mp3buffer);
                if (bytesEncoded > 0) {
                    out.write(mp3buffer, 0, bytesEncoded);
                }
            }

            ReadyState socketState = mWebSocketClient.getReadyState();
            if (socketState == ReadyState.OPEN) {
                mWebSocketClient.send(out.toByteArray());
            }

            try {
                out.close();
                out = null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}