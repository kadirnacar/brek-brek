import { App } from "@models";
import { BaseActions } from "./BaseService";

export class AppService extends BaseActions<App> {
  constructor() {
    super(App);
  }
}