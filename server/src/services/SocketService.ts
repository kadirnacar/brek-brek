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
        SocketService.sendMessageToGroup(
          groupId,
          userId,
          JSON.stringify({
            command: "leave",
            userId: userId,
          })
        );
        delete SocketService.clients[groupId][userId];
      }
    });

    connection.on("error", (err) => {
      console.log(err);
      if (
        SocketService.clients[groupId] &&
        SocketService.clients[groupId][userId]
      ) {
        SocketService.sendMessageToGroup(
          groupId,
          userId,
          JSON.stringify({
            command: "leave",
            userId: userId,
          })
        );
        delete SocketService.clients[groupId][userId];
      }
    });

    connection.on("message", this.onMessage.bind(this, groupId, userId));
    if (!SocketService.clients[groupId]) {
      SocketService.clients[groupId] = {};
    }
    SocketService.clients[groupId][userId] = connection;
  }

  private static onMessage(groupId, userId, data: WebSocket.IMessage) {
    console.log(data);
    const command = JSON.parse(data.utf8Data);

    switch (command.command) {
      case "join":
        SocketService.sendMessageToPeer(
          groupId,
          userId,
          JSON.stringify({
            command: command.command,
            peers: Object.keys(SocketService.clients[groupId]),
          })
        );
        break;
      case "exchange":
        SocketService.sendMessageToPeer(
          groupId,
          command.data.to,
          JSON.stringify({
            command: command.command,
            from: userId,
            candidate: command.data.candidate,
            sdp: command.data.sdp,
          })
        );
        break;
    }
  }
  private static sendMessageToPeer(groupId, userId, message) {
    if (
      userId in SocketService.clients[groupId] &&
      SocketService.clients[groupId][userId].connected
    )
      SocketService.clients[groupId][userId].send(message);
  }
  private static sendMessageToGroup(groupId, userId, message) {
    const groupMemeberIds = Object.keys(SocketService.clients[groupId]).filter(
      (i) => i != userId
    );
    for (var i = 0; i < groupMemeberIds.length; i++) {
      if (
        groupMemeberIds[i] in SocketService.clients[groupId] &&
        SocketService.clients[groupId][groupMemeberIds[i]].connected
      )
        SocketService.clients[groupId][groupMemeberIds[i]].send(message);
    }
  }
}
