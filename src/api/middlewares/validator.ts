import { NextFunction, Response } from "express";
import Joi from "joi";
import { CustomRequest } from "../../types";
import { errorResponse } from "../../utils";

export const validate =
  (fields: Record<string, any>) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys(fields).required().unknown(false);

    const requestBody = req.method == "GET" ? req.query : req.body;
    const { error, value } = schema.validate(requestBody);

    if (error)
      errorResponse({
        message: "Please provide all required fields in their correct format",
        data: error,
      });

    req.form = { ...req.form, ...value };

    next();
  };
