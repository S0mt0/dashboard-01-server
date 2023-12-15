import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { StatusCodes as status } from "http-status-codes";

import { DbLib } from "./db-lib";
import {
  IUserMethods,
  UserDoc,
  UserModel,
} from "../../sdk/database/mongodb/types/user";
import { errorResponse } from "../../setup";

/**
 * Class representing a User.
 * @class
 * @extends DbLib
 */

export class User extends DbLib<UserDoc, IUserMethods, UserModel> {
  constructor(
    protected model: UserModel,
    public libName: string
  ) {
    super(model, libName);
  }

  public verifySignIn = async (
    data: UserDoc
  ): Promise<{ accessToken: string; refreshToken: string; user: UserDoc }> => {
    const userDoc = await this.findOneDoc({ email: data.email });

    if (!userDoc) {
      return errorResponse(
        {
          message: "Invalid email or password",
        },
        status.UNAUTHORIZED
      );
    }

    const isPasswordCorrect = await this.comparePasswords(data);

    if (!isPasswordCorrect) {
      errorResponse(
        {
          message: "Invalid email or password",
        },
        status.UNAUTHORIZED
      );
    }

    const accessToken = await this.getAccessToken(data);
    const refreshToken = await this.getRefreshToken(data);

    userDoc.refreshToken = refreshToken;
    await userDoc.save();

    return {
      accessToken,
      refreshToken,
      user: userDoc,
    };
  };

  public getAccessToken = async (
    data: UserDoc,
    expiresIn?: string
  ): Promise<string | null> => {
    const userDoc = await this.findOneDoc({ email: data.email });

    if (!userDoc) return null;

    return jwt.sign(
      { userID: userDoc._id },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: expiresIn || process.env.JWT_ACCESS_TOKEN_EXPIRATION || "1h",
      }
    );
  };

  public getRefreshToken = async (
    data: UserDoc,
    expiresIn?: string
  ): Promise<string | null> => {
    const userDoc = await this.findOneDoc({ email: data.email });

    if (!userDoc) return null;

    return jwt.sign(
      { userID: userDoc._id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          expiresIn || process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d",
      }
    );
  };

  private comparePasswords = async (data: UserDoc): Promise<boolean> => {
    const userDoc = await this.findOneDoc({ email: data.email }, "password");

    return await bcrypt.compare(data.password, userDoc.password);
  };

  public verifyToken = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  public verifySignOut = async (token: string): Promise<boolean> => {
    const tokenPayload = this.verifyToken(token) as jwt.JwtPayload;

    const sessionUser = await this.findOneDoc({ _id: tokenPayload?.userID });

    if (!sessionUser) return false;

    sessionUser.refreshToken = "";
    await sessionUser.save();

    return true;
  };
}
