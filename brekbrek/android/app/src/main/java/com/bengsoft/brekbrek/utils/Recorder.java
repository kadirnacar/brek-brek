package com.bengsoft.brekbrek.utils;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.util.Log;

import com.bengsoft.brekbrek.NativeModules.ChannelModule;

public class Recorder {
    private static AudioRecord audioRecord;
    private static boolean running;
    private static Thread recordingThread;
    private static int bufferSize;
    private static final int SAMPLE_RATE = 16000;
    private static final int FRAME_SIZE = 160;
    private static final int BUF_SIZE = FRAME_SIZE;
    private static OpusEncoder opusEncoder;
    private static final int NUM_CHANNELS = 1;

    public static void init() {
        int minBufSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC,
                SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                minBufSize);
        opusEncoder = new OpusEncoder();

        opusEncoder.init(SAMPLE_RATE, NUM_CHANNELS, OpusEncoder.OPUS_APPLICATION_VOIP);
    }

    public static void start() {

        int state = audioRecord.getState();
        if (!running && audioRecord != null && state != AudioRecord.STATE_UNINITIALIZED) {
            ChannelModule.callScript("start", null, 0);

            running = true;
            audioRecord.startRecording();

            if (recordingThread != null && recordingThread.isAlive()) {
                recordingThread.interrupt();
            }
            recordingThread = new Thread(Recorder::recording, "RecordingThread");
            recordingThread.start();
        }
    }

    public static void stop() {
        if (audioRecord != null && audioRecord.getState() != AudioRecord.STATE_UNINITIALIZED) {
            running = false;
            audioRecord.stop();
            if (recordingThread != null && recordingThread.isAlive()) {
                recordingThread.interrupt();
            }
            recordingThread = null;
        }
    }

    private static void recording() {
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
                ChannelModule.callScript("data", encBuf, encBuf.length);
            } catch (Exception e) {
                e.printStackTrace();
                Log.d("Encoder", "Recorder error --- " + running);
            }
        }
        ChannelModule.callScript("stop", null, 0);
    }
}