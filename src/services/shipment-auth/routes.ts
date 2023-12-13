import { Router } from "express";

import { validate, controller } from "../../setup";
import { shipmentPayload } from "./validation-schema";
import * as _ from "./handlers";

/**
 * Protected routes for shipment actions
 * @protected
 * @returns Routes
 */

export default (router: Router) => {
  // auth route for shipment actions
  router
    .route("/")
    .delete(controller(_.deleteAllShipmentHandler))
    .get(controller(_.getAllShipmentHandler))
    .post(validate(shipmentPayload), controller(_.createShipmentHandler));

  router
    .route("/:trackingId")
    .get(controller(_.getSingleShipmentHandler))
    .patch(validate(shipmentPayload), controller(_.updateSingleShipment))
    .delete(controller(_.deleteSingleShipment));
};
