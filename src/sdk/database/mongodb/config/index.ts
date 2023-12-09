import { DbLib } from "../../../classes";
import { User } from "../models";
import { IUserMethods, UserDoc, UserModel } from "../types/user";

export const UserLib = new DbLib<UserDoc, IUserMethods, UserModel>(
  User,
  "User"
);
