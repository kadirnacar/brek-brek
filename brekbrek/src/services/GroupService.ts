import config from '@config';
import { IGroup, Result } from '@models';
import { ServiceBase } from './ServiceBase';

export class GroupService extends ServiceBase {
  public static async create(item: IGroup): Promise<Result<IGroup>> {
    var result = await this.requestJson<IGroup>(
      {
        url: `${config.restUrl}/api/group`,
        method: 'POST',
        data: {item},
      },
      true,
    );
    return result;
  }
  public static async getUserGroups(): Promise<Result<IGroup[]>> {
    var result = await this.requestJson<IGroup[]>(
      {
        url: `${config.restUrl}/api/group`,
        method: 'GET',
      },
      true,
    );
    return result;
  }
}
