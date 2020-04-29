import { Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

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
}
