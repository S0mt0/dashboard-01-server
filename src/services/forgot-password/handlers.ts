import Jwt from "jsonwebtoken";

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
        "Oops, it seams like that email is not registered in our database. Try again.",
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
    platform: "MyOhMy-Dashboard",
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

  /** Conceal email */
  const concealedEmail = user.email
    .split("@")[0]
    .slice(0, -3)
    .padEnd(user.email.length, "*");

  return {
    message: `Enter the code that was sent to ${concealedEmail}.`,
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
  // const user = await UserLib.findOneDoc({ email: payload.email });
  // if (!user) {
  //   errorResponse({
  //     message:
  //       "Oops, it seams like that email is not registered in our database. Try again.",
  //   });
  // }

  return {};
};
