import {ApplicationState} from '@store';
import * as LocalStorage from '../store/localStorage';
import {SocketClient} from './SocketClient';
import {WebRtcConnection} from './WebRtcConnection';
import config from '@config';
import RNBeep from 'react-native-a-beep';

export class ExposedToJava {
  constructor() {}
  static socketClient: SocketClient;
  static webRtcConnection: WebRtcConnection;
  static connected: boolean;
  public static close() {
    console.log('Exposed close');
    this.webRtcConnection.close();
    this.socketClient.dispose();
  }
  public static async start(groupId, userId) {
    console.log('Exposed start', groupId, userId);
    if (!this.socketClient) {
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
        );

        this.webRtcConnection.onData = (id, data) => {
          const message = JSON.parse(data.data);
          switch (message.command) {
            case 'start':
              RNBeep.beep();
              break;
            case 'end':
              RNBeep.beep();
              break;
          }
        };
        this.webRtcConnection.onConnectionChange = (status, userId) => {
          switch (status) {
            case 'connected':
              break;
            case 'disconnected':
              break;
          }
        };
      }
      await this.webRtcConnection.connect();
    }
  }

  async getCommand(msg) {
    if (msg != 'timer') console.log(msg);
  }
}
