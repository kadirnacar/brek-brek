package com.bengsoft.brekbrek.utils;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.util.Log;

import com.bengsoft.brekbrek.NativeModules.ChannelModule;

import java.util.ArrayList;
import java.util.List;

public class Player {
    private static AudioTrack audioTrack;
    private static boolean playing;
    private static Thread playingThread;
    private static int bufferSize;
    private static final int SAMPLE_RATE = 16000;
    private static final int FRAME_SIZE = 160;
    private static final int BUF_SIZE = FRAME_SIZE;
    private static OpusDecoder opusDecoder;
    private static final int NUM_CHANNELS = 1;

    public static void init() {
        int minBufSize = AudioTrack.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT);
        audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC,
                SAMPLE_RATE,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                minBufSize,
                AudioTrack.MODE_STREAM);
        opusDecoder = new OpusDecoder();

        opusDecoder.init(SAMPLE_RATE, NUM_CHANNELS);
    }

    public static void start() {

        int state = audioTrack.getState();
        if (!playing && audioTrack != null && state != AudioTrack.STATE_UNINITIALIZED) {
            ChannelModule.callScript("start play", null, 0);

            playing = true;
            audioTrack.play();

            if (playingThread != null && playingThread.isAlive()) {
                playingThread.interrupt();
            }
            playingThread = new Thread(Player::playing, "PlayingThread");
            playingThread.start();
        }
    }

    public static void stop() {
        if (audioTrack != null && audioTrack.getState() != AudioTrack.STATE_UNINITIALIZED) {
            playing = false;
            audioTrack.stop();
            if (playingThread != null && playingThread.isAlive()) {
                playingThread.interrupt();
            }
            playingThread = null;
        }
        destination = null;
    }

    static List<byte[]> destination;

    public static void stream(byte[] array) {
        if (destination == null) {
            destination = new ArrayList<>();
        }
        destination.add(array);
    }

    private static void playing() {
        byte[] inBuf = new byte[FRAME_SIZE * NUM_CHANNELS * 2];
        byte[] encBuf = new byte[1024];
        short[] outBuf = new short[FRAME_SIZE * NUM_CHANNELS];
        int i = 0;
        while (playing && !Thread.interrupted()) {
            if (destination != null) {
                Log.d("destination.size()", String.valueOf(destination.size()));

                if (destination.size() > i) {
                    byte[] data = destination.get(i);
                    int decoded = opusDecoder.decode(data, outBuf, FRAME_SIZE);
                    //Log.d("decoded", String.valueOf(decoded));
                    Log.d("data", String.valueOf(data.length));

                    audioTrack.write(outBuf, 0, outBuf.length);
                    i++;
                }
            }
            //int decoded = opusDecoder.decode(encBuf, outBuf, FRAME_SIZE);

            //audioTrack.write(outBuf, 0, decoded * NUM_CHANNELS);
        }
        ChannelModule.callScript("stop playing", null, 0);
    }

}