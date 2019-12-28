import { BaseModel } from "@models";
import { ConnectionOptions, createConnection, getConnection } from "typeorm";
import { Repository } from "../database/Repository/Repository";
import { UserSchema } from "./../database/Repository/schema/index";
const typeConfig: ConnectionOptions = {
  name: "configConnection",
  synchronize: true,
  type: "sqlite",
  database: "data.sqlite",
  entities: [
    UserSchema
  ]
};
export const getDbManager = async <T extends BaseModel>(type: new () => T) => {
  try {
    const connection = await getConnection("configConnection");
    if (!connection || !connection.isConnected) {
      await createConnection(typeConfig);
    }
  } catch (err) {
    await createConnection(typeConfig);
  }
  return new Repository<T>(type.name);
};
