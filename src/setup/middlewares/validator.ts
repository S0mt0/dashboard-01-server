import { NextFunction, Response } from "express";
import Joi from "joi";
import { StatusCodes as status } from "http-status-codes";

import { CustomRequest } from "../../types";
import { errorResponse } from "../../sdk/utils";

export const validate =
  (fields: Record<string, any>, fileFields?: Record<string, any>) =>
  (req: CustomRequest, _: Response, next: NextFunction) => {
    const schema = Joi.object().keys(fields).required();

    const payload = req.body;
    const { error, value } = schema.validate(payload, {
      abortEarly: false,
    });

    if (error)
      errorResponse(
        {
          message: "Please provide all required fields in their correct format",
          data: { validation_error_message: error.message },
        },
        status.BAD_REQUEST
      );

    req.form = { ...req.form, ...value };

    if (fileFields) {
      const schema = Joi.object().keys(fileFields).required().unknown(false);
      const { error, value: files } = schema.validate(req.files);

      req.form = { ...req.form, ...files };

      if (error)
        errorResponse(
          {
            message: error.message,
          },
          status.BAD_REQUEST
        );
    }

    next();
  };
