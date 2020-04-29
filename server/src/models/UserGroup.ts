import { Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

@Entity()
export class UserGroup extends BaseModel {
  @NullColumn()
  UserId?: string;

  @NullColumn()
  GroupId?: string;
}
