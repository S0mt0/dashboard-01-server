import { Router } from "express";
import { StatusCodes as status } from "http-status-codes";

import authentication from "../../services/auth/routes";
import users from "../../services/user/routes";
import forgotPassword from "../../services/forgot-password/routes";
import shipment_auth from "../../services/shipment-auth/routes";
import shipment_public from "../../services/shipment-public/routes";
import checkout_public from "../../services/checkout-public/routes";
import checkout_auth from "../../services/checkout-auth/routes";
import verify_resetP_token from "../../services/verify-reset-token/routes";

const router = Router();

/**
 * @returns Routes and their Handlers
 * @summary Router
 */
export default () => {
  shipment_public(router);
  checkout_public(router);
  authentication(router);
  forgotPassword(router);
  verify_resetP_token(router);

  /** Protected routes */
  users(router);
  shipment_auth(router);
  checkout_auth(router);

  /** Catch all route handler */
  router.use((_, res) => {
    return res.status(status.NOT_FOUND).send({
      message:
        "The resource you are searching for does not exist or has moved to a different route",
    });
  });

  return router;
};
