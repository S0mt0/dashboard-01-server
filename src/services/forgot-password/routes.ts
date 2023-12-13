import { Router } from "express";
import { validate, controller } from "../../setup";
import {
  PasswordResetPayload,
  PasswordResetRequestPayload,
} from "./validation-schema";
import * as _ from "./handlers";

/**
 * Open route for password reset
 * @returns Routes
 */

export default (router: Router) => {
  router
    .route("/forgot-password")
    .post(
      validate(PasswordResetRequestPayload),
      controller(_.resetUserPasswordRequestHandler)
    )
    .patch(validate(PasswordResetPayload), controller(_.resetPassword));
};
