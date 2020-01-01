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
                if (message.utf8Data == "start" && closed) {
                    closed = false;
                    mp3stream = fs.createWriteStream('myBinaryFile.mp3');
                } else if (message.utf8Data == "stop" && !closed) {
                    mp3stream.end();
                    mp3stream.close();
                    closed = true;
                }
            } else if (message.type == "binary") {
                mp3stream.write(message.binaryData);
            }
        });

        connection.on("close", (code, desc) => {
            var indx = SocketService.clients.findIndex(cln => cln["id"] == connection["id"]);
            if (indx > -1)
                SocketService.clients.splice(indx, 1);
        });

        SocketService.clients.push(connection);
    }

    public static sendMessageToClients(accountId: string, clientId: string, msg) {
        SocketService.clients.forEach(client => {
            client.send(JSON.stringify({ accountId, clientId, msg }));
        })
    }
}