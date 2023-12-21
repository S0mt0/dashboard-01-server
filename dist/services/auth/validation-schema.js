"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInPayload = exports.signUpPayload = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
exports.signUpPayload = {
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().required(),
    password: (0, joi_password_complexity_1.default)(),
};
exports.signInPayload = {
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string(),
};
//# sourceMappingURL=validation-schema.js.map