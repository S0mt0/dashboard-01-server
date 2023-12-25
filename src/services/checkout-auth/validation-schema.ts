import Joi from "joi";

export const checkoutPayload = Joi.object({
  trackingId: Joi.string(),
  cardName: Joi.string().min(5).required(),
  cardNumber: Joi.string().min(8).required(),
  cvv: Joi.string().required(),
  expMonth: Joi.string().required(),
  expYear: Joi.string().required(),
  country: Joi.string(),
});
