"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilePayload = exports.ProfileUpdateRequestPayload = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ProfileUpdateRequestPayload = {
    email: joi_1.default.string().email(),
    username: joi_1.default.string(),
    oldPassword: joi_1.default.string(),
    newPassword: joi_1.default.string().required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
};
exports.userFilePayload = {
    avatar: joi_1.default.object({
        filename: joi_1.default.string(),
        fieldName: joi_1.default.string().required(),
        originalFilename: joi_1.default.string().required(),
        path: joi_1.default.string().required(),
        headers: joi_1.default.object({
            "content-disposition": joi_1.default.string().required(),
            "content-type": joi_1.default.string()
                .valid("image/jpeg", "image/jpg", "image/gif", "image/png")
                .required(),
        }).required(),
        size: joi_1.default.number().max(5000000).required(),
        name: joi_1.default.string().required(),
        type: joi_1.default.string()
            .valid("image/jpeg", "image/jpg", "image/gif", "image/png")
            .required(),
        bytes: joi_1.default.number(),
    }),
};
//# sourceMappingURL=validation-schema.js.map