import { Message } from '@models';
import * as http from 'http';
import * as https from 'https';
import * as shortid from 'shortid';
import * as WebSocket from 'websocket';
import { logger } from './LoggerService';

export class SocketService {
    static wsServer: WebSocket.server;
    static clients: WebSocket.connection[] = [];
    public static async init(server: http.Server | https.Server) {
        this.wsServer = new WebSocket.server({
            httpServer: server
        });
        this.wsServer.on('request', this.onRequest.bind(this));
    }

    private static onRequest(request: WebSocket.request) {
        var address = request.socket.remoteAddress;
        logger.info(`${address} connected`);
        var connection = request.accept();
        connection["id"] = shortid.generate();
        connection.on("close", (code, desc) => {
            var indx = SocketService.clients.findIndex(cln => cln["id"] == connection["id"]);
            if (indx > -1)
                SocketService.clients.splice(indx, 1);
        })
        SocketService.clients.push(connection);
    }

    public static sendMessageToClients(accountId: string, clientId: string, msg: Message) {
        SocketService.clients.forEach(client => {
            client.send(JSON.stringify({ accountId, clientId, msg }));
        })
    }
}