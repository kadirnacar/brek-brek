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
    // logger.info(`${address} connected`);
    const connection = request.accept();
    connection["id"] = shortid.generate();

    connection.on("close", (code, desc) => {
      if (SocketService.clients[connection["id"]]) {
        delete SocketService.clients[connection["id"]];
      }
    });
    
    connection.on("message", this.onMessage.bind(this, connection["id"]));
    SocketService.clients[connection["id"]] = connection;
  }

  private static onMessage(id, data: WebSocket.IMessage) {
    SocketService.clients[id].send(data.utf8Data);
  }

  public static sendMessageToClients(
    accountId: string,
    clientId: string,
    msg: Message
  ) {}
}
