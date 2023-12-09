import { Response, Request } from "express";

import { CustomRequest, ServiceResponse } from "../../types";
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

    return response(res, data, data.statusCode);
  };
