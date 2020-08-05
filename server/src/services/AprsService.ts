import { Aprs } from "@models";
import { BaseActions } from "./BaseService";

export class AprsService extends BaseActions<Aprs> {
  constructor() {
    super(Aprs);
  }
}