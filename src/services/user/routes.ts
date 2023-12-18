import { Router } from "express";
import { validate, controller, authenticator } from "../../setup";
import {
  ProfileUpdateRequestPayload,
  userFilePayload,
} from "./validation-schema";
import * as _ from "./handlers";

/**
 * Protected routes for user actions
 * @protected
 * @returns Routes
 */

export default (router: Router) => {
  router
    .route("/user")
    .get(authenticator, controller(_.getUserDataHandler))
    .patch(
      authenticator,
      validate(ProfileUpdateRequestPayload, userFilePayload),
      controller(_.updateUserHandler)
    )
    .delete(authenticator, controller(_.deleteAccountHandler));
};
