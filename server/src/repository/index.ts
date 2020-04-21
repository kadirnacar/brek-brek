import { FindManyOptions, FindOneOptions, getManager, ObjectID, UpdateResult } from "typeorm";

export class CoreRepository {
    constructor(entityName: string) {
        this.entityName = entityName;
    }

    entityName: string;

    getRepository() {
        return getManager("configConnection").getRepository(this.entityName);
    }

    async save(item: any): Promise<any> {
        // if (!item["CreateDate"]) {
        //     item["CreateDate"] = new Date();
        // }
        // item["UpdateDate"] = new Date();
        const repo = getManager("configConnection").getRepository(this.entityName);
        return await repo.save(item);
    }
    async update(id: number, item: any): Promise<UpdateResult> {
        return await getManager("configConnection").getRepository(this.entityName).update(id, item);
    }
    async delete(id: number, force: boolean = false): Promise<any> {
        // if (force) {
        return await getManager("configConnection").getRepository(this.entityName).softDelete(id);
        // }
        // const item = await this.get(id);
        // item["Deleted"] = true;
        // return await this.save(item);
    }
    async all(options?: FindManyOptions<any>): Promise<any[]> {
        return await getManager("configConnection").getRepository(this.entityName).find(options);
    }
    async get(id: number, options?: FindOneOptions<any>): Promise<any> {
        return await this.findOne(id, options);
    }
    async findOne(id?: number, options?: FindOneOptions<any>): Promise<any> {
        return await getManager("configConnection").getRepository(this.entityName).findOne(id, options);
    }
}

export class Repository<T> extends CoreRepository {
    constructor(x: new () => T) {
        super(x.name);
    }

    async save(item: Partial<T>): Promise<any> {
        return await super.save(item);
    }
    async update(id: number, item: Partial<T>): Promise<UpdateResult> {
        return await super.update(id, item);
    }
    async delete(id: number, force: boolean = false): Promise<any> {
        return await super.delete(id, force);
    }
    async all(options?: FindManyOptions<T>): Promise<T[]> {
        return await super.all(options);
    }
    async get(id: number): Promise<T> {
        return await super.get(id);
    }
    async findOne(id?: number, options?: FindOneOptions<T>): Promise<T> {
        return await super.findOne(id, options);
    }
}