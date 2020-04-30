import { Group, UserGroup } from "@models";
import { Services } from "@services";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { checkJwt } from "../middlewares/checkJwt";
import { BaseRouter } from "./BaseRoute";

export class GroupRouter extends BaseRouter<Group> {
  constructor() {
    super(Services.Group);
    this.init();
  }

  public async getList(req: Request, res: Response, next) {
    try {
      const userId = res.locals.jwtPayload.userId;
      const groupIds = (
        await Services.UserGroup.getList({
          where: { UserId: userId, Deleted: false },
        })
      ).map((userGroup) => new ObjectId(userGroup.GroupId));
      const data = await this.service.getList({
        where: { _id: { $in: groupIds }, Deleted: false },
      });
      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  }

  public async createItem(req: Request, res: Response, next) {
    try {
      var values = req.body;

      const data = await this.service.save({
        ...new Group(),
        ...values.item,
        CreateUserId: res.locals.jwtPayload.userId,
      });
      await Services.UserGroup.save({
        ...new UserGroup(),
        ...{
          GroupId: data.Id.toString(),
          UserId: res.locals.jwtPayload.userId,
        },
      });
      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  }

  public async deleteItem(req: Request, res: Response, next) {
    try {
      const groupId = req.params["id"];
      const userId = res.locals.jwtPayload.userId;
      const userGroup = await Services.UserGroup.getList({
        where: { UserId: userId, GroupId: groupId, Deleted: false },
      });
      let data;
      if (userGroup.length > 0) {
        for (var i = 0; i < userGroup.length; i++) {
          data = await Services.UserGroup.delete(userGroup[i].Id);
        }
      }
      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  }

  async init() {
    this.router.get("/", [checkJwt], this.getList.bind(this));
    // this.router.get('/:id', this.getItem.bind(this));
    this.router.delete("/:id", [checkJwt], this.deleteItem.bind(this));
    // this.router.patch('/', [checkJwt], this.updateItem.bind(this));
    this.router.post("/", [checkJwt], this.createItem.bind(this));
  }
}
