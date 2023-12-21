"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        minLength: [3, "Username must not be less than 3 characters."],
        maxLength: [30, "Username must not be more than 30 characters."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        match: [
            /^(?!\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email address",
        ],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        type: String,
        default: "https://avatars.githubusercontent.com/u/15474343?v=4",
    },
    otp: {
        code: Number,
        expiresAt: Number,
    },
    refreshToken: {
        type: String,
        select: false,
    },
}, { timestamps: true });
// Hash password before saving to database
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        // If the password is not modified, move to the next middleware
        return next();
    }
    this.password = await bcrypt_1.default.hash(this.password, 10);
});
// Exclude the entire 'otp' property by default
// UserSchema.set("toObject", {
//   transform: function (doc, ret) {
//     delete ret.otp;
//     return ret;
//   },
//   versionKey: false,
// });
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt_1.default.compare(candidatePassword, this.password);
};
UserSchema.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ userID: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};
exports.User = mongoose_1.default.model("User", UserSchema);
exports.default = UserSchema;
//# sourceMappingURL=user.js.map