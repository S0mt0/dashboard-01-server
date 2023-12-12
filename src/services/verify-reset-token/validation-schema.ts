import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const tokenPayload = {
  otp: Joi.string().required(),
};
