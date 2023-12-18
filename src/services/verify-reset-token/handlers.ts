import Jwt from "jsonwebtoken";
import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import {
  CustomRequest,
  ServiceResponse,
  TResetTokenPayload,
} from "../../types";
import { errorResponse } from "../../setup";
import { mail, toolkit } from "../../sdk/lib";

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
    errorResponse({ message: "No or expired session" }, status.FORBIDDEN);
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
      status.FORBIDDEN
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
export const resendTokenHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const reset_token = req.cookies?.reset_token;

  if (!reset_token) {
    errorResponse({ message: "No or expired session" }, status.FORBIDDEN);
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

  const { code, expiresAt } = toolkit.getRandomNumbers();
  // Attach "otp" property to user and save to database
  sessionUser.otp = {
    code,
    expiresAt,
  };

  await sessionUser.save();

  const {
    resetMail: { html, text },
  } = mail.pass.passwordResetMailContent({
    username: sessionUser.username,
    token: code,
    platform: "My-Dashboard",
  });

  // Send a mail to the user containing the generated token
  await mail.sendNodemailer({
    html,
    to: sessionUser.email,
    subject: "PASSWORD RESET",
    text,
  });

  /** Obscure email */
  const obscuredEmail = toolkit.obscureEmail(sessionUser.email);

  return {
    message: `A new code has been sent to ${obscuredEmail}.`,
  };
};
