"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetPayload = exports.PasswordResetRequestPayload = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
exports.PasswordResetRequestPayload = {
    email: joi_1.default.string().email(),
};
exports.PasswordResetPayload = {
    newPassword: (0, joi_password_complexity_1.default)().required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("newPassword")).required(),
};
//# sourceMappingURL=validation-schema.js.map