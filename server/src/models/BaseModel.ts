import { DeepPartial } from "typeorm";

export interface IBaseModel {
    Id?: number;
    CreateDate?: Date;
    UpdateDate?: Date;
    Deleted?: boolean;
}
export class BaseModel implements DeepPartial<IBaseModel> {
    constructor() {
    }
    Id?: number = null;
    CreateDate?: Date = new Date();
    UpdateDate?: Date = new Date();
    Deleted?: false;
}