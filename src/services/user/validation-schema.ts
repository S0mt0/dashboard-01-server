import Joi from "joi";

export const ProfileUpdateRequestPayload = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  oldPassword: Joi.string(),
  newPassword: Joi.string().when("oldPassword", {
    is: Joi.exist(),
    then: Joi.string().required(),
    otherwise: Joi.string(),
  }),
  confirmPassword: Joi.string().when("newPassword", {
    is: Joi.exist(),
    then: Joi.string().valid(Joi.ref("newPassword")).required(),
    otherwise: Joi.string(),
  }),
});

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
