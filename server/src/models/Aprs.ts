import { Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

@Entity()
export class Aprs extends BaseModel {
  @NullColumn({ type: "float" })
  Latitude?: number;

  @NullColumn({ type: "float" })
  Longitude?: number;
}
