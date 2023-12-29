"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendTokenHandler = exports.verifyTokenHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../sdk/database/mongodb/config");
const setup_1 = require("../../setup");
const lib_1 = require("../../sdk/lib");
/**
 * Verifies the token or OTP sent from a user when resetting password
 * @returns access token
 */
const verifyTokenHandler = async (payload, req) => {
    const reset_token = req.cookies.reset_token;
    if (!reset_token) {
        (0, setup_1.errorResponse)({ message: "Session expired" }, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const decoded = jsonwebtoken_1.default.verify(reset_token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const sessionUser = await config_1.UserLib.findOneDoc({
        email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
    });
    if (!sessionUser) {
        (0, setup_1.errorResponse)({
            message: `No account found for ${sessionUser.email}`,
        }, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    if (+sessionUser.otp.code !== +payload.otp) {
        (0, setup_1.errorResponse)({
            message: "That code was not a match. Try again",
        });
    }
    if (sessionUser.otp.expiresAt <= Date.now()) {
        (0, setup_1.errorResponse)({
            message: "Sorry, that code expired. Try again.",
        });
    }
    sessionUser.otp.code = null;
    sessionUser.otp.expiresAt = null;
    await sessionUser.save();
    const reset_access_token = jsonwebtoken_1.default.sign({ userID: sessionUser._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    return {
        message: "Create a new password",
        data: { reset_access_token },
        clearCookies: true,
        cookies: {
            cookieName: "reset_token",
            cookieOptions: {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            },
        },
    };
};
exports.verifyTokenHandler = verifyTokenHandler;
const resendTokenHandler = async (payload, req) => {
    var _a;
    const reset_token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.reset_token;
    if (!reset_token) {
        (0, setup_1.errorResponse)({ message: "Session expired" }, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const decoded = jsonwebtoken_1.default.verify(reset_token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const sessionUser = await config_1.UserLib.findOneDoc({
        email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
    });
    if (!sessionUser) {
        (0, setup_1.errorResponse)({
            message: `No account found for ${sessionUser.email}`,
        }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const { code, expiresAt } = lib_1.toolkit.getRandomNumbers();
    // Attach "otp" property to user and save to database
    sessionUser.otp = {
        code,
        expiresAt,
    };
    await sessionUser.save();
    const { html, text } = lib_1.mail.pass.resetPasswordMailContent({
        username: sessionUser.username,
        otp: code,
    });
    // Send a mail to the user containing the generated token
    await lib_1.mail.sendNodemailer({
        html,
        to: sessionUser.email,
        subject: `[${code}] Reset your password`,
        text,
    });
    /** Obscure email */
    const obscuredEmail = lib_1.toolkit.obscureEmail(sessionUser.email);
    return {
        message: `A new code has been sent to ${obscuredEmail}.`,
    };
};
exports.resendTokenHandler = resendTokenHandler;
//# sourceMappingURL=handlers.js.map