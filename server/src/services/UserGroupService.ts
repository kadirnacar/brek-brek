import { UserGroup } from "@models";
import { BaseActions } from "./BaseService";

export class UserGroupService extends BaseActions<UserGroup> {
  constructor() {
    super(UserGroup);
  }
}
