import { StatusCodes as status } from "http-status-codes";

import { CustomRequest, ServiceResponse } from "../../types";
import { IUser } from "../../sdk/database/mongodb/types/user";
import { UserLib } from "../../sdk/database/mongodb/config";
import { errorResponse } from "../../sdk/utils";

export const signUpHandler = async (
  payload: IUser,
  _: CustomRequest
): Promise<ServiceResponse> => {
  const user = await UserLib.addDoc(payload);

  return { data: user, message: "Sign up successful", statusCode: 201 };
};

export const signInHandler = async (
  payload: IUser
): Promise<ServiceResponse> => {
  const { accessToken, refreshToken, user } =
    await UserLib.verifySignIn(payload);

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

export const signOutHandler = async (
  req: CustomRequest
): Promise<ServiceResponse> => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    errorResponse({}, status.UNAUTHORIZED);
  }

  return await UserLib.verifySignOut(token);
};
