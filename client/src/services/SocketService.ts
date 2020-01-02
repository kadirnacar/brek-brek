import config from '@config';
import { ServiceBase } from "./ServiceBase";

window["WebSocket"] = window["WebSocket"] || window["MozWebSocket"];

export class SocketService extends ServiceBase {
    private static socket: WebSocket;
    public static init() {
        SocketService.createSocket();
        setInterval(function () {
            if (SocketService.socket.readyState !== 1) {
                console.error('Unable to communicate with the WebSocket server.');
                SocketService.createSocket();
            }
        }, 3000);
    }

    static createSocket() {
        if (SocketService.socket)
            SocketService.socket.close();

        SocketService.socket = new WebSocket(config.wsUrl);
        SocketService.socket.onerror = (err) => {
            console.error(err);
        };
        SocketService.socket.onmessage = (response) => {
            var res = JSON.parse(response.data);
            // StoreHelper.getStore().dispatch({ type: Actions.ReceiveNewMessageData, accountId: res.accountId, clientId: res.clientId, payload: res.msg });
        };
    }
}