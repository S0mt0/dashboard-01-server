import { User } from "../../../classes";
import { User as UserModel } from "../models";

export const UserLib = new User(UserModel, "User");
