import config from '@config';
import {generateKey, log} from '@utils';
import {NativeModules} from 'react-native';
import RNBeep from 'react-native-a-beep';
import {SocketClient} from './SocketClient';
import {WebRtcConnection} from './WebRtcConnection';
const ChannelModule = NativeModules.ChannelModule;

export class ExposedToJava {
  constructor() {}
  static socketClient: SocketClient;
  static webRtcConnection: WebRtcConnection;
  static connected: boolean;
  static currentGroup;
  static currentUser;
  static isBusy: boolean;
  public static hasCall: boolean;
  static key;
  static currentSpeaker;
  static hasSpeaker = false;

  public static onPeerConnectionChange: (
    status: 'connected' | 'disconnected',
    userId: string,
  ) => void;
  public static onData: (userId, data) => void;

  public static close() {
    ChannelModule.stopService();

    if (this.webRtcConnection) {
      this.webRtcConnection.close();
      this.webRtcConnection = null;
    }
    if (this.socketClient) {
      this.socketClient.dispose();
    }
    this.connected = false;
  }
  private static async initWebRtc(groupId, userId, userName?) {
    this.webRtcConnection = new WebRtcConnection(
      this.socketClient,
      groupId,
      userId,
      null,
      userName,
    );

    this.webRtcConnection.onData = async (id, data) => {
      const message = JSON.parse(data.data);
      if (this.onData) {
        this.onData(id, message);
      }
      switch (message.command) {
        case 'start':
          if (!this.hasCall) {
            this.currentSpeaker = id;
            this.isBusy = true;
            await ChannelModule.stopPlay();
            await ChannelModule.startPlay();
            RNBeep.beep();
          }
          break;
        case 'end':
          console.log('data', this.isBusy);
          this.currentSpeaker = null;
          this.isBusy = false;
          await ChannelModule.stopPlay();
          RNBeep.beep();
          break;
        case 'data':
          //this.currentSpeaker = id;
          if (this.currentSpeaker) {
            ChannelModule.stream(message.data);
          } else if (!this.isBusy) {
            if (this.onData) {
              this.onData(id, {command: 'start'});
            }
            await ChannelModule.stopPlay();
            await ChannelModule.startPlay();
            this.currentSpeaker = id;
          }
          break;
      }
    };
    this.webRtcConnection.onConnectionChange = async (status, peerId) => {
      if (status == 'disconnected' && this.webRtcConnection) {
        this.webRtcConnection.leave(peerId, false);
      }
      if (this.onPeerConnectionChange) {
        this.onPeerConnectionChange(status, peerId);
      }
      if (peerId == this.currentSpeaker) {
        if (this.onData) {
          this.onData(peerId, {command: 'end'});
        }
        await ChannelModule.stopPlay();
      }
    };
  }
  public static async start(groupId, userId, userName?) {
    this.key = await generateKey(config.securityKey, 'salt', 5000, 256);
    this.isBusy = false;
    this.currentSpeaker = null;
    await ChannelModule.startService();
    this.socketClient = new SocketClient(config.wsUrl, {
      Id: groupId,
    });
    const result = await this.socketClient.connect();
    this.connected = true;
    this.socketClient.onConnected = async (state) => {
      if (!this.webRtcConnection) {
        await this.initWebRtc(groupId, userId, userName);
      }
      await this.webRtcConnection.connect();
      this.isBusy = false;
      this.currentSpeaker = null;

      this.connected = true;
    };
    this.socketClient.onErrorEvent = async (e) => {
      if (this.webRtcConnection) {
        this.webRtcConnection.close();
      }
      await ChannelModule.stopRecord();
      await ChannelModule.stopPlay();
      this.isBusy = false;
      this.currentSpeaker = null;

      this.connected = false;
    };
    this.socketClient.onCloseEvent = async () => {
      if (this.webRtcConnection) {
        this.webRtcConnection.close();
      }
      await ChannelModule.stopRecord();
      await ChannelModule.stopPlay();
      this.isBusy = false;
      this.currentSpeaker = null;

      this.connected = false;
    };
    if (result == WebSocket.OPEN || !this.webRtcConnection) {
      await this.initWebRtc(groupId, userId, userName);
    }
    await this.webRtcConnection.connect();
  }

  public static async startVoice() {
    if (!this.isBusy) {
      // InCallManager.setMicrophoneMute(false)
      await this.webRtcConnection.sendData({command: 'start'});
      await ChannelModule.startRecord();
      RNBeep.beep();
    }
  }

  public static async stopVoice() {
    if (!this.isBusy) {
      await this.webRtcConnection.sendData({command: 'end'});
      await ChannelModule.stopRecord();
      RNBeep.beep();
    }
  }

  async getCommand(msg, data, size) {
    if (msg == 'start') {
      // await ExposedToJava.startVoice();
      await ExposedToJava.startVoice();
    } else if (msg == 'stop') {
      // await ExposedToJava.stopVoice();
      await ExposedToJava.stopVoice();
    } else if (msg == 'data') {
      await ExposedToJava.webRtcConnection.sendData({
        command: 'data',
        data: data,
      });
    } else {
      console.log(msg);
      log.info(msg);
    }
  }
}
