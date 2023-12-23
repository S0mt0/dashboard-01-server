import Joi from "joi";

const eventSchema = {
  eventId: Joi.string().required(),
  timestamp: Joi.string().required(),
  location: Joi.object({
    address: Joi.object({
      addressLocality: Joi.string().required(),
    }).required(),
  }).required(),
  description: Joi.string().required(),
};

export const shipmentPayload = {
  belongsTo: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    checkout: Joi.boolean().required(),
  }).required(),

  trackingId: Joi.string().required(),

  origin: Joi.object({
    address: Joi.object({
      addressLocality: Joi.string().required(),
    }),
  }).required(),

  destination: Joi.object({
    address: Joi.object({
      addressLocality: Joi.string().required(),
    }),
  }).required(),

  status: Joi.object({
    timestamp: Joi.string().required(),
    location: Joi.object({
      address: Joi.object({
        addressLocality: Joi.string().required(),
      }).required(),
    }).required(),

    status: Joi.string()
      .valid("pending", "seized", "delivered", "shipping")
      .required(),

    description: Joi.string().required(),
    bill: Joi.number()
      .when("status", {
        is: "seized",
        then: Joi.number().required(),
      })
      .when("status", {
        not: "seized",
        then: Joi.optional(),
      }),
  }).required(),
  events: Joi.array().items(eventSchema).required(),
};
