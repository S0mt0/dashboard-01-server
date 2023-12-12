import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const PasswordResetRequestPayload = {
  email: Joi.string().email(),
};

export const PasswordResetPayload = {
  newPassword: passwordComplexity().required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
};
