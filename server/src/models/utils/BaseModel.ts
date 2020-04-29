import {
  Column,
  ColumnOptions,
  CreateDateColumn,
  DeleteDateColumn,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseModel {
  @ObjectIdColumn()
  Id: ObjectID;

  @CreateDateColumn({ nullable: true })
  CreateDate?: Date;

  @UpdateDateColumn({ nullable: true })
  UpdateDate?: Date;

  @DeleteDateColumn({ nullable: true })
  DeletedDate?: Date;

  @Column({ nullable: true, default: false })
  Deleted?: boolean = false;
}

export function NullColumn(options?: ColumnOptions) {
  return Column({ nullable: true, ...options });
}
