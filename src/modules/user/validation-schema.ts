import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const ProfileUpdateRequestPayload = {
  email: Joi.string().email(),
  username: Joi.string(),
};

export const userFilePayload = {
  avatar: Joi.object({
    filename: Joi.string(),
    fieldName: Joi.string().required(),
    originalFilename: Joi.string().required(),
    path: Joi.string().required(),
    headers: Joi.object({
      "content-disposition": Joi.string().required(),
      "content-type": Joi.string()
        .valid("image/jpeg", "image/jpg", "image/gif", "image/png")
        .required(),
    }).required(),
    size: Joi.number().max(5000000).required(), // Max of 5 megabytes(MB) per profile image
    name: Joi.string().required(),
    type: Joi.string()
      .valid("image/jpeg", "image/jpg", "image/gif", "image/png")
      .required(),
    bytes: Joi.number(),
  }),
};

export const PasswordResetPayload = {
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
};
