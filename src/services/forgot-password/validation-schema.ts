import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const PasswordResetRequestPayload = Joi.object({
  email: Joi.string().email(),
});

export const PasswordResetPayload = Joi.object({
  newPassword: passwordComplexity().required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
