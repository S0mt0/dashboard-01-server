import { NextFunction, Response, Request } from "express";
import { StatusCodes as status } from "http-status-codes";

import { CustomError } from "../";

/**
 * This is a custom middleware that handles all errors thrown within or outside an asynchronous function call.
 *
 * Note that throughout the app, there was no need to wrap most asynchronous function calls within a try-catch block due to the presence of 'express-async-error' module declared at the top of the app entry -- This module is equivalent to wrapping the entire app within a try-catch block as it automatically throws any error arising from all asynchronous actions which then gets caught up and handled by this ErrorHandler.
 *
 * @returns Server Response
 */
export const ErrorHandler = (
  err: Error,
  req: Request,
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
