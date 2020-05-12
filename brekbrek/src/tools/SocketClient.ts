import {LocalStorage} from '../store';

export class SocketClient {
  constructor(url: string, options?: any) {
    this.url = url;
    this.options = options;
  }
  private url: string;
  private options: any;
  private socket: WebSocket;
  private isDisposed: boolean = false;
  private autoReconnectInterval = 5 * 1000;

  public onMessageEvent: ((event: WebSocketMessageEvent) => void) | null;
  public onErrorEvent: ((event: WebSocketErrorEvent) => void) | null;
  public onConnected: ((state: number) => void) | null;

  private onMessage = (e: WebSocketMessageEvent) => {
    if (this.onMessageEvent) {
      this.onMessageEvent(e);
    }
  };

  private onClose = (e) => {
    setTimeout(() => {
      if (!this.isDisposed) {
        console.log('WebSocketClient: reconnecting...');
        this.socket.close();
        this.socket.onclose = null;
        this.socket.onerror = null;
        this.socket.onmessage = null;
        this.socket.onopen = null;
        this.socket = null;
        this.connect();
      }
    }, this.autoReconnectInterval);
  };
  public dispose() {
    this.isDisposed = true;
    if (this.socket) {
      this.socket.close();
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket.onmessage = null;
      this.socket.onopen = null;
      this.socket = null;
    }
  }
  public send(command: string, data?: any) {
    if (this.socket && this.socket.readyState == WebSocket.OPEN)
      this.socket.send(JSON.stringify({command, data}));
  }

  public async connect() {
    const self = this;
    const token = await LocalStorage.getItem('token');

    return new Promise((resolve, reject) => {
      if (self.isDisposed) {
        resolve(WebSocket.CLOSED);
        return;
      }
      self.socket = new WebSocket(self.url, null, {
        headers: {...this.options, ...{token}},
      });
      self.socket.onopen = () => {
        if (self.socket.readyState == WebSocket.OPEN) {
          console.log('WebSocketClient: connected');
          resolve(WebSocket.OPEN);
          if (this.onConnected) {
            this.onConnected(WebSocket.OPEN);
          }
        } else {
          resolve(self.socket.readyState);
        }
      };
      self.socket.onclose = self.onClose.bind(self);
      self.socket.onmessage = self.onMessage.bind(self);
      self.socket.onerror = (e) => {
        console.log('socket.onerror', e);
        if (self.onErrorEvent) {
          self.onErrorEvent(e);
        }
        resolve(self.socket.readyState);
      };
    });
  }
}
