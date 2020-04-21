import { Default } from "@models";
import { BaseActions } from "./BaseService";

export class DefaultService extends BaseActions<Default> {
  constructor() {
    super(Default);
  }
}