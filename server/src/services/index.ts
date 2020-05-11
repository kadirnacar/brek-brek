export { BaseActions } from "./BaseService";
export { logger, LoggerService } from "./LoggerService";
export { SocketService } from "./SocketService";

export { UserService } from "./UserService";
import { UserService } from "./UserService";

export { GroupService } from "./GroupService";
import { GroupService } from "./GroupService";

export { UserGroupService } from "./UserGroupService";
import { UserGroupService } from "./UserGroupService";

export { AppService } from "./AppService";
import { AppService } from "./AppService";

export const Services = {
  User: new UserService(),
  Group: new GroupService(),
  UserGroup: new UserGroupService(),
  App: new AppService(),
};
