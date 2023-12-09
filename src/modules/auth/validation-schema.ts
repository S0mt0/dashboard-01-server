import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const signUp = {
  email: Joi.string().email().required(),
  username: Joi.string(),
  password: passwordComplexity(),
};
