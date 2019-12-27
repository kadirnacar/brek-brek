import config from '@config';
import { Result } from '@models';
import { ServiceBase } from "./ServiceBase";

export class AuthService extends ServiceBase {
    public static async setPushToken(expo, device): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/auth/pushtoken`,
            method: "POST",
            data: { expo, device }
        }, true);
        return result;
    }
    public static async login(username, password, anonymousId): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/auth/login`,
            method: "POST",
            data: { username, password, anonymousId }
        }, false);
        return result;
    }
    public static async loginFacebook(id, name, email, anonymousId): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/auth/facebook`,
            method: "POST",
            data: { id, name, email, anonymousId }
        }, false);
        return result;
    }
    public static async loginAnonymous(id, name): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/auth/anonymous`,
            method: "POST",
            data: { id, name }
        }, false);
        return result;
    }
    public static async loginGoogle(id, name, email, anonymousId): Promise<Result<any>> {
        var result = await this.requestJson<any[]>({
            url: `${config.restUrl}/api/auth/google`,
            method: "POST",
            data: { id, name, email, anonymousId }
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