import { StatusCodes as status } from "http-status-codes";

import {
  CustomRequest,
  ServiceResponse,
  TSignInPayload,
  TSignUpPayload,
} from "../../types";
import { IUser } from "../../sdk/database/mongodb/types/user";
import { UserLib } from "../../sdk/database/mongodb/config";
import { errorResponse } from "../../setup";

/**
 * Sign up new user
 * @param {IUser} payload
 * @returns {ServiceResponse} Returns status, message and sign-up data if the operation was successful
 */
export const signUpHandler = async (
  payload: TSignUpPayload
): Promise<ServiceResponse> => {
  const user = await UserLib.addDoc(
    payload,
    { email: payload.email },
    "This email is associated with an account, please login or use a different email address."
  );

  return {
    message: "Registration successful. Please login",
    statusCode: status.CREATED,
  };
};

export const signInHandler = async (
  payload: TSignInPayload
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
        // path: "/api/v1/auth/sign-in",
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

  await UserLib.verifySignOut(token);

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

  if (!refresh_token) errorResponse(null, status.FORBIDDEN);

  const sessionUser = await UserLib.findOneDoc(
    { refreshToken: refresh_token },
    "refreshToken"
  );
  if (!sessionUser) errorResponse(null, status.FORBIDDEN);

  const accessToken = await UserLib.getAccessToken(sessionUser);

  return { data: { accessToken }, statusCode: status.OK };
};
