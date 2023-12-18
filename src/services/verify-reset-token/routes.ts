import { Router } from "express";
import { validate, controller } from "../../setup";
import { tokenPayload } from "./validation-schema";
import * as _ from "./handlers";

/**
 * Route for validating reset password token
 * @returns Routes
 */

export default (router: Router) => {
  router.post(
    "/verify-token",
    validate(tokenPayload),
    controller(_.verifyTokenHandler)
  );

  router.get("/resend-otp", controller(_.resendTokenHandler));
};
