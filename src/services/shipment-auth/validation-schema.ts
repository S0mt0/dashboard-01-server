import Joi from "joi";

const eventSchema = Joi.object({
  eventId: Joi.string().required(),
  timestamp: Joi.string().required(),
  location: Joi.object({
    address: Joi.object({
      addressLocality: Joi.string().required(),
    }).required(),
  }).required(),
  description: Joi.string().required(),
}).unknown(true);

export const shipmentPayload = Joi.object({
  belongsTo: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    checkout: Joi.boolean(),
  }),

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
  })
    .required()
    .unknown(true),
  events: Joi.array().items(eventSchema).required(),
}).unknown(true);
