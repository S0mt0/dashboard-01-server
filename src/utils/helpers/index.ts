import { CustomError } from "api/errors";
import { Response } from "express";
import { APIResponse } from "types/services/utils";

export const errorResponse = (data: APIResponse, statusCode?: number) => {
  throw new CustomError(data, statusCode);
};

export const response = (
  res: Response,
  data: APIResponse,
  statusCode: number = 200
) => {
  console.log("[RESPONSE DATA] ", data);

  return res.status(statusCode).json({
    ...data,
    success: true,
  });
};
