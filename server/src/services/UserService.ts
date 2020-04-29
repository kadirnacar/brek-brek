import { User } from "@models";
import * as bcrypt from "bcryptjs";
import { BaseActions } from "./BaseService";

export class UserService extends BaseActions<User> {
  constructor() {
    super(User);
  }

  public async getUser(username: string): Promise<User> {
    return await this.getItem({ where: { Username: username } });
  }

  public async checkIfUnencryptedPasswordIsValid(
    crytpedPassword: string,
    unencryptedPassword: string
  ) {
    var result = await bcrypt.compareSync(unencryptedPassword, crytpedPassword);
    return result;
  }
}