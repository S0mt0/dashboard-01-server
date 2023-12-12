import { CookieOptions } from "express";

interface Cookies {
  cookieName: string;
  cookieValue?: string;
  cookieOptions: CookieOptions;
}

export interface ServiceResponse {
  message?: string;
  data?: string | Record<string, any> | boolean | number | Array<any> | null;
  statusCode?: number;

  setCookies?: boolean;
  clearCookies?: boolean;
  cookies?: Cookies;
}

export type APIResponse = Pick<ServiceResponse, "message" | "data">;
