import {  } from "@routes";
import { logger } from "@services";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as xmlparser from "express-xml-bodyparser";
import * as helmet from "helmet";
import corsPrefetch from "./cors";

class App {
  public express;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    
  }

  private middleware(): void {
    this.express.use(corsPrefetch);
    this.express.use(helmet());
    this.express.use(bodyParser.json({ limit: "50mb" }));
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(xmlparser());
  }

  private routes(): void {
    let router = express.Router();
    this.express.use(express.static("public"));
    this.express.use(express.static("dist"));
    this.express.use(express.static("."));
    this.express.use(express.static("js"));
    this.express.use(express.static("dist/uploads"));
    this.express.use(express.static("/uploads"));

    this.express.use(/\/((?!api).)*/, function (req, res) {
      res.send("App Server");
      // res.sendFile('index.html', { root: path.resolve(".") }, function (err) {
      //   if (err) {
      //     res.status(500).send(err)
      //   }
      // })
    });

    this.express.use("/", router);
    
    this.express.use((err, req, res, next) => {
      logger.error(err);
      res.status(err.status || 500);
      res.json({
        message: err.message || err,
        error: err
      });
    });
  }
}

export default new App().express;
