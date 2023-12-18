import { Router } from "express";

import { validate, controller, authenticator } from "../../setup";
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
    .delete(authenticator, controller(_.deleteAllShipmentHandler))
    .get(authenticator, controller(_.getAllShipmentHandler))
    .post(
      authenticator,
      validate(shipmentPayload),
      controller(_.createShipmentHandler)
    );

  router
    .route("/:trackingId")
    .get(authenticator, controller(_.getSingleShipmentHandler))
    .patch(
      authenticator,
      validate(shipmentPayload),
      controller(_.updateSingleShipmentHandler)
    )
    .delete(authenticator, controller(_.deleteSingleShipmentHandler));
};
