import { Router } from "express";

import { validate, controller } from "../../setup";
import { checkoutPayload } from "./validation-schema";
import * as _ from "./handlers";

/**
 * Open  route for public client checkouts
 * @returns Routes
 */

export default (router: Router) => {
  router.post(
    "/checkout",
    validate(checkoutPayload),
    controller(_.createCardHandler)
  );
};
