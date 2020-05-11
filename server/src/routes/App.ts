import { App } from "@models";
import { Services } from "@services";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { checkJwt } from "../middlewares/checkJwt";
import { BaseRouter } from "./BaseRoute";
import Utils from "@utils";

export class AppRouter extends BaseRouter<App> {
  constructor() {
    super(Services.App);
    this.init();
  }

  public async getList(req: Request, res: Response, next) {
    try {
      const data = await this.service.getList({
        order: { CreateDate: "DESC" },
        take: 1,
      });
      if (data && data.length > 0) {
        res.status(200).send(data[0]);
      } else {
        res.status(200).send({});
      }
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  public async add(req: Request, res: Response, next) {
    try {
      const data = await this.service.save({ Deleted: false, ...req.query });
      res.status(200).send(data);
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  init() {
    this.router.get("/", this.getList.bind(this));
    this.router.get("/add", this.add.bind(this));
    // this.router.get('/:id', this.getItem.bind(this));
    this.router.delete("/:id", [checkJwt], this.deleteItem.bind(this));
    this.router.patch("/", [checkJwt], this.updateItem.bind(this));
    this.router.post("/", [checkJwt], this.createItem.bind(this));
  }
}
