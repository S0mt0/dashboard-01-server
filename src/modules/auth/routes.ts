import { Router } from "express";
import { validate, controller } from "../../api";
import { signInPayload, signUpPayload } from "./validation-schema";
import * as auth from "./services";

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

  /**
   * @todo Work on route for account verification
   */
  // router.post("/auth/verify", controller(auth.verifyHandler));
};
