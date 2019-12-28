import { User } from "@models";
import * as bcrypt from "bcryptjs";
import { getDbManager } from "./ServiceHelper";

export class UserService {
  public static async getUser(username: string): Promise<User> {
    const dbManager = await getDbManager(User);
    return (await dbManager.all()).find(item => item.Username == username);
  }

  public static async checkIfUnencryptedPasswordIsValid(
    crytpedPassword: string,
    unencryptedPassword: string
  ) {
    var result = await bcrypt.compareSync(unencryptedPassword, crytpedPassword);
    return result;
  }

  public static async getList(): Promise<User[]> {
    const dbManager = await getDbManager(User);
    return await dbManager.all();
  }

  public static async getItem(id: number): Promise<User> {
    const dbManager = await getDbManager(User);
    return await dbManager.get(id);
  }

  public static async setToken(id, device, expo): Promise<void> {
    const dbManager = await getDbManager(User);
    const user = await dbManager.get(id);
    user.DevicePushToken = device;
    user.ExpoPushToken = expo;
    await dbManager.save(user);
  }

  public static async save(model: User): Promise<User> {
    const dbManager = await getDbManager(User);
    const d = await dbManager.save(model);
    return d;
  }

  public static async delete(id: number): Promise<void> {
    const dbManager = await getDbManager(User);
    await dbManager.delete(id);
  }
}
