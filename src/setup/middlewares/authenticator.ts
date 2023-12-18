import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes as status } from "http-status-codes";

import { CustomRequest } from "../../types";
import { errorResponse } from "../../setup";

/**
 * Verify if user has correct access to resources that they try to access.
 *
 * The middleware checks if there is an access token present in the headers of their request, that must also start with "Bearer " keyword.
 *
 * This is especially used when requested resources are unique to indiviual users i.e Users will be allowed to retrieve only data or resources that they create.
 * @function
 * @param req
 * @param res
 * @param next
 *
 * @yields If verification is successful, it attaches a "userID" value to the request body
 */

export const authenticator = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers?.authorization || (req.headers?.Authorization as string);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorResponse({ message: "No access token provided" }, status.FORBIDDEN);
  }

  const accessToken = authHeader.split(" ")[1];

  const sessionUser = jwt.verify(
    accessToken,
    process.env.JWT_SECRET
  ) as jwt.JwtPayload;

  req.user = { userID: sessionUser?.userID };

  next();
};
