"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = exports.errorResponse = void 0;
const __1 = require("..");
const errorResponse = (data, statusCode) => {
    throw new __1.CustomError(data, statusCode);
};
exports.errorResponse = errorResponse;
const response = (res, data, statusCode = 200) => {
    console.log("[RESPONSE DATA] ", data);
    return res.status(statusCode).json(Object.assign({ success: true }, data));
};
exports.response = response;
//# sourceMappingURL=index.js.map