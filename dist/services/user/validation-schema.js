"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilePayload = exports.ProfileUpdateRequestPayload = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ProfileUpdateRequestPayload = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().required(),
    oldPassword: joi_1.default.string(),
    newPassword: joi_1.default.string().when("oldPassword", {
        is: joi_1.default.exist(),
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.string(),
    }),
    confirmPassword: joi_1.default.string().when("newPassword", {
        is: joi_1.default.exist(),
        then: joi_1.default.string().valid(joi_1.default.ref("newPassword")).required(),
        otherwise: joi_1.default.string(),
    }),
});
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
        size: joi_1.default.number().max(5000000).required(), // Max of 5 megabytes(MB) per profile image
        name: joi_1.default.string().required(),
        type: joi_1.default.string()
            .valid("image/jpeg", "image/jpg", "image/gif", "image/png")
            .required(),
        bytes: joi_1.default.number(),
    }),
};
//# sourceMappingURL=validation-schema.js.map