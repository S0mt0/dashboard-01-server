import { DbLib } from "../../../classes";
import { User } from "../models";
import { UserDoc, UserModel } from "../types/user";

export const UserLib = new DbLib<UserDoc, UserModel>(User, "User");
