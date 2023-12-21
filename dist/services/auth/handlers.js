"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHandler = exports.signOutHandler = exports.signInHandler = exports.signUpHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../sdk/database/mongodb/config");
const setup_1 = require("../../setup");
/**
 * Sign up new user
 * @param {IUser} payload
 * @returns {ServiceResponse} Returns status, message and sign-up data if the operation was successful
 */
const signUpHandler = async (payload) => {
    await config_1.UserLib.addDoc(payload, { email: payload.email }, "This email is associated with an account, please login or use a different email address.");
    return {
        message: "Registration successful. Please login",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
    };
};
exports.signUpHandler = signUpHandler;
const signInHandler = async (payload) => {
    const { accessToken, refreshToken, user } = await config_1.UserLib.verifySignIn(payload);
    return {
        message: "Login successful",
        data: {
            user,
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
    };
};
exports.signInHandler = signInHandler;
const signOutHandler = async (payload, req) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!token) {
        (0, setup_1.errorResponse)(null, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    await config_1.UserLib.verifySignOut(token);
    return {
        clearCookies: true,
        cookies: {
            cookieName: "refresh_token",
            cookieOptions: {
                httpOnly: true,
                secure: true,
            },
        },
        statusCode: http_status_codes_1.StatusCodes.NO_CONTENT,
    };
};
exports.signOutHandler = signOutHandler;
const refreshTokenHandler = async (payload, req) => {
    var _a;
    const refresh_token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!refresh_token)
        (0, setup_1.errorResponse)(null, http_status_codes_1.StatusCodes.FORBIDDEN);
    const sessionUser = await config_1.UserLib.findOneDoc({ refreshToken: refresh_token });
    if (!sessionUser)
        (0, setup_1.errorResponse)(null, http_status_codes_1.StatusCodes.FORBIDDEN);
    const accessToken = await config_1.UserLib.getAccessToken(sessionUser);
    return { data: { user: sessionUser, accessToken }, statusCode: http_status_codes_1.StatusCodes.OK };
};
exports.refreshTokenHandler = refreshTokenHandler;
//# sourceMappingURL=handlers.js.map