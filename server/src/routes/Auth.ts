import { User } from "@models";
import { Services } from "@services";
import { NextFunction, Request, Response, Router } from "express";
import config from "@config";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { checkJwt } from "../middlewares/checkJwt";

const UserService = Services.User;

export class AuthRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
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
          where: { Uid: postUser.Uid },
        });
      } catch (error) {
        res.status(401).send();
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
      next(err);
    }
  }

  async init() {
    this.router.post("/google", this.google.bind(this));
  }
}
