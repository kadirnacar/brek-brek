import { Group } from "@models";
import { Services } from "@services";
import { Request, Response } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { BaseRouter } from "./BaseRoute";

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
        if (!group.Users) {
          group.Users = {};
        }
        group.Users[user.Id.toString()] = { DisplayName: user.DisplayName };
        await Services.Group.save(group);
        if (!user.Groups) {
          user.Groups = {};
        }
        user.Groups[group.Id.toString()] = { Name: group.Name };
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
          ...{
            Users: { [user.Id.toString()]: { DisplayName: user.DisplayName } },
          },
          CreateUserId: res.locals.jwtPayload.userId,
        });
        if (!user.Groups) {
          user.Groups = {};
        }
        user.Groups[data.Id.toString()] = { Name: data.Name };

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
        if (group.Users && user.Id.toString() in group.Users) {
          delete group.Users[user.Id.toString()];
          await Services.Group.save(group);
        }

        if (user.Groups && group.Id.toString() in user.Groups) {
          delete user.Groups[groupId.Id.toString()];
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
    this.router.get('/:id', this.getItem.bind(this));
    this.router.delete("/:id", [checkJwt], this.deleteItem.bind(this));
    this.router.patch("/", [checkJwt], this.updateItem.bind(this));
    this.router.post("/", [checkJwt], this.createItem.bind(this));
  }
}
