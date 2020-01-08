import * as http from 'http';
import * as https from 'https';
import * as shortid from 'shortid';
import * as WebSocket from 'websocket';
import * as Stream from 'stream';
import { logger } from './LoggerService';
import * as fs from 'fs';

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

        let mp3stream: fs.WriteStream;
        let closed: boolean = true;

        connection.on('message', (message) => {
            console.log(message)
            if (message.type == "utf8") {
                const data = JSON.parse(message.utf8Data);
                try {
                    SocketService[data.type](connection["id"], data.data);
                } catch (ex) {
                    connection.send(JSON.stringify({ type: "error", msg: ex }));
                }
            } else if (message.type == "binary") {
                this.sendMessageToClients(connection["id"], message.binaryData);
                mp3stream.write(message.binaryData);
            }
        });

        connection.on("close", (code, desc) => {
            var indx = SocketService.clients.findIndex(cln => cln["id"] == connection["id"]);
            if (indx > -1)
                SocketService.clients.splice(indx, 1);
        });

        SocketService.clients.push(connection);

        console.log(SocketService.clients);
    }

    private static ready(senderId, data) {
        SocketService.sendMessageToClients(senderId, JSON.stringify({ type: "connect" }));
    }

    private static info(senderId, data) {
        SocketService.sendMessageToClients(senderId, JSON.stringify({ type: "info", data }));
    }


    public static sendMessageToClients(senderId, msg) {
        SocketService.clients.filter(i => i["id"] != senderId).forEach(client => {
            client.send(msg);
        })
    }
}