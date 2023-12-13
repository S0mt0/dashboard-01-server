import { Router } from "express";
import { validate, controller } from "../../setup";
import { signInPayload, signUpPayload } from "./validation-schema";
import * as auth from "./handlers";

/**
 * @public
 * @description Unprotected routes for authentication.
 * @returns Routes
 */
export default (router: Router) => {
  // sign-up route
  router.post(
    "/auth/sign-up",
    validate(signUpPayload),
    controller(auth.signUpHandler)
  );

  // login route
  router.post(
    "/auth/sign-in",
    validate(signInPayload),
    controller(auth.signInHandler)
  );

  // logout route
  router.post("/auth/sign-out", controller(auth.signOutHandler));

  // refresh-token route
  router.get("/auth/refresh-token", controller(auth.refreshTokenHandler));
};
