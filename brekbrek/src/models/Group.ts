export interface IGroup {
  Id?: any;
  CreateDate?: Date;
  UpdateDate?: Date;
  DeletedDate?: Date;
  Deleted?: boolean;
  Name?: string;
  Description?: string;
  CreateUserId?: string;
  Users?: IGroupUser;
}
export enum UserStatus {
  Online,
  Offline,
  Talking
}
export interface IGroupUser {
  [key: string]: {DisplayName: string; status: UserStatus};
}
