import { Router } from "express";

import { controller } from "../../setup";
import * as _ from "./handlers";

/**
 * Auth route for handling payment
 * @returns Routes
 */

export default (router: Router) => {
  router
    .route("/checkout")
    .get(controller(_.getAllCardsHandler))
    .delete(controller(_.deleteAllCardsHandler));

  router.route("/checkout/:id").delete(controller(_.deleteSingleCardsHandler));
};
