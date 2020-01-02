import config from '@config';
import { ServiceBase } from "./ServiceBase";
import { Result, Models } from '@models';

export class DataService extends ServiceBase {
    public static async getItem(entity: string, id: number): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/data/item/${id}`,
            method: "POST",
            data: { entity }
        }, true);
        return result;
    }
    public static async getList(entity: string): Promise<Result<any[]>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/data/list`,
            method: "POST",
            data: { entity }
        }, true);
        return result;
    }
    public static async create(entity: string, item: any): Promise<Result<any>> {
        var result = await this.requestJson<any>({
            url: `${config.restUrl}/api/data/`,
            method: "POST",
            data: { entity, item }
        }, true);
        return result;
    }
    public static async update(entity: string, item: any): Promise<Result<any>> {
        var result = await this.requestJson<any>({
            url: `${config.restUrl}/api/data/`,
            method: "PATCH",
            data: { entity, item }
        }, true);
        return result;
    }
    public static async delete(entity: string, id: number): Promise<Result<any>> {
        var result = await this.requestJson<any>({
            url: `${config.restUrl}/api/data/${id}`,
            method: "DELETE",
            data: { entity }
        }, true);
        return result;
    }
}