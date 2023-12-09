import { Document, Model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UserDoc extends Document, IUser {}

export interface UserModel extends Model<UserDoc> {}

// const user:UserDoc={

// }
