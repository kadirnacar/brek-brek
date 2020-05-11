import config from '@config';
import {IGroupUser, Result} from '@models';
import {ServiceBase} from './ServiceBase';

export class AppService extends ServiceBase {
  public static async getLastVersion(): Promise<Result<any>> {
    var result = await this.requestJson<IGroupUser>(
      {
        url: `${config.restUrl}/api/app/`,
        method: 'GET',
      },
      false,
    );
    return result;
  }
}
