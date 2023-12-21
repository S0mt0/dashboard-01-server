"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const http_status_codes_1 = require("http-status-codes");
class CustomError extends Error {
    constructor(data, statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST, message) {
        super(message);
        this.data = data;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
        this.data = data;
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=index.js.map