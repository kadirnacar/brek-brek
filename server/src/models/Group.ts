import { Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

@Entity()
export class Group extends BaseModel {
  @NullColumn()
  Name?: string;

  @NullColumn()
  Description?: string;

  @NullColumn()
  CreateUserId?: string;
}
