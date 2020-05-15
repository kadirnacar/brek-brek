import { Column, Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

export class GroupUser {
  @NullColumn()
  Id?: any;

  @NullColumn()
  DisplayName?: string;
}

@Entity()
export class Group extends BaseModel {
  @NullColumn()
  Name?: string;

  @NullColumn()
  Description?: string;

  @NullColumn()
  CreateUserId?: string;

  @Column((type) => GroupUser)
  Users?: GroupUser[] = [];
}
