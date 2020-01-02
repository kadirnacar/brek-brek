import { BaseModel } from "./utils/BaseModel";

export class User extends BaseModel {
    Name?: string ;
    Username?: string;
    Password?: string ;
    Email?: string ;
    Type?: "Admin" | "User" | "Facebook" | "Google" | "Anonymous" = "User";
}
