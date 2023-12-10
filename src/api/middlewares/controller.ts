import { Response } from "express";

import { APIResponse, CustomRequest, ServiceResponse } from "../../types";
import { response } from "../../sdk/utils";

export const controller =
  (
    fn: (
      payload: { [key: string]: any },
      req: CustomRequest
    ) => Promise<ServiceResponse>
  ) =>
  async (req: CustomRequest, res: Response) => {
    const payload = req.form;
    const data = await fn(payload, req);

    if (data.setCookies && Object.values(data.cookies).length) {
      res.cookie(
        data.cookies.cookieName,
        data.cookies.cookieValue,
        data.cookies.cookieOptions
      );
    }

    if (data.clearCookies && Object.values(data.cookies).length) {
      res.clearCookie(data.cookies.cookieName, data.cookies.cookieOptions);
    }

    const responsePayload: APIResponse = {
      data: data.data,
      message: data.message,
    };

    return response(res, responsePayload, data.statusCode);
  };
