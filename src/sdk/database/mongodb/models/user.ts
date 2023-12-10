import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IUser, IUserMethods, UserDoc, UserModel } from "../types/user";

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
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
        "Invaliid email address",
      ],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },

    avatar: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/15474343?v=4",
    },

    refreshToken: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If the password is not modified, move to the next middleware
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  console.log("[PRE HASHED PASSWORD]: " + this.password);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

export const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export default UserSchema;
