
export { BaseActions } from "./BaseService";
export { DefaultService } from './DefaultService';
export { logger, LoggerService } from "./LoggerService";
export { SocketService } from "./SocketService";
import { DefaultService } from './DefaultService';

export const Services = {
    Default: new DefaultService()
}
