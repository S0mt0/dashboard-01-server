import { Router } from "express";
import { validate, controller } from "../../setup";
import { tokenPayload } from "./validation-schema";
import * as _ from "./handlers";

/**
 * Route for validating reset password token
 * @returns Routes
 */

export default (router: Router) => {
  router
    .route("/verify-token")
    .post(validate(tokenPayload), controller(_.verifyToken));
};
