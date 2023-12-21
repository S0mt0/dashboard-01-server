"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const __1 = require("..");
const controller = (fn) => async (req, res) => {
    const payload = req.form;
    const data = await fn(payload, req);
    if (data.setCookies && Object.values(data.cookies).length) {
        res.cookie(data.cookies.cookieName, data.cookies.cookieValue, data.cookies.cookieOptions);
    }
    if (data.clearCookies && Object.values(data.cookies).length) {
        res.clearCookie(data.cookies.cookieName, data.cookies.cookieOptions);
    }
    const responsePayload = {
        data: data.data,
        message: data.message,
    };
    return (0, __1.response)(res, responsePayload, data.statusCode);
};
exports.controller = controller;
//# sourceMappingURL=index.js.map