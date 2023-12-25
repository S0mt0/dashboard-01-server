import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const signUpPayload = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: passwordComplexity(),
});

export const signInPayload = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string(),
});
