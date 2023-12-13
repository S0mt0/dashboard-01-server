import { CookieOptions } from "express";

interface Cookies {
  cookieName: string;
  cookieValue?: string;
  cookieOptions: CookieOptions;
}

export interface ServiceResponse {
  message?: string;
  data?: Record<string, any>;
  statusCode?: number;

  setCookies?: boolean;
  clearCookies?: boolean;
  cookies?: Cookies;
}

export type APIResponse = Pick<ServiceResponse, "message" | "data">;
