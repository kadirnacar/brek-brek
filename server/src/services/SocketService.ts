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

        let wstream: fs.WriteStream;
        let closed: boolean = true;
        connection.on('message', function (message) {
            console.log(message)
            // const messageObject = JSON.parse(message.utf8Data);
            // const type = messageObject.type;
            // const buffer = messageObject.buffer;
            // const codec = messageObject.codec;
            // const compressCodec = messageObject.compressCodec;
            // const compressBuffer = messageObject.compressBuffer;

            // console.log({ type, buffer: buffer.length || 0, codec: codec.length || 0, compressCodec: compressCodec.length || 0, compressBuffer: compressBuffer.length || 0 })
            // console.log({ type })
            // if (type == "start" && closed) {
            //     closed = false;
            //     wstream = fs.createWriteStream('myBinaryFile.raw');
            // }
            // if (type == "buffer" && !closed) {
            //     // wstream.write(new Buffer(codec));
            //     wstream.write(Buffer.from(buffer));
            // }
            // if (type == "stop" && !closed) {
            //     wstream.end();
            //     wstream.close();
            //     closed = true;
            // }
        });

        connection.on("close", (code, desc) => {
            var indx = SocketService.clients.findIndex(cln => cln["id"] == connection["id"]);
            if (indx > -1)
                SocketService.clients.splice(indx, 1);
        })
        SocketService.clients.push(connection);
    }

    public static sendMessageToClients(accountId: string, clientId: string, msg) {
        SocketService.clients.forEach(client => {
            client.send(JSON.stringify({ accountId, clientId, msg }));
        })
    }
}