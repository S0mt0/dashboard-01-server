"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.resetUserPasswordRequestHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../sdk/database/mongodb/config");
const lib_1 = require("../../sdk/lib");
const setup_1 = require("../../setup");
const resetUserPasswordRequestHandler = async (payload, req) => {
    const user = await config_1.UserLib.findOneDoc(payload);
    if (!user) {
        (0, setup_1.errorResponse)({
            message: "Oops, it seams like that email is not registered with us. Try again.",
        });
    }
    const { code, expiresAt } = lib_1.toolkit.getRandomNumbers();
    // Attach "otp" property to user and save to database
    user.otp = {
        code,
        expiresAt,
    };
    await user.save();
    // const {
    //   resetMail: { html, text },
    // } = mail.pass.passwordResetMailContent({
    //   username: user.username,
    //   token: code,
    //   platform: "MyDashboard",
    // });
    const { html, text } = lib_1.mail.pass.resetPasswordMail({
        username: user.username,
        otp: code,
    });
    // Send a mail to the user containing the generated token
    await lib_1.mail.sendNodemailer({
        html,
        to: user.email,
        subject: `[${code}] Reset your password`,
        text,
    });
    const reset_token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    /** Obscure email */
    const obscuredEmail = lib_1.toolkit.obscureEmail(user.email);
    return {
        message: `Enter the code that was sent to ${obscuredEmail}.`,
        setCookies: true,
        cookies: {
            cookieName: "reset_token",
            cookieValue: reset_token,
            cookieOptions: {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            },
        },
    };
};
exports.resetUserPasswordRequestHandler = resetUserPasswordRequestHandler;
const resetPasswordHandler = async (payload, req) => {
    var _a, _b;
    const authHeader = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) ||
        ((_b = req.headers) === null || _b === void 0 ? void 0 : _b.Authorization);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        (0, setup_1.errorResponse)({ message: "No access token provided" }, http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const reset_token = authHeader.split(" ")[1];
    const authUser = jsonwebtoken_1.default.verify(reset_token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const sessionUser = await config_1.UserLib.findOneDoc({ _id: authUser === null || authUser === void 0 ? void 0 : authUser.userID });
    // Update user password with the new password
    sessionUser.password = payload.newPassword;
    await sessionUser.save();
    // const {
    //   feedbackMail: { html, text },
    // } = mail.pass.passwordResetMailContent({
    //   username: sessionUser.username,
    //   platform: "My-Dashboard",
    // });
    const { html, text } = lib_1.mail.pass.resetPasswordSuccessMail({
        username: sessionUser.username,
        timestamp: new Date(),
    });
    /**  Send a mail to the user notifying them of the password update */
    await lib_1.mail.sendNodemailer({
        html,
        to: sessionUser.email,
        subject: "Password Updated Successfully",
        text,
    });
    const accessToken = await config_1.UserLib.getAccessToken(sessionUser);
    const refreshToken = await config_1.UserLib.getRefreshToken(sessionUser);
    return {
        message: "Password updated successfully",
        data: {
            user: sessionUser,
            accessToken,
        },
        setCookies: true,
        cookies: {
            cookieName: "refresh_token",
            cookieValue: refreshToken,
            cookieOptions: {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: "none",
            },
        },
        statusCode: http_status_codes_1.StatusCodes.OK,
    };
};
exports.resetPasswordHandler = resetPasswordHandler;
//# sourceMappingURL=handlers.js.map