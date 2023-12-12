import { StatusCodes as status } from "http-status-codes";

import { CustomRequest, ServiceResponse } from "../../types";
import { IUser } from "../../sdk/database/mongodb/types/user";
import { UserLib } from "../../sdk/database/mongodb/config";
import { errorResponse } from "../../sdk/utils";

export const signUpHandler = async (
  payload: IUser
): Promise<ServiceResponse> => {
  const user = await UserLib.addDoc(payload);
  return {
    data: user,
    message: "Sign up successful",
    statusCode: status.CREATED,
  };
};

export const signInHandler = async (
  payload: IUser
): Promise<ServiceResponse> => {
  return await UserLib.verifySignIn(payload);
};

export const signOutHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const token = req.cookies?.refresh_token;

  if (!token) {
    errorResponse(null, status.UNAUTHORIZED);
  }
  return await UserLib.verifySignOut(token);
};

export const refreshTokenHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const refresh_token = req.cookies?.refresh_token;

  if (!refresh_token) errorResponse(null, status.UNAUTHORIZED);

  const sessionUser = await UserLib.findOneDoc({ refreshToken: refresh_token });
  if (!sessionUser) errorResponse(null, status.FORBIDDEN);

  const accessToken = await UserLib.getToken(sessionUser, "5m");

  return { data: { accessToken }, statusCode: status.OK };
};
