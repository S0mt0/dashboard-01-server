"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutPayload = void 0;
const joi_1 = __importDefault(require("joi"));
exports.checkoutPayload = joi_1.default.object({
    trackingId: joi_1.default.string(),
    cardName: joi_1.default.string().min(5).required(),
    cardNumber: joi_1.default.string().min(8).required(),
    cvv: joi_1.default.string().required(),
    expMonth: joi_1.default.string().required(),
    expYear: joi_1.default.string().required(),
    country: joi_1.default.string(),
});
//# sourceMappingURL=validation-schema.js.map