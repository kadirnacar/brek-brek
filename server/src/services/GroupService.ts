import { Group } from "@models";
import { BaseActions } from "./BaseService";

export class GroupService extends BaseActions<Group> {
  constructor() {
    super(Group);
  }
}