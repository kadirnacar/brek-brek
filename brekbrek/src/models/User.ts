export interface IUser {
  Id?: any;
  CreateDate?: Date;
  UpdateDate?: Date;
  DeletedDate?: Date;
  Deleted?: boolean;
  DisplayName?: string;
  Email?: string;
  Uid?: string;
  Type?: 'User' | 'Facebook' | 'Google';
  Groups?: IUserGroup;
}

export interface IUserGroup {
  [key: string]: {
    Name: string;
  };
}
