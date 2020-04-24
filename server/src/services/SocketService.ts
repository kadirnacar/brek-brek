import { Message } from "@models";
import * as http from "http";
import * as https from "https";
import * as shortid from "shortid";
import * as WebSocket from "websocket";
import { logger } from "./LoggerService";

export class SocketService {
  static wsServer: WebSocket.server;
  static clients: { [key: string]: WebSocket.connection } = {};
  public static async init(server: http.Server | https.Server) {
    this.wsServer = new WebSocket.server({
      httpServer: server,
    });
    this.wsServer.on("request", this.onRequest.bind(this));
  }

  private static onRequest(request: WebSocket.request) {
    var address = request.socket.remoteAddress;
    logger.info(`${address} connected`);
    const connection = request.accept();
    connection["id"] = shortid.generate();
    connection.on("close", (code, desc) => {
      console.log("close");
      if (SocketService.clients[connection["id"]]) {
        delete SocketService.clients[connection["id"]];
      }
    });
    
    connection.on("message", this.onMessage.bind(this, connection["id"]));
    SocketService.clients[connection["id"]] = connection;
  }

  private static onMessage(id, data: WebSocket.IMessage) {
    console.log("onMessage data", data, id);
    console.log("clients", SocketService.clients);
    // setInterval(() => {
    SocketService.clients[id].send(data.utf8Data);
    SocketService.clients[id].ping(data.utf8Data);
    console.log("send message");
    // }, 500);
    // var address = request.socket.remoteAddress;
    // logger.info(`${address} connected`);
    // var connection = request.accept();
    // connection["id"] = shortid.generate();
    // connection.on("close", (code, desc) => {
    //     var indx = SocketService.clients.findIndex(cln => cln["id"] == connection["id"]);
    //     if (indx > -1)
    //         SocketService.clients.splice(indx, 1);
    // })
    // SocketService.clients.push(connection);
  }

  public static sendMessageToClients(
    accountId: string,
    clientId: string,
    msg: Message
  ) {}
}
