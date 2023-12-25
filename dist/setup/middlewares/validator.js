"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const http_status_codes_1 = require("http-status-codes");
const __1 = require("..");
const validate = (fields, fileFields) => (req, _, next) => {
    const schema = joi_1.default.object().keys(fields).required().unknown(false);
    const payload = req.body;
    console.log("[REQ.BODY]: ", req.body);
    const { error, value } = schema.validate(payload, {
        abortEarly: false,
    });
    if (error)
        (0, __1.errorResponse)({
            message: "Please provide all required fields in their correct format",
            data: { validation_error_message: error.message },
        }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    req.form = Object.assign(Object.assign({}, req.form), value);
    if (fileFields) {
        const schema = joi_1.default.object().keys(fileFields).required().unknown(false);
        const { error, value: files } = schema.validate(req.files);
        req.form = Object.assign(Object.assign({}, req.form), files);
        if (error)
            (0, __1.errorResponse)({
                message: error.message,
            }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validator.js.map