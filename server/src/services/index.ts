export { BaseActions } from "./BaseService";
export { UserService } from "./UserService";
export { logger, LoggerService } from "./LoggerService";
export { SocketService } from "./SocketService";
import { UserService } from "./UserService";

export const Services = {
  User: new UserService(),
};
