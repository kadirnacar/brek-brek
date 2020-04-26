export class SocketClient {
  constructor(url: string) {
    this.url = url;
  }
  url: string;
  socket: WebSocket;
  isDisposed: boolean = false;
  autoReconnectInterval = 5 * 1000;

  onMessage = (e) => {
    console.log('socket message', e.data);
  };

  onClose = (e) => {
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
  public send(data) {
    if (this.socket.readyState == WebSocket.OPEN)
      this.socket.send(JSON.stringify(data));
  }

  public async connect() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.isDisposed) {
        resolve(WebSocket.CLOSED);
        return;
      }
      self.socket = new WebSocket(self.url);
      self.socket.onopen = () => {
        if (self.socket.readyState == WebSocket.OPEN) {
          resolve(WebSocket.OPEN);
        } else {
          resolve(self.socket.readyState);
        }
      };
      self.socket.onclose = self.onClose.bind(self);
      self.socket.onmessage = self.onMessage.bind(self);
      self.socket.onerror = (e) => {
          console.log(e.message)
        resolve(self.socket.readyState);
      };
    });
  }
}
