import { Router } from "express";
import authentication from "../../modules/auth/routes";

const router = Router();

export default () => {
  authentication(router);

  return router;
};
