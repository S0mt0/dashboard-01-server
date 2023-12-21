"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const setup_1 = require("../../setup");
/**
 * Verify if user has correct access to resources that they try to access.
 *
 * The middleware checks if there is an access token present in the headers of their request, that must also start with "Bearer " keyword.
 *
 * This is especially used when requested resources are unique to indiviual users i.e Users will be allowed to retrieve only data or resources that they create.
 * @function
 * @param req
 * @param res
 * @param next
 *
 * @yields If verification is successful, it attaches a "userID" value to the request body
 */
const authenticator = (req, res, next) => {
    var _a, _b;
    const authHeader = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || ((_b = req.headers) === null || _b === void 0 ? void 0 : _b.Authorization);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        (0, setup_1.errorResponse)({ message: "No access token provided" }, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const accessToken = authHeader.split(" ")[1];
    const sessionUser = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!sessionUser) {
        (0, setup_1.errorResponse)({
            message: "Your session expired. Please re-login or refresh your browser",
        }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    req.user = { userID: sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.userID };
    next();
};
exports.authenticator = authenticator;
//# sourceMappingURL=authenticator.js.map