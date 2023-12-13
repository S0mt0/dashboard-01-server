import { StatusCodes as status } from "http-status-codes";
import { APIResponse } from "../../types";
export class CustomError extends Error {
  constructor(
    public data: APIResponse,
    public statusCode: number = status.BAD_REQUEST,
    message?: string
  ) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
    this.data = data;
  }
}
