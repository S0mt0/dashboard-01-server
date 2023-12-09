import { Router } from "express";
import { validate, controller } from "../../api";
import { signUp } from "./validation-schema";
import * as auth from "./services";

export default (router: Router) => {
  router.post("/auth/sign-up", validate(signUp), controller(auth.signUp));
};
