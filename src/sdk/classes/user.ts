import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { StatusCodes as status } from "http-status-codes";

import { DbLib } from "./db-lib";
import {
  IUserMethods,
  UserDoc,
  UserModel,
} from "../../sdk/database/mongodb/types/user";
import { errorResponse } from "../../sdk/utils";
import { ServiceResponse } from "types";

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

  public override addDoc = async (data: UserDoc): Promise<UserDoc> => {
    const userExists = await this.docExists({ email: data.email });

    if (userExists) {
      return errorResponse(
        {
          message: "This email has been registered before, please try again.",
        },
        status.CONFLICT
      );
    }

    const doc = await this.model.create(data);

    this.document = doc.toObject();

    return doc.toObject();
  };

  public verifySignIn = async (data: UserDoc): Promise<ServiceResponse> => {
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

    const accessToken = await this.getToken(data, "5m");
    const refreshToken = await this.getToken(data);

    userDoc.refreshToken = refreshToken;
    await userDoc.save();

    // return a userDoc without the password and refreshToken
    const user = await this.findOneDoc({ email: data.email }, "-refreshToken");

    return {
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
      setCookies: true,
      cookies: {
        cookieName: "refresh_token",
        cookieValue: refreshToken,
        cookieOptions: {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: "none",
        },
      },
    };
  };

  public getToken = async (
    data: UserDoc,
    expiresIn?: string
  ): Promise<string | null> => {
    const userDoc = await this.findOneDoc({ email: data.email });

    if (!userDoc) return null;

    return jwt.sign({ userID: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn || process.env.JWT_EXPIRATION || "1h",
    });
  };

  private comparePasswords = async (data: UserDoc): Promise<boolean> => {
    const userDoc = await this.findOneDoc({ email: data.email }, "password");

    return await bcrypt.compare(data.password, userDoc.password);
  };

  public verifyToken = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };

  public verifySignOut = async (token: string): Promise<ServiceResponse> => {
    const tokenPayload = this.verifyToken(token) as jwt.JwtPayload;

    const sessionUser = await this.findOneDoc({ _id: tokenPayload?.userID });

    if (!sessionUser) {
      return {
        clearCookies: true,
        cookies: {
          cookieName: "refresh_token",
          cookieOptions: {
            httpOnly: true,
            secure: true,
          },
        },
        statusCode: status.UNAUTHORIZED,
      };
    }

    sessionUser.refreshToken = "";
    sessionUser.save();

    return {
      clearCookies: true,
      cookies: {
        cookieName: "refresh_token",
        cookieOptions: {
          httpOnly: true,
          secure: true,
        },
      },
      statusCode: status.NO_CONTENT,
    };
  };
}
