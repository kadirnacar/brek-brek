package com.kadirnacar.brekbrek.utils;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

import com.kadirnacar.brekbrek.NativeModules.ChannelModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class Player {
    private static AudioTrack audioTrack;
    private static Thread playingThread;
    private static final int SAMPLE_RATE = 16000;
    private static final int FRAME_SIZE = 160;
    private static OpusDecoder opusDecoder;
    private static final int NUM_CHANNELS = 1;
    private static int minBufSize;
    private static boolean isPlaying;
    //private static SpeexDecoder speexDecoder;

    public static void init() {
        isPlaying = false;
        minBufSize = AudioTrack.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT);

        audioTrack = new AudioTrack(AudioManager.STREAM_MUSIC, SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT, minBufSize, AudioTrack.MODE_STREAM);

        destination = new ArrayList<>();
        opusDecoder = new OpusDecoder();
        opusDecoder.init(SAMPLE_RATE, NUM_CHANNELS);
    }

    public static void start() {
        if (audioTrack != null && audioTrack.getPlayState() == AudioTrack.STATE_INITIALIZED) {
            audioTrack.play();
        }
        playingThread = new Thread(Player::playing, "PlayingThread");
        playingThread.start();
        isPlaying = true;
    }

    public static void stop() {
        isPlaying = false;
        if (destination != null) {
            destination.clear();
        }
        if (audioTrack != null) {
            audioTrack.stop();
        }
        if (playingThread != null) {
            playingThread.interrupt();
        }
        playingThread = null;
    }

    static List<byte[]> destination;

    public static void stream(byte[] array) {
        if (destination == null) {
            destination = new ArrayList<>();
        }
        destination.add(array);
    }

    private static void playing() {
        int i = 0;
        while (isPlaying && audioTrack != null && audioTrack.getPlayState() == AudioTrack.PLAYSTATE_PLAYING) {
            if (destination != null) {
                if (destination.size() > i) {
                    byte[] data = destination.get(i);
                    if (data != null && data.length > 0) {
                        try {
                            short[] outBuf = new short[FRAME_SIZE * NUM_CHANNELS];
                            int decoded = opusDecoder.decode(data, outBuf, FRAME_SIZE);
                            if (decoded > 0) {
                                audioTrack.write(outBuf, 0, decoded);
                            }
                        } catch (Exception ex) {

                        }
                    }
                    i++;
                } else {
                    try {
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

}