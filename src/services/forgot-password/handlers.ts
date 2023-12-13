import Jwt from "jsonwebtoken";
import { StatusCodes, StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse, mail, toolkit } from "../../sdk/utils";
import {
  TPasswordResetPayload,
  TPasswordResetRequestPayload,
} from "../../types/services/user";

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

export const resetPassword = async (
  payload: TPasswordResetPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const authHeader =
    req.headers?.authorization || (req.headers?.Authorization as string);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorResponse({ message: "No access token provided" }, status.UNAUTHORIZED);
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

  const accessToken = UserLib.getAccessToken(sessionUser);
  const refreshToken = UserLib.getRefreshToken(sessionUser);

  return {
    message: "Password successfully updated",
    data: {
      accessToken,
      refreshToken,
    },
    statusCode: status.OK,
  };
};
