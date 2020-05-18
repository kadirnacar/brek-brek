import config from '@config';
import { NativeModules } from 'react-native';
import RNBeep from 'react-native-a-beep';
import { SocketClient } from './SocketClient';
import { WebRtcConnection } from './WebRtcConnection';
const ChannelModule = NativeModules.ChannelModule;

export class ExposedToJava {
  constructor() {}
  static socketClient: SocketClient;
  static webRtcConnection: WebRtcConnection;
  static connected: boolean;
  static currentGroup;
  static currentUser;
  static isBusy: boolean;

  public static onPeerConnectionChange: (
    status: 'connected' | 'disconnected',
    userId: string,
  ) => void;
  public static onData: (userId, data) => void;

  public static close() {
    ChannelModule.stopService();

    this.webRtcConnection.close();
    this.socketClient.dispose();
    this.connected = false;
  }

  public static async start(groupId, userId,userName?) {
    ChannelModule.startService();
    this.socketClient = new SocketClient(config.wsUrl, {
      Id: groupId,
    });
    const result = await this.socketClient.connect();
    this.connected = true;
    this.socketClient.onConnected = async (state) => {
      if (!this.connected) {
        await this.webRtcConnection.connect();
      }
      this.connected = true;
    };
    this.socketClient.onErrorEvent = (e) => {
      this.webRtcConnection.close();
      this.connected = false;
    };
    if (result == WebSocket.OPEN) {
      this.webRtcConnection = new WebRtcConnection(
        this.socketClient,
        groupId,
        userId,
        null,
        userName
      );

      this.webRtcConnection.onData = (id, data) => {
        const message = JSON.parse(data.data);
        if (this.onData) {
          this.onData(id, message);
        }
        switch (message.command) {
          case 'start':
            this.isBusy = true;
            ChannelModule.startPlay()
            RNBeep.beep();
            break;
          case 'end':
            this.isBusy = false;
            ChannelModule.stopPlay()
            RNBeep.beep();
            break;
          case 'data':
            // console.log(message.data)
            ChannelModule.stream(message.data)
            break;
        }
      };
      this.webRtcConnection.onConnectionChange = (status, peerId) => {
        if (this.onPeerConnectionChange) {
          this.onPeerConnectionChange(status, peerId);
        }
      };
    }
    await this.webRtcConnection.connect();
  }

  public static async startVoice() {
    if (!this.isBusy) {
      RNBeep.beep();
      // InCallManager.setMicrophoneMute(false)
      await this.webRtcConnection.sendData({command: 'start'});
    }
  }

  public static async stopVoice() {
    if (!this.isBusy) {
      RNBeep.beep();
      // InCallManager.setMicrophoneMute(true)
      await this.webRtcConnection.sendData({command: 'end'});
    }
  }

  async getCommand(msg, data, size) {
    if (msg == 'start') {
      await ExposedToJava.startVoice();
    } else if (msg == 'stop') {
      await ExposedToJava.stopVoice();
    } else if (msg == 'data') {
      // console.log(data);
      await ExposedToJava.webRtcConnection.sendData({command: 'data', data});
    } else {
      console.log(msg);
    }
  }
}
