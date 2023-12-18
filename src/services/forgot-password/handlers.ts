import Jwt from "jsonwebtoken";
import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import { mail, toolkit } from "../../sdk/lib";
import { errorResponse } from "../../setup";

import {
  CustomRequest,
  ServiceResponse,
  TPasswordResetPayload,
  TPasswordResetRequestPayload,
} from "../../types";

export const resetUserPasswordRequestHandler = async (
  payload: TPasswordResetRequestPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const user = await UserLib.findOneDoc({ email: payload.email });
  if (!user) {
    errorResponse({
      message:
        "Oops, it seams like that email is not registered with us. Try again.",
    });
  }

  const { code, expiresAt } = toolkit.getRandomNumbers();
  // Attach "otp" property to user and save to database
  user.otp = {
    code,
    expiresAt,
  };

  await user.save();

  const {
    resetMail: { html, text },
  } = mail.pass.passwordResetMailContent({
    username: user.username,
    token: code,
    platform: "My-Dashboard",
  });

  // Send a mail to the user containing the generated token
  await mail.sendNodemailer({
    html,
    to: user.email,
    subject: "PASSWORD RESET",
    text,
  });

  const reset_token = Jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  /** Obscure email */
  const obscuredEmail = toolkit.obscureEmail(user.email);

  return {
    message: `Enter the code that was sent to ${obscuredEmail}.`,
    setCookies: true,
    cookies: {
      cookieName: "reset_token",
      cookieValue: reset_token,
      cookieOptions: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      },
    },
  };
};

export const resetPasswordHandler = async (
  payload: TPasswordResetPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const authHeader =
    (req.headers?.authorization as string) ||
    (req.headers?.Authorization as string);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorResponse({ message: "No access token provided" }, status.FORBIDDEN);
  }

  const reset_token = authHeader.split(" ")[1];

  const authUser = Jwt.verify(
    reset_token,
    process.env.JWT_SECRET
  ) as Jwt.JwtPayload;

  const sessionUser = await UserLib.findOneDoc({ email: authUser.email });

  // Update user password with the new password
  sessionUser.password = payload.newPassword;
  await sessionUser.save();

  const {
    feedbackMail: { html, text },
  } = mail.pass.passwordResetMailContent({
    username: sessionUser.username,
    platform: "My-Dashboard",
  });

  /**  Send a mail to the user notifying them of the password update */
  await mail.sendNodemailer({
    html,
    to: sessionUser.email,
    subject: "PASSWORD RESET SUCCESSFUL",
    text,
  });

  const accessToken = await UserLib.getAccessToken(sessionUser);
  const refreshToken = await UserLib.getRefreshToken(sessionUser);

  return {
    message: "Password updated successfully",
    data: {
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
    statusCode: status.OK,
  };
};
