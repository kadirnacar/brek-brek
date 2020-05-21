package com.kadirnacar.brekbrek.utils;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.media.audiofx.AcousticEchoCanceler;
import android.media.audiofx.NoiseSuppressor;
import android.os.Build;

import androidx.annotation.RequiresApi;
import androidx.core.util.Pair;

import com.kadirnacar.brekbrek.NativeModules.ChannelModule;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;

public class Recorder {
    private static AudioRecord audioRecord;
    private static Thread recordingThread;
    private static Thread encodingThread;
    private static final int SAMPLE_RATE = 16000;
    private static int FRAME_SIZE = 160;
    private static OpusEncoder opusEncoder;
    private static final int NUM_CHANNELS = 1;
    private static boolean isRecording;
    private static int minBufSize;

    public static void init() {
        isRecording = false;
        minBufSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT);

        audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT, minBufSize);

        NoiseSuppressor ns;
        AcousticEchoCanceler aec;

        if (NoiseSuppressor.isAvailable()) {
            ns = NoiseSuppressor.create(audioRecord.getAudioSessionId());
            if (ns != null) {
                ns.setEnabled(true);
            }
        }

        if (AcousticEchoCanceler.isAvailable()) {
            aec = AcousticEchoCanceler.create(audioRecord.getAudioSessionId());
            if (aec != null) {
                aec.setEnabled(true);
            }
        }

        opusEncoder = new OpusEncoder();
        opusEncoder.init(SAMPLE_RATE, NUM_CHANNELS, OpusEncoder.OPUS_APPLICATION_AUDIO);
    }

    public static void start() {
        audioRecord.startRecording();
        recordingThread = new Thread(Recorder::recording, "RecordingThread");
        recordingThread.start();
        isRecording = true;
    }

    public static void stop() {
        if (audioRecord != null) {
            audioRecord.stop();
        }
        if (recordingThread != null) {
            recordingThread.interrupt();
        }
        recordingThread = null;
        isRecording = false;
    }

    private static void recording() {
        byte[] inBuf = new byte[FRAME_SIZE * NUM_CHANNELS * 2];
        byte[] encBuf = new byte[FRAME_SIZE * 2];

        while (isRecording) {

            int to_read = inBuf.length;
            int offset = 0;
            while (isRecording && to_read > 0 && audioRecord != null) {
                int read = audioRecord.read(inBuf, offset, to_read);
                if (read < 0) {
                    ChannelModule.callScript("recorder.read() returned error " + read, null, 0);
                    break;
                }
                to_read -= read;
                offset += read;
            }

            if (isRecording) {
                try {
                    int encoded = opusEncoder.encode(inBuf, FRAME_SIZE, encBuf);
                    if (encoded > 0) {
                        ChannelModule.callScript("data", encBuf, encoded);
                    }
                } catch (Exception ex) {

                }
            }
        }
    }
}