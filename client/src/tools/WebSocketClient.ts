import { AddAlarm, InsertInvitation } from "@material-ui/icons";
import config from "@config";

type messageType = 'ready' | 'error' | 'connect' | 'info';

class WebSocketClient {
    constructor() {
        this.webSocket = new WebSocket(config.wsUrl);
        this.init();
    }
    webSocket: WebSocket;
    events: any;
    addEvent(name: messageType, callback) {
        if (!this.events) {
            this.events = {};
        }
        this.events[name] = callback;
    }
    private init() {
        this.webSocket.onmessage = this.handleOnMessage.bind(this);
    }

    public sendMessage(type: messageType, data: any) {
        this.webSocket.send(JSON.stringify({ type, data }));
    }

    handleOnMessage(ev: MessageEvent) {
        const msg = JSON.parse(ev.data);
        switch (msg.type) {
            case 'error':
                console.error("Socket Server error", msg.data);
                break;
            default:
                if (this.events[msg.type]) {
                    this.events[msg.type](msg.data);
                }
                break;
        }
    }
}

export const socket = new WebSocketClient();
