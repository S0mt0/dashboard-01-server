import { Document, Model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  otp?: {
    code: number;
    expiresAt: number;
  };

  [key: string]: any;
}

export interface UserDoc extends Partial<Document>, IUser {}

export type UserModel = Model<UserDoc, {}, IUserMethods>;

export interface IUserMethods {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createJWT: () => string;
}
