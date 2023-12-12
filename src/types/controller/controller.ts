import { Request } from "express";

export interface CustomRequest extends Request {
  form: { [key: string]: any };
  user: { userID: string };
  files: File;
}
