"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const db_lib_1 = require("./db-lib");
const setup_1 = require("../../setup");
/**
 * Class representing a User.
 * @class
 * @extends DbLib
 */
class User extends db_lib_1.DbLib {
    constructor(model, libName) {
        super(model, libName);
        this.model = model;
        this.libName = libName;
        this.verifySignIn = async (data) => {
            const userDoc = await this.findOneDoc({ email: data.email });
            if (!userDoc) {
                return (0, setup_1.errorResponse)({
                    message: "Invalid email or password",
                }, http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const isPasswordCorrect = await this.comparePasswords(data);
            if (!isPasswordCorrect) {
                (0, setup_1.errorResponse)({
                    message: "Invalid email or password",
                }, http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const accessToken = await this.getAccessToken(data);
            const refreshToken = await this.getRefreshToken(data);
            userDoc.refreshToken = refreshToken;
            await userDoc.save();
            return {
                accessToken,
                refreshToken,
                user: userDoc,
            };
        };
        this.getAccessToken = async (data, expiresIn) => {
            const userDoc = await this.findOneDoc({ email: data.email });
            if (!userDoc)
                return null;
            return jsonwebtoken_1.default.sign({ userID: userDoc._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
                expiresIn: expiresIn || process.env.JWT_ACCESS_TOKEN_EXPIRATION || "1h",
            });
        };
        this.getRefreshToken = async (data, expiresIn) => {
            const userDoc = await this.findOneDoc({ email: data.email });
            if (!userDoc)
                return null;
            return jsonwebtoken_1.default.sign({ userID: userDoc._id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
                expiresIn: expiresIn || process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d",
            });
        };
        this.comparePasswords = async (data) => {
            const userDoc = await this.findOneDoc({ email: data.email }, "+password");
            return await bcrypt_1.default.compare(data.password, userDoc.password);
        };
        this.verifyAccessToken = (token) => {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        };
        this.verifyRefreshToken = (token) => {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        };
        this.verifySignOut = async (token) => {
            const tokenPayload = this.verifyRefreshToken(token);
            const sessionUser = await this.findOneDoc({ _id: tokenPayload === null || tokenPayload === void 0 ? void 0 : tokenPayload.userID });
            if (!sessionUser)
                return false;
            sessionUser.refreshToken = "";
            await sessionUser.save();
            return true;
        };
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map