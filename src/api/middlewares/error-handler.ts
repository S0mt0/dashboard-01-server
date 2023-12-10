import { NextFunction, Response, Request } from "express";
import { StatusCodes as status } from "http-status-codes";

import { CustomError } from "../";

export const ErrorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    "[API ERROR]: ",
    err,
    "TIMESTAMP: ",
    new Date().toLocaleTimeString()
  );

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ success: false, ...err.data });
  }

  return res
    .status(status.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: err.message });
};
