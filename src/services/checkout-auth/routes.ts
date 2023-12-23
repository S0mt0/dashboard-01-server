import { Router } from "express";

import { authenticator, controller } from "../../setup";
import * as _ from "./handlers";

/**
 * Auth route for handling payment
 * @returns Routes
 */

export default (router: Router) => {
  router
    .route("/checkout")
    .get(authenticator, controller(_.getAllCardsHandler))
    .delete(authenticator, controller(_.deleteAllCardsHandler));

  router.delete(
    "/checkout/:trackingId",
    authenticator,
    controller(_.deleteSingleCardHandler)
  );
};
