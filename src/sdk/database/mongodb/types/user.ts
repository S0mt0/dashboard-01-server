import { Document, Model, InferSchemaType } from "mongoose";
import UserSchema from "../models/user";

// export type IUser = InferSchemaType<typeof UserSchema>;

export interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;

  [key: string]: any;
}

export interface UserDoc extends Partial<Document>, IUser {}

export type UserModel = Model<UserDoc, {}, IUserMethods>;

// export interface UserModel extends Model<UserDoc> {}

export interface IUserMethods {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createJWT: () => string;
}
