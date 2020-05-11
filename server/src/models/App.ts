import { Entity } from "typeorm";
import { BaseModel, NullColumn } from "./utils/BaseModel";

@Entity()
export class App extends BaseModel {
  @NullColumn()
  packageName?: string;

  @NullColumn()
  buildNumber?: string;

  @NullColumn()
  version?: string;

  @NullColumn()
  appStoreUrl?: string;

  @NullColumn()
  playStoreUrl?: string;

  @NullColumn({ default: false })
  force?: boolean;
}
