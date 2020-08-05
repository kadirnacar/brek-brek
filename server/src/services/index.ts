export { BaseActions } from "./BaseService";
export { logger, LoggerService } from "./LoggerService";
export { SocketService } from "./SocketService";

export { UserService } from "./UserService";
import { UserService } from "./UserService";

export { GroupService } from "./GroupService";
import { GroupService } from "./GroupService";

export { AppService } from "./AppService";
import { AppService } from "./AppService";

export { AprsService } from "./AprsService";
import { AprsService } from "./AprsService";

export const Services = {
  User: new UserService(),
  Group: new GroupService(),
  App: new AppService(),
  Aprs: new AprsService(),
};
