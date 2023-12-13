import { Router } from "express";
import { StatusCodes as status } from "http-status-codes";

import { authenticator } from "../../setup/middlewares/authenticator";

import authentication from "../../services/auth/routes";
import users from "../../services/user/routes";
import forgotPassword from "../../services/forgot-password/routes";
import shipment_auth from "../../services/shipment-auth/routes";
import shipment_public from "../../services/shipment-public/routes";
import forgot_password from "../../services/forgot-password/routes";
import verify_resetP_token from "../../services/verify-reset-token/routes";

const router = Router();

/**
 * @returns Routes and their Handlers
 * @summary Router
 */
export default () => {
  authentication(router);
  forgotPassword(router);
  shipment_public(router);
  forgot_password(router);
  verify_resetP_token(router);

  /** Protected routes */
  router.use(authenticator);
  users(router);
  shipment_auth(router);

  // catch all route handler
  router.use((_, res) => {
    return res.status(status.NOT_FOUND).send({
      message:
        "The resource you are searching for does not exist or has moved to a different route",
    });
  });

  return router;
};
