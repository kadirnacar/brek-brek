import { Column, Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

export class GroupUser {
  [key: string]: {
    DisplayName: string;
  };
}

@Entity()
export class Group extends BaseModel {
  @NullColumn()
  Name?: string;

  @NullColumn()
  Description?: string;

  @NullColumn()
  CreateUserId?: string;

  @NullColumn()
  Users?: GroupUser;
}
