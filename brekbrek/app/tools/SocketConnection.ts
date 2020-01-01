import config from "@config";

export class SocketConnection {
    socket: WebSocket;
    autoReconnectInterval = 5 * 1000;
    onOpen = (e) => {
        console.log("socket open", e);
    }

    onMessage = (e) => {
        console.log("socket message", e.data);
    }

    onError = (e) => {
        console.log("socket error", e);
        this.socket.removeEventListener("close", this.onClose);
        this.socket.removeEventListener("error", this.onError);
        this.socket.removeEventListener("message", this.onMessage);
        this.socket.removeEventListener("open", this.onOpen);
    }

    onClose = (e) => {
        console.log("socket close", e);
        this.socket.removeEventListener("close", this.onClose);
        this.socket.removeEventListener("error", this.onError);
        this.socket.removeEventListener("message", this.onMessage);
        this.socket.removeEventListener("open", this.onOpen);
        setTimeout(() => {
            console.log("WebSocketClient: reconnecting...");
            this.connect();
        }, this.autoReconnectInterval);
    }

    public send(data) {
        this.socket.send(JSON.stringify(data));
    }

    public connect() {
        this.socket = new WebSocket(config.wsUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }
}