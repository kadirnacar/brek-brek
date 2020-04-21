import { Column, ColumnOptions, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export class BaseModel {
    @PrimaryGeneratedColumn()
    Id: number = null;

    @CreateDateColumn({ nullable: true })
    CreateDate?: Date;

    @Column({ nullable: true, type: "int" })
    UserId?: number;

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