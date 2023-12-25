import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const tokenPayload = Joi.object({
  otp: Joi.string().required(),
});
