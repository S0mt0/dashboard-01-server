import { Router } from "express";
import { validate, controller } from "../../api";
import {
  ProfileUpdateRequestPayload,
  PasswordResetPayload,
  userFilePayload,
} from "./validation-schema";
import * as _ from "./services";
import { authenticator } from "../../api/middlewares/authenticator";

/**
 * Protected routes for user actions
 * @protected
 * @returns Routes
 */

export default (router: Router) => {
  // router.use(authenticator);
  router
    .route("/user/:id")
    .get(controller(_.getUserDataHandler))
    .patch(
      validate(ProfileUpdateRequestPayload, userFilePayload),
      controller(_.updateUserHandler)
    )
    .delete(controller(_.deleteAccountHandler));

  router
    .route("/user/reset-password")
    .get(controller(_.resetUserPasswordRequestHandler))
    .patch(
      validate(PasswordResetPayload),
      controller(_.resetUserPasswordHandler)
    );
};
