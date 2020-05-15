import { Entity, Column } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";
import { Group } from "./Group";

export class UserGroup {
  [key: string]: {
    Name: string;
  };
}

@Entity()
export class User extends BaseModel {
  @NullColumn()
  DisplayName?: string;

  @NullColumn()
  Email?: string;

  @NullColumn()
  Uid?: string;

  @NullColumn({ default: "User" })
  Type?: "Admin" | "User" | "Facebook" | "Google" | "Anonymous" = "User";

  @Column((type) => UserGroup)
  Groups?: UserGroup;
}
