import { Router } from "express";
import { StatusCodes as status } from "http-status-codes";

import { authenticator } from "../../api/middlewares/authenticator";
import authentication from "../../services/auth/routes";
import users from "../../services/user/routes";
import forgotPassword from "../../services/forgot-password/routes";

const router = Router();

/**
 * @returns Routes and their Handlers
 * @summary Router
 */
export default () => {
  authentication(router);
  forgotPassword(router);

  /** Protected routes */
  router.use(authenticator);
  users(router);

  // catch all route handler
  router.use((_, res) => {
    return res.status(status.NOT_FOUND).send({
      message:
        "The resource you are searching for does not exist or has moved to a different route",
    });
  });

  return router;
};
