import config from '@config';
import {IGroup, Result, IGroupUser} from '@models';
import {ServiceBase} from './ServiceBase';

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
  public static async update(item: IGroup): Promise<Result<IGroup>> {
    var result = await this.requestJson<IGroup>(
      {
        url: `${config.restUrl}/api/group`,
        method: 'PATCH',
        data: item,
      },
      true,
    );
    return result;
  }

  public static async getItem(groupId): Promise<Result<IGroup>> {
    var result = await this.requestJson<IGroup>(
      {
        url: `${config.restUrl}/api/group/${groupId}`,
        method: 'GET',
      },
      true,
    );
    return result;
  }

  public static async joinGroup(groupId): Promise<Result<any>> {
    var result = await this.requestJson<any>(
      {
        url: `${config.restUrl}/api/group/join/${groupId}`,
        method: 'GET',
      },
      true,
    );
    return result;
  }
}
