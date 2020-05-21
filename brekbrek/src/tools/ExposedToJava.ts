import config from '@config';
import {NativeModules} from 'react-native';
import RNBeep from 'react-native-a-beep';
import {SocketClient} from './SocketClient';
import {WebRtcConnection} from './WebRtcConnection';
import {log, encryptData, generateKey, decryptData} from '@utils';
const ChannelModule = NativeModules.ChannelModule;

export class ExposedToJava {
  constructor() {}
  static socketClient: SocketClient;
  static webRtcConnection: WebRtcConnection;
  static connected: boolean;
  static currentGroup;
  static currentUser;
  static isBusy: boolean;
  static key;

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
  private static initWebRtc(groupId, userId, userName?) {
    this.webRtcConnection = new WebRtcConnection(
      this.socketClient,
      groupId,
      userId,
      null,
      userName,
    );

    this.webRtcConnection.onData = async (id, data) => {
      const message = JSON.parse(data.data);
      console.log(message)
      if (this.onData) {
        this.onData(id, message);
      }
      switch (message.command) {
        case 'start':
          this.isBusy = true;
          ChannelModule.startPlay();
          RNBeep.beep();
          break;
        case 'end':
          this.isBusy = false;
          ChannelModule.stopPlay();
          RNBeep.beep();
          break;
        case 'data':
          ChannelModule.stream(message.data);
          break;
      }
    };
    this.webRtcConnection.onConnectionChange = (status, peerId) => {
      if (this.onPeerConnectionChange) {
        this.onPeerConnectionChange(status, peerId);
      }
    };
  }
  public static async start(groupId, userId, userName?) {
    this.key = await generateKey(config.securityKey, 'salt', 5000, 256);

    ChannelModule.startService();
    this.socketClient = new SocketClient(config.wsUrl, {
      Id: groupId,
    });
    const result = await this.socketClient.connect();
    this.connected = true;
    this.socketClient.onConnected = async (state) => {
      if (!this.webRtcConnection) {
        this.initWebRtc(groupId, userId, userName);
      }
      await this.webRtcConnection.connect();

      this.connected = true;
    };
    this.socketClient.onErrorEvent = (e) => {
      if (this.webRtcConnection) {
        this.webRtcConnection.close();
      }
      this.connected = false;
    };
    this.socketClient.onCloseEvent = () => {
      if (this.webRtcConnection) {
        this.webRtcConnection.close();
      }
      this.connected = false;
    };
    if (result == WebSocket.OPEN || !this.webRtcConnection) {
      this.initWebRtc(groupId, userId, userName);
    }
    await this.webRtcConnection.connect();
  }

  public static async startVoice() {
    if (!this.isBusy) {
      // InCallManager.setMicrophoneMute(false)
      await this.webRtcConnection.sendData({command: 'start'});
      ChannelModule.startRecord();
      RNBeep.beep();
    }
  }

  public static async stopVoice() {
    if (!this.isBusy) {
      await this.webRtcConnection.sendData({command: 'end'});
      ChannelModule.stopRecord();
      RNBeep.beep();
    }
  }

  async getCommand(msg, data, size) {
    if (msg == 'start') {
      // await ExposedToJava.startVoice();
      ExposedToJava.startVoice();
    } else if (msg == 'stop') {
      // await ExposedToJava.stopVoice();
      ExposedToJava.stopVoice();
    } else if (msg == 'data') {
      // console.log(size);
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
