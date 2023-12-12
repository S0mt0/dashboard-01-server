import Jwt from "jsonwebtoken";
import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse, mail, toolkit } from "../../sdk/utils";
import {
  TPasswordResetPayload,
  TResetTokenPayload,
} from "../../types/services/user";

/**
 * Verifies the token or OTP sent from a user when resetting password
 * @returns access token
 */

export const verifyToken = async (
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

  if (payload.otp !== decoded?.otp) {
  }

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
    message: "Choose a new password",
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
