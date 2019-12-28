import { DeleteResult, getManager, InsertResult, UpdateResult, FindManyOptions, FindOneOptions } from "typeorm";

export class Repository<T> {
    constructor(entityName: string) {
        this.entityName = entityName;
    }
    private entityName: string;
    async save(item: T): Promise<any> {
        if (!item["CreateDate"]) {
            item["CreateDate"] = new Date();
        }
        item["UpdateDate"] = new Date();
        return await getManager("configConnection").getRepository<T>(this.entityName).save(item);
    }
    async update(id: number, item: T): Promise<UpdateResult> {
        return await getManager("configConnection").getRepository<T>(this.entityName).update(id, item);
    }
    async delete(id: number, force: boolean = false): Promise<any> {
        if (force) {
            return await getManager("configConnection").getRepository<T>(this.entityName).delete(id);
        }
        const item = await this.get(id);
        item["Deleted"] = true;
        return await this.save(item);
    }
    async all(options?: FindManyOptions<T>): Promise<T[]> {
        return await getManager("configConnection").getRepository<T>(this.entityName).find(options);
    }
    async get(id: number, options?: FindOneOptions<T>): Promise<T> {
        return await getManager("configConnection").getRepository<T>(this.entityName).findOne(id, options);
    }
}