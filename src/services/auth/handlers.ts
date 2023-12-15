import { StatusCodes as status } from "http-status-codes";

import { CustomRequest, ServiceResponse } from "../../types";
import { IUser } from "../../sdk/database/mongodb/types/user";
import { UserLib } from "../../sdk/database/mongodb/config";
import { errorResponse } from "../../setup";

export const signUpHandler = async (
  payload: IUser
): Promise<ServiceResponse> => {
  const user = await UserLib.addDoc(
    payload,
    { email: payload.email },
    "This email is already in use, please login or use a different email address."
  );

  return {
    data: user,
    message: "Sign up successful",
    statusCode: status.CREATED,
  };
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
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    errorResponse(null, status.UNAUTHORIZED);
  }

  const isSignedOut = await UserLib.verifySignOut(token);

  if (!isSignedOut)
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

export const refreshTokenHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const refresh_token = req.cookies?.refresh_token;

  if (!refresh_token) errorResponse(null, status.UNAUTHORIZED);

  const sessionUser = await UserLib.findOneDoc(
    { refreshToken: refresh_token },
    "refreshToken"
  );
  if (!sessionUser) errorResponse(null, status.FORBIDDEN);

  const accessToken = await UserLib.getAccessToken(sessionUser);

  return { data: { accessToken }, statusCode: status.OK };
};
