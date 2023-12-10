import { Router } from "express";
import authentication from "../../modules/auth/routes";
import { StatusCodes as status } from "http-status-codes";

const router = Router();

export default () => {
  authentication(router);

  // catch all route handler
  router.use((_, res) => {
    return res.status(status.NOT_FOUND).send({
      message:
        "The resource you are searching for does not exist or has moved to a different route",
    });
  });

  // --------------------------
  return router;
};
