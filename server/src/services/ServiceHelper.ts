import { Models } from "@models";
import { Connection, ConnectionOptions, createConnection, getConnection } from "typeorm";
import { CoreRepository } from "../repository";

const typeConfig: ConnectionOptions = {
  name: "configConnection",
  // type: "sqlite",
  // database: `data.sqlite`,
  type: "mongodb",
  // host: "localhost",
  host: "azure.kadirnacar.com",
  port: 27017,
  useUnifiedTopology: true,
  database: "brekbrek",
  // synchronize: true,
  logging: false,
  entities: Object.keys(Models).map((itm) => Models[itm]),
};

export const getRepository = async (entityName: string) => {
  let connection: Connection;
  try {
    connection = await getConnection("configConnection");
    if (!connection || !connection.isConnected) {
      connection = await createConnection(typeConfig);
    }
  } catch (err) {
    try {
      connection = await createConnection(typeConfig);
    } catch (err) {
      console.log(err);
    }
  }
  return new CoreRepository(entityName);
};
