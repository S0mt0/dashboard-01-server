import { Response } from "express";
import { CustomError } from "..";
import { APIResponse } from "../../types";

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
    success: true,
    ...data,
  });
};
