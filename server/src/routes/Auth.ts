import config from "@config";
import { User } from "@models";
import { Services } from "@services";
import { NextFunction, Request, Response, Router } from "express";
import * as jwt from "jsonwebtoken";

const UserService = Services.User;

export class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async facebook(req: Request, res: Response, next: NextFunction) {
    try {
      const postUser: User = req.body;

      if (!postUser || !postUser.Uid) {
        res.status(400).send();
      }

      let user: User;
      try {
        user = await UserService.getItem({
          where: { Uid: postUser.Uid, Deleted: false },
        });
      } catch (error) {
        res.status(501).send(error && error.message ? error.message : error);
      }
      if (!user) {
        user = new User();
        user.DisplayName = postUser.DisplayName;
        user.Email = postUser.Email;
        user.Type = "Facebook";
        user.Uid = postUser.Uid;
        user = await UserService.save(user);
      }

      const token = jwt.sign(
        {
          userId: user.Id,
          email: user.Email,
          uid: user.Uid,
          displayName: user.DisplayName,
        },
        config.jwtSecret,
        { expiresIn: "20000 days" }
      );

      res.send({
        user: user,
        token: token,
      });
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  public async google(req: Request, res: Response, next: NextFunction) {
    try {
      const postUser: User = req.body;

      if (!postUser || !postUser.Uid) {
        res.status(400).send();
      }

      let user: User;
      try {
        user = await UserService.getItem({
          where: { Uid: postUser.Uid, Deleted: false },
        });
      } catch (error) {
        res.status(501).send(error && error.message ? error.message : error);
      }
      if (!user) {
        user = new User();
        user.DisplayName = postUser.DisplayName;
        user.Email = postUser.Email;
        user.Type = "Google";
        user.Uid = postUser.Uid;
        user = await UserService.save(user);
      }

      const token = jwt.sign(
        {
          userId: user.Id,
          email: user.Email,
          uid: user.Uid,
          displayName: user.DisplayName,
        },
        config.jwtSecret,
        { expiresIn: "20000 days" }
      );

      res.send({
        user: user,
        token: token,
      });
    } catch (err) {
      next(err && err.message ? err.message : err);
    }
  }

  async init() {
    this.router.post("/google", this.google.bind(this));
    this.router.post("/facebook", this.facebook.bind(this));
  }
}
