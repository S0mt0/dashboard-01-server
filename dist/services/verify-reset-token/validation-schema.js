"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenPayload = void 0;
const joi_1 = __importDefault(require("joi"));
exports.tokenPayload = joi_1.default.object({
    otp: joi_1.default.string().required(),
});
//# sourceMappingURL=validation-schema.js.map