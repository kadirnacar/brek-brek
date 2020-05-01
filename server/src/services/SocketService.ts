import { Message } from "@models";
import * as http from "http";
import * as https from "https";
import * as shortid from "shortid";
import * as WebSocket from "websocket";
import { logger } from "./LoggerService";
import { parseToken } from "../middlewares/checkJwt";

export class SocketService {
  static wsServer: WebSocket.server;
  static clients: {
    [key: string]: { [key: string]: WebSocket.connection };
  } = {};
  public static async init(server: http.Server | https.Server) {
    this.wsServer = new WebSocket.server({
      httpServer: server,
    });
    this.wsServer.on("request", this.onRequest.bind(this));
  }

  private static onRequest(request: WebSocket.request) {
    var address = request.socket.remoteAddress;
    const token = request.httpRequest.headers.token;
    if (!token) {
      request.reject(401, "Authantication Error");
      return;
    }
    let user;
    try {
      user = parseToken(token);
    } catch (err) {
      console.log(err);
      request.reject(401);
      return;
    }
    logger.info(`${address} connected`);
    const groupId: string = request.httpRequest.headers.id.toString();
    const userId = user.userId;
    const connection = request.accept();
    connection["id"] = userId;

    connection.on("close", (code, desc) => {
      console.log("close", code, desc);
      if (
        SocketService.clients[groupId] &&
        SocketService.clients[groupId][userId]
      ) {
        delete SocketService.clients[groupId][userId];
      }
    });

    connection.on("error", (err) => {
      console.log(err);
      if (
        SocketService.clients[groupId] &&
        SocketService.clients[groupId][userId]
      ) {
        delete SocketService.clients[groupId][userId];
      }
    });

    connection.on("message", this.onMessage.bind(this, groupId, userId));
    if (!SocketService.clients[groupId]) {
      SocketService.clients[groupId] = {};
    }
    SocketService.clients[groupId][userId] = connection;
    console.log(SocketService.clients)
  }

  private static onMessage(groupId, userId, data: WebSocket.IMessage) {
    console.log(groupId, userId, data);
    
    SocketService.clients[groupId][userId].send(data.utf8Data);
    // SocketService.clients[id].send(data.utf8Data);
  }

  public static sendMessageToClients(
    accountId: string,
    clientId: string,
    msg: Message
  ) {}
}
