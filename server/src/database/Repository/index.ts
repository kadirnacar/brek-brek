import { User } from '@models';
import { Repository } from "./Repository";

export const UserRepository: Repository<User> = new Repository<User>("User");