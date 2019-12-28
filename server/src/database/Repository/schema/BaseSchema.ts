import { BaseModel } from '@models';
import { EntitySchema, EntitySchemaColumnOptions } from "typeorm";
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

export const langs = ["de", "en", "ru"];

export interface BaseEntitySchemaColumnOptions extends EntitySchemaColumnOptions {
    i18n?: boolean;
}

export class BaseEntitySchemaOptions<T> extends EntitySchemaOptions<T>{
    columns: {
        [P in keyof T]?: BaseEntitySchemaColumnOptions;
    };
}

export class BaseSchema<T extends BaseModel> extends EntitySchema<T>  {
    constructor(type: new () => T, options: BaseEntitySchemaOptions<T>) {
        // const options: EntitySchemaOptions<T> = new EntitySchemaOptions<T>();

        Object.keys(options.columns).forEach(clm => {
            if (options.columns[clm].i18n == true) {
                langs.forEach(lng => {
                    options.columns[clm + "_" + lng] = options.columns[clm];
                    delete options.columns[clm + "_" + lng].i18n;
                })
            }
        })

        options.target = type;
        options.name = type.name;
        options.tableName = type.name;
        options.columns.Id = {
            primary: true,
            type: "int",
            generated: true
        };
        options.columns.CreateDate = {
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            nullable: true
        };
        options.columns.UpdateDate = {
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            nullable: true
        };
        options.columns.Deleted = {
            type: "boolean",
            default: false,
            nullable: true
        };
        super(options);
    }
}