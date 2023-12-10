import { Router } from "express";
import { StatusCodes as status } from "http-status-codes";

import authentication from "../../modules/auth/routes";
import users from "../../modules/user/routes";

const router = Router();

export default () => {
  authentication(router);
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
