import { CoreRepository } from "@repository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { getRepository } from "./ServiceHelper";

export class CoreActions {
  constructor(entityName: string) {
    this.entityName = entityName;
    this.getRepository();
  }

  async getRepository() {
    if (!this.repository) {
      this.repository = await getRepository(this.entityName);
    }
    return this.repository;
  }

  entityName: string;
  repository: CoreRepository;

  public async getList(findOptions?: FindManyOptions<any>): Promise<any[]> {
    await this.getRepository();
    return await this.repository.all(findOptions);
  }

  public async getById(
    id: any,
    options?: FindOneOptions<any>
  ): Promise<any> {
    await this.getRepository();
    return await this.repository.get(id, options);
  }

  public async getItem(options?: FindOneOptions<any>): Promise<any> {
    await this.getRepository();
    return await this.repository.findOne(null, options);
  }

  public async update(id: number, model: Partial<any>): Promise<any> {
    await this.getRepository();
    return await this.repository.update(id, model);
  }

  public async save(model: Partial<any>): Promise<any> {
    await this.getRepository();
    return await this.repository.save(model);
  }

  public async delete(id: any, force: boolean = false): Promise<any> {
    await this.getRepository();
    return await this.repository.delete(id, force);
  }
}

export class BaseActions<T> extends CoreActions {
  constructor(x: new () => T) {
    super(x.name);
  }

  public async getList(findOptions?: FindManyOptions<T>): Promise<T[]> {
    return await super.getList(findOptions);
  }

  public async getById(id: any): Promise<T> {
    return await super.getById(id);
  }

  public async getItem(options?: FindOneOptions<T>): Promise<T> {
    return await super.getItem(options);
  }

  public async update(id: number, model: Partial<T>): Promise<T> {
    return await super.update(id, model);
  }

  public async save(model: Partial<T>): Promise<T> {
    return await super.save(model);
  }

  public async delete(id: any, force: boolean = false): Promise<any> {
    return await super.delete(id, force);
  }
}
