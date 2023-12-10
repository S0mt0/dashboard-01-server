import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const ProfileUpdateRequestPayload = {
  email: Joi.string().email(),
  username: Joi.string(),
  avatar: Joi.string(),
};

export const PasswordResetPayload = {
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
};
