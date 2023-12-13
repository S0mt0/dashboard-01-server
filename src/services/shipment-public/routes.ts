import { Router } from "express";

import { validate, controller } from "../../setup";
import * as _ from "./handlers";

/**
 * Public routes for general users (consumers) to get a singlr shipment detail
 * @unprotected
 * @returns Routes
 */

export default (router: Router) => {
  router.route("/tracking").get(controller(_.getSingleShipmentHandler));
};
