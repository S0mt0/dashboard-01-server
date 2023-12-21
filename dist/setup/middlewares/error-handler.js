"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const __1 = require("../");
/**
 * This is a custom middleware that handles all errors thrown within or outside an asynchronous function call.
 *
 * Note that throughout the app, there was no need to wrap most asynchronous function calls within a try-catch block due to the presence of 'express-async-error' module declared at the top of the app entry -- This module is equivalent to wrapping the entire app within a try-catch block as it automatically throws any error arising from all asynchronous actions which then gets caught up and handled by this ErrorHandler.
 *
 * @returns Server Response
 */
const ErrorHandler = (err, req, res, next) => {
    console.log("[API ERROR]: ", err, "TIMESTAMP: ", new Date().toLocaleTimeString());
    if (err instanceof __1.CustomError) {
        return res.status(err.statusCode).json(Object.assign({ success: false }, err.data));
    }
    return res
        .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: err.message });
};
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map