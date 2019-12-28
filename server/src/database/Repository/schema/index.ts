import { User } from '@models';
import { BaseSchema } from './BaseSchema';

export const UserSchema: BaseSchema<User> = new BaseSchema<User>(User, {
    name: "Users",
    columns: {
        Username: { type: "nvarchar", nullable: true },
        Password: { type: "nvarchar", nullable: true },
        Name: { type: "nvarchar", nullable: true },
        Email: { type: "nvarchar", nullable: true },
        DevicePushToken: { type: "nvarchar", nullable: true },
        ExpoPushToken: { type: "nvarchar", nullable: true },
        Type: { type: "nvarchar", nullable: true, default: "User" }
    },
    relations: {

    }
});