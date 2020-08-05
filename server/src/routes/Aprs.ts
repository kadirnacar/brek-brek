import { Aprs } from "@models";
import { Services } from "@services";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { checkJwt } from "../middlewares/checkJwt";
import { BaseRouter } from "./BaseRoute";
import Utils from "@utils";
import { MoreThan, MoreThanOrEqual } from "typeorm";

export class AprsRouter extends BaseRouter<Aprs> {
  constructor() {
    super(Services.Aprs);
    this.init();
  }

  public async getList(req: Request, res: Response, next) {
    try {
      const c = new Date(req.query["date"].toString());
      const data = await this.service.getList({
        order: { CreateDate: "DESC" },
        where: { UpdateDate: { $gte: new Date(req.query["date"].toString()) } },
      });
      if (data && data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(200).send(c);
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
