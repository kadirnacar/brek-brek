package com.kadirnacar.brekbrek.utils;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;

import com.kadirnacar.brekbrek.NativeModules.ChannelModule;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class Player {
    private static AudioTrack audioTrack;
    private static Thread playingThread;
    private static final int SAMPLE_RATE = 24000;
    private static final int FRAME_SIZE = 2400;
    private static OpusDecoder opusDecoder;
    private static final int NUM_CHANNELS = 1;
    private static int minBufSize;
    private static boolean isPlaying;
    //private static SpeexDecoder speexDecoder;

    public static void init() {
        isPlaying = false;
        minBufSize = AudioTrack.getMinBufferSize(SAMPLE_RATE, AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT);
        opusDecoder = new OpusDecoder();

        opusDecoder.init(SAMPLE_RATE, NUM_CHANNELS);
        //speexDecoder=new SpeexDecoder(FrequencyBand.ULTRA_WIDE_BAND);
    }

    public static void start() {
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
        isPlaying = true;
    }

    public static void stop() {
        if (playingThread != null && playingThread.isAlive()) {
            playingThread.interrupt();
        }
        if (audioTrack != null) {
            audioTrack.pause();
            audioTrack.flush();
            audioTrack.release();
            audioTrack = null;
        }
        playingThread = null;
        destination = null;
        isPlaying = false;
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
        try {
            TimeUnit.MILLISECONDS.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        while (isPlaying && audioTrack != null && audioTrack.getPlayState() == AudioTrack.PLAYSTATE_PLAYING) {
            if (destination != null) {

                if (destination.size() > i) {
                    byte[] data = destination.get(i);
                    if (data != null && data.length > 0) {
                        outBuf = new short[FRAME_SIZE * NUM_CHANNELS];
                        int decoded = opusDecoder.decode(data, outBuf, FRAME_SIZE);
                        //outBuf= speexDecoder.decode(data);
                        if (decoded > 0) {
                            audioTrack.write(outBuf, 0, decoded);
                        }
                    }
                    i++;
                }
            }
        }
    }

}