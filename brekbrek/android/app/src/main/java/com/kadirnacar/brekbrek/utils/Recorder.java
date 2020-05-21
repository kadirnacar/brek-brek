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

public class Recorder {
    private static AudioRecord audioRecord;
    private static Thread recordingThread;
    private static final int SAMPLE_RATE = 24000;
    private static int FRAME_SIZE = 2400;
    private static OpusEncoder opusEncoder;
    private static final int NUM_CHANNELS = 1;
    private static boolean isRecording;
    private static int minBufSize;
    private static Pair<Integer, byte[]> pair;
    private static AbstractMap.SimpleEntry<Integer, byte[]> sEntry;
    //private static SpeexEncoder speexEncoder;

    public static void init() {
        isRecording = false;
        minBufSize = AudioRecord.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT);
        opusEncoder = new OpusEncoder();

        opusEncoder.init(SAMPLE_RATE, NUM_CHANNELS, OpusEncoder.OPUS_APPLICATION_AUDIO);
        //speexEncoder = new SpeexEncoder(FrequencyBand.ULTRA_WIDE_BAND, 10);
        //FRAME_SIZE = speexEncoder.getFrameSize();
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)
    public static void start() {

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
        audioRecord.startRecording();

        if (recordingThread != null && recordingThread.isAlive()) {
            recordingThread.interrupt();
        }
        recordingThread = new Thread(Recorder::recording, "RecordingThread");
        recordingThread.start();
        isRecording = true;
    }

    public static void stop() {

        if (recordingThread != null && recordingThread.isAlive()) {
            recordingThread.interrupt();
        }
        if (audioRecord != null) {
            audioRecord.stop();
            audioRecord.release();
            audioRecord = null;
        }
        recordingThread = null;
        isRecording = false;
    }

    private static void recording() {
        byte[] inBuf = new byte[FRAME_SIZE * NUM_CHANNELS * 2];
        //short[] inBuf = new short[FRAME_SIZE];
        byte[] encBuf = new byte[2048];
        sEntry = new AbstractMap.SimpleEntry<Integer, byte[]>(1, new byte[10]);

        while (isRecording) {

            int to_read = inBuf.length;
            int offset = 0;
            while (to_read > 0 && !Thread.interrupted() && audioRecord != null) {
                int read = audioRecord.read(inBuf, offset, to_read);
                if (read < 0) {
                    ChannelModule.callScript("recorder.read() returned error " + read, null, 0);
                    break;
                }
                to_read -= read;
                offset += read;
            }
            int encoded = opusEncoder.encode(inBuf, FRAME_SIZE, encBuf);
            ChannelModule.callScript("data : " + String.valueOf(inBuf.length) + " - Enc : " + String.valueOf(encoded), null, 0);
            //encBuf = speexEncoder.encode(inBuf);
            try {
                if (encoded > 0) {
                    ChannelModule.callScript("data", encBuf, encoded);
                }
            } catch (Exception e) {
                e.printStackTrace();
                ChannelModule.callScript(e.getMessage(), null, 0);
            }
        }
    }
}