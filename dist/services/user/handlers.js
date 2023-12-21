"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountHandler = exports.updateUserHandler = exports.getUserDataHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../sdk/database/mongodb/config");
const setup_1 = require("../../setup");
const config_2 = require("../../setup/config");
/**
 * Function used to retrieve a single user data, using the provided user Id.
 * @function
 * @param req
 * @returns User data
 */
const getUserDataHandler = async (payload, req) => {
    const sessionUserId = req.user.userID;
    const sessionUser = await config_1.UserLib.findOneDoc({ _id: sessionUserId });
    if (!sessionUser) {
        (0, setup_1.errorResponse)({ message: "User not found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return { data: sessionUser };
};
exports.getUserDataHandler = getUserDataHandler;
/**
 * Function used to update user profile.
 * @param {TProfileUpdateRequestPayload} payload
 * @param {CustomRequest} req
 * @return {*}  {Promise<ServiceResponse>}
 */
const updateUserHandler = async (payload, req) => {
    var _a, _b;
    const sessionUserId = req.user.userID;
    const sessionUser = await config_1.UserLib.findOneDoc({ _id: sessionUserId }, "+password");
    // First handle password reset if user provided new password
    if (payload.oldPassword && payload.newPassword) {
        const isAMatch = await bcrypt_1.default.compare(payload.oldPassword, sessionUser.password);
        if (!isAMatch) {
            (0, setup_1.errorResponse)({ message: "The current password you provided is not correct" }, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    // Handle avatar if provided by user
    const parts = (_a = sessionUser.avatar) === null || _a === void 0 ? void 0 : _a.split("/");
    const fileName = parts[(parts === null || parts === void 0 ? void 0 : parts.length) - 1].split(".")[0];
    const old_public_id = `Afrolay/${fileName}`;
    // TODO: Make this to a utility function.
    let avatar_url;
    let uploadResponse;
    if (payload.avatar &&
        typeof payload.avatar !== "string" &&
        ((_b = Object.keys(payload.avatar)) === null || _b === void 0 ? void 0 : _b.length)) {
        const { size } = payload.avatar;
        const id = Date.now();
        const public_id = `IMG_${id}_${size}`;
        uploadResponse = await config_2.cloudinary.uploader.upload(payload.avatar.path, {
            upload_preset: "afrolay",
            public_id,
        });
        avatar_url = uploadResponse.secure_url;
    }
    const data = {
        avatar: avatar_url,
        username: payload.username,
        email: payload.email,
        password: payload.newPassword,
    };
    const updatedUser = await config_1.UserLib.findAndUpdateDoc({ _id: sessionUserId }, Object.assign({}, data));
    // If updating the user in the database was unsuccessful, delete the newly uploaded image from cloudinary at once
    if (!updatedUser) {
        await config_2.cloudinary.uploader.destroy(uploadResponse.public_id, {
            invalidate: true,
            resource_type: "image",
            type: "authenticated",
        });
        (0, setup_1.errorResponse)({ message: "User not found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    // If updating the user in the database was successful, delete the old profile image from cloudinary at once
    await config_2.cloudinary.uploader.destroy(old_public_id, {
        invalidate: true,
        resource_type: "image",
        type: "authenticated",
    });
    return {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: { user: updatedUser },
        message: "Profile updated successfully",
    };
};
exports.updateUserHandler = updateUserHandler;
const deleteAccountHandler = async (payload, req) => {
    const sessionUserId = req.user.userID;
    const isDeleted = await config_1.UserLib.deleteDoc({ _id: sessionUserId });
    if (!isDeleted) {
        (0, setup_1.errorResponse)({ message: "User not found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return { statusCode: http_status_codes_1.StatusCodes.OK };
};
exports.deleteAccountHandler = deleteAccountHandler;
//# sourceMappingURL=handlers.js.map