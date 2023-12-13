import { Router } from "express";
import { validate, controller } from "../../setup";
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
    .get(controller(_.getUserDataHandler))
    .patch(
      validate(ProfileUpdateRequestPayload, userFilePayload),
      controller(_.updateUserHandler)
    )
    .delete(controller(_.deleteAccountHandler));
};
