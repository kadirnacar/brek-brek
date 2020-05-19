package com.bengsoft.brekbrek.utils;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

import com.bengsoft.brekbrek.NativeModules.ChannelModule;

import java.util.ArrayList;
import java.util.List;

public class Player {
    private static AudioTrack audioTrack;
    private static Thread playingThread;
    private static int bufferSize;
    private static final int SAMPLE_RATE = 16000;
    private static final int FRAME_SIZE = 1600;
    private static final int BUF_SIZE = FRAME_SIZE;
    private static OpusDecoder opusDecoder;
    private static final int NUM_CHANNELS = 1;
    private static int minBufSize;
    private static boolean isPlaying;

    public static void init() {
        isPlaying = false;
        minBufSize = AudioTrack.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT);
//        audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO,
//                AudioFormat.ENCODING_PCM_16BIT, minBufSize, AudioTrack.MODE_STREAM);
        opusDecoder = new OpusDecoder();

        opusDecoder.init(SAMPLE_RATE, NUM_CHANNELS);
    }

    public static void start() {
        isPlaying = true;

        audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT, minBufSize, AudioTrack.MODE_STREAM);
        destination = new ArrayList<>();
        ChannelModule.callScript("start play", null, 0);
        audioTrack.play();

        if (playingThread != null && playingThread.isAlive()) {
            playingThread.interrupt();
        }
        playingThread = new Thread(Player::playing, "PlayingThread");
        playingThread.start();
    }

    public static void stop() {
        isPlaying = false;

        if (playingThread != null && playingThread.isAlive()) {
            playingThread.interrupt();
        }
        audioTrack.pause();
        audioTrack.flush();
        audioTrack.release();

        audioTrack = null;
        playingThread = null;
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
        short[] outBuf;
        int i = 0;
        while (isPlaying) {
            if (destination != null) {

                if (destination.size() > i) {
                    byte[] data = destination.get(i);
                    if (data != null && data.length > 0) {
                        outBuf = new short[FRAME_SIZE * NUM_CHANNELS];
                        int decoded = opusDecoder.decode(data, outBuf, FRAME_SIZE);
                        audioTrack.write(outBuf, 0, decoded);
                    }
                    i++;
                }
            }
        }
    }

}