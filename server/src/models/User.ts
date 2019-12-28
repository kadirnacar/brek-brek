import { IBaseModel, BaseModel } from "./BaseModel";

export interface IUser extends IBaseModel {
    Name: string;
    Username: string;
    Password: string;
    Email: string;
    DevicePushToken: string;
    ExpoPushToken: string;
    Type: "Admin" | "User" | "Facebook" | "Google" | "Anonymous";
}
export class User extends BaseModel implements IUser {
    Name: string = null;
    Username: string = null;
    Password: string = null;
    Email: string = null;
    DevicePushToken: string = null;
    ExpoPushToken: string = null;
    Type: "Admin" | "User" | "Facebook" | "Google" | "Anonymous" = "User";
}
