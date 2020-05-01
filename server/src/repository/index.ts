import {
  FindManyOptions,
  FindOneOptions,
  getMongoManager,
  UpdateResult,
} from "typeorm";
import { ObjectId } from "mongodb";

export class CoreRepository {
  constructor(entityName: string) {
    this.entityName = entityName;
  }

  entityName: string;

  getRepository() {
    return getMongoManager("configConnection").getMongoRepository(
      this.entityName
    );
  }

  async save(item: any): Promise<any> {
    // if (!item["CreateDate"]) {
    //     item["CreateDate"] = new Date();
    // }
    // item["UpdateDate"] = new Date();
    const repo = getMongoManager("configConnection").getMongoRepository(
      this.entityName
    );
    return await repo.save(item);
  }
  async update(id: any, item: any): Promise<UpdateResult> {
    return await getMongoManager("configConnection")
      .getMongoRepository(this.entityName)
      .update(id, item);
  }
  async delete(id: any, force: boolean = false): Promise<any> {
    // if (force) {
    // return await getMongoManager("configConnection")
    //   .getMongoRepository(this.entityName)
    //   .softDelete(id);
    // }
    const item = await this.get(id);
    item["Deleted"] = true;
    item["DeletedDate"] = new Date();
    return await this.save(item);
  }
  async all(options?: FindManyOptions<any>): Promise<any[]> {
    return await getMongoManager("configConnection")
      .getMongoRepository(this.entityName)
      .find(options);
  }
  async get(id: any): Promise<any> {
    return await getMongoManager("configConnection")
      .getMongoRepository(this.entityName)
      .findOne(id);
  }
  async findOne(options?: FindOneOptions<any>): Promise<any> {
    return await getMongoManager("configConnection")
      .getMongoRepository(this.entityName)
      .findOne(options);
  }
}

export class Repository<T> extends CoreRepository {
  constructor(x: new () => T) {
    super(x.name);
  }

  async save(item: Partial<T>): Promise<any> {
    return await super.save(item);
  }
  async update(id: any, item: Partial<T>): Promise<UpdateResult> {
    return await super.update(id, item);
  }
  async delete(id: any, force: boolean = false): Promise<any> {
    return await super.delete(id, force);
  }
  async all(options?: FindManyOptions<T>): Promise<T[]> {
    return await super.all(options);
  }
  async get(id: any): Promise<T> {
    return await super.get(id);
  }
  async findOne(options?: FindOneOptions<T>): Promise<T> {
    return await super.findOne(options);
  }
}
