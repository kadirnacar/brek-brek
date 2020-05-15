import { Group } from "@models";
import { Services } from "@services";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { checkJwt } from "../middlewares/checkJwt";
import { BaseRouter } from "./BaseRoute";
import Utils from "@utils";
import { isRegExp } from "util";

export class GroupRouter extends BaseRouter<Group> {
  constructor() {
    super(Services.Group);
    this.init();
  }

  public async join(req: Request, res: Response, next) {
    try {
      if (!res.locals.jwtPayload) {
        res.sendStatus(401);
        return;
      }
      const userId = res.locals.jwtPayload.userId;
      const groupId = req.params.groupId;
      const group = await Services.Group.getById(groupId);
      const user = await Services.User.getById(userId);
      if (group && user) {
        group.Users.push({ DisplayName: user.DisplayName, Id: user.Id });
        await Services.Group.save(group);
        user.Groups.push({ Id: group.Id, Name: group.Name });
        await Services.User.save(user);
        res.status(200).send({ message: "user join to group" });
      } else {
        res.status(200).send({ message: "user or group not found" });
      }
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  public async createItem(req: Request, res: Response, next) {
    try {
      if (!res.locals.jwtPayload) {
        res.sendStatus(401);
        return;
      }
      const userId = res.locals.jwtPayload.userId;
      const user = await Services.User.getById(userId);
      if (user) {
        var values = req.body;

        const data = await this.service.save({
          ...new Group(),
          ...values.item,
          ...{ Users: [{ DisplayName: user.DisplayName, Id: user.Id }] },
          CreateUserId: res.locals.jwtPayload.userId,
        });
        user.Groups.push({ Id: data.Id, Name: data.Name });
        await Services.User.save(user);
        res.status(200).send(data);
      } else {
        res.status(501).send({ message: "user not found" });
      }
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  public async deleteItem(req: Request, res: Response, next) {
    try {
      const groupId: any = req.params["id"];
      const userId = res.locals.jwtPayload.userId;

      const group = await Services.Group.getById(groupId);
      const user = await Services.User.getById(userId);

      if (group && user) {
        const groupUserIndex = group.Users
          ? group.Users.findIndex((u) => u.Id == user.Id)
          : -1;
        if (groupUserIndex > -1) {
          group.Users.splice(groupUserIndex, 1);
          await Services.Group.save(group);
        }
        const userGroupIndex = user.Groups
          ? user.Groups.findIndex((u) => u.Id == group.Id)
          : -1;
        if (userGroupIndex > -1) {
          user.Groups.splice(userGroupIndex, 1);
          await Services.User.save(user);
        }
        res.status(200).send({});
      } else {
        res.status(200).send({});
      }
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  init() {
    this.router.get("/join/:groupId", [checkJwt], this.join.bind(this));
    // this.router.get('/:id', this.getItem.bind(this));
    this.router.delete("/:id", [checkJwt], this.deleteItem.bind(this));
    this.router.patch("/", [checkJwt], this.updateItem.bind(this));
    this.router.post("/", [checkJwt], this.createItem.bind(this));
  }
}
