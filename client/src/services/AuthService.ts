import config from '@config';
import { ServiceBase } from "./ServiceBase";
import { Result } from '@models';

export class AuthService extends ServiceBase {
    public static async login(username, password): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/auth/login`,
            method: "POST",
            data: { username, password }
        }, false);
        return result;
    }
    public static async checkAuth(): Promise<Result<boolean>> {
        var result = await this.requestJson<boolean>({
            url: `${config.restUrl}/api/auth/check`,
            method: "POST"
        });
        return result;
    }
}