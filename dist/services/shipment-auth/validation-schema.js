"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentPayload = void 0;
const joi_1 = __importDefault(require("joi"));
const eventSchema = {
    eventId: joi_1.default.string().required(),
    timestamp: joi_1.default.string().required(),
    location: joi_1.default.object({
        address: joi_1.default.object({
            addressLocality: joi_1.default.string().required(),
        }).required(),
    }).required(),
    description: joi_1.default.string().required(),
};
exports.shipmentPayload = {
    belongsTo: joi_1.default.object({
        fullName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        country: joi_1.default.string().required(),
        checkout: joi_1.default.boolean().required(),
    }).required(),
    trackingId: joi_1.default.string().required(),
    origin: joi_1.default.object({
        address: joi_1.default.object({
            addressLocality: joi_1.default.string().required(),
        }),
    }).required(),
    destination: joi_1.default.object({
        address: joi_1.default.object({
            addressLocality: joi_1.default.string().required(),
        }),
    }).required(),
    status: joi_1.default.object({
        timestamp: joi_1.default.string().required(),
        location: joi_1.default.object({
            address: joi_1.default.object({
                addressLocality: joi_1.default.string().required(),
            }).required(),
        }).required(),
        status: joi_1.default.string()
            .valid("pending", "seized", "delivered", "shipping")
            .required(),
        description: joi_1.default.string().required(),
        bill: joi_1.default.number()
            .when("status", {
            is: "seized",
            then: joi_1.default.number().required(),
        })
            .when("status", {
            not: "seized",
            then: joi_1.default.optional(),
        }),
    }).required(),
    events: joi_1.default.array().items(eventSchema).required(),
};
//# sourceMappingURL=validation-schema.js.map