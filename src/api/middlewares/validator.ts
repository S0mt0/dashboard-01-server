import { NextFunction, Response } from "express";
import Joi from "joi";
import { StatusCodes as status } from "http-status-codes";

import { CustomRequest } from "../../types";
import { errorResponse } from "../../sdk/utils";

export const validate =
  (fields: Record<string, any>) =>
  (req: CustomRequest, _: Response, next: NextFunction) => {
    const schema = Joi.object().keys(fields).required().unknown(false);

    const requestBody = req.method == "GET" ? req.query : req.body;
    const { error, value } = schema.validate(requestBody, {
      abortEarly: false,
    });

    if (error)
      errorResponse(
        {
          message: "Please provide all required fields in their correct format",
          data: error,
        },
        status.BAD_REQUEST
      );

    req.form = { ...req.form, ...value };

    next();
  };
