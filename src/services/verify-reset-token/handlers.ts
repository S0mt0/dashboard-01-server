import Jwt from "jsonwebtoken";
import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import {
  CustomRequest,
  ServiceResponse,
  TResetTokenPayload,
} from "../../types";
import { errorResponse } from "../../sdk/utils";

/**
 * Verifies the token or OTP sent from a user when resetting password
 * @returns access token
 */

export const verifyTokenHandler = async (
  payload: TResetTokenPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const reset_token = req.cookies?.reset_token;

  if (!reset_token) {
    errorResponse({ message: "No or expired session" }, status.BAD_REQUEST);
  }

  const decoded = Jwt.verify(
    reset_token,
    process.env.JWT_SECRET
  ) as Jwt.JwtPayload;

  const sessionUser = await UserLib.findOneDoc({
    email: decoded?.email,
  });

  if (!sessionUser) {
    errorResponse(
      {
        message: `No account found for ${sessionUser.email}`,
      },
      status.NOT_FOUND
    );
  }

  if (sessionUser.otp.code !== payload.otp) {
    errorResponse({
      message: "That code was not a match. Try again.",
    });
  }

  if (sessionUser.otp.expiresAt <= Date.now()) {
    errorResponse({
      message: "Sorry, that code expired. Try again.",
    });
  }

  sessionUser.otp.code = null;
  sessionUser.otp.expiresAt = null;

  await sessionUser.save();

  const reset_access_token = Jwt.sign(
    { userID: sessionUser._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    message: "Create a new password",
    data: { reset_access_token },
    clearCookies: true,
    cookies: {
      cookieName: "reset_token",
      cookieOptions: {
        httpOnly: true,
        secure: true,
      },
    },
  };
};
