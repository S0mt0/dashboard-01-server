import { StatusCodes as status } from "http-status-codes";
import { UploadApiResponse } from "cloudinary";
import bcrypt from "bcrypt";

import { UserLib } from "../../sdk/database/mongodb/config";
import {
  CustomRequest,
  ServiceResponse,
  TProfileUpdateRequestPayload,
} from "../../types";
import { errorResponse } from "../../setup";
import { cloudinary } from "../../setup/config";

/**
 * Function used to retrieve a single user data, using the provided user Id.
 * @function
 * @param req
 * @returns User data
 */
export const getUserDataHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const sessionUserId = req.user.userID;

  const sessionUser = await UserLib.findOneDoc({ _id: sessionUserId });

  if (!sessionUser) {
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  return { data: sessionUser };
};

/**
 * Function used to update user profile.
 * @param {TProfileUpdateRequestPayload} payload
 * @param {CustomRequest} req
 * @return {*}  {Promise<ServiceResponse>}
 */
export const updateUserHandler = async (
  payload: TProfileUpdateRequestPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const sessionUserId = req.user.userID;
  const sessionUser = await UserLib.findOneDoc(
    { _id: sessionUserId },
    "+password"
  );

  // First handle password reset if user provided new password
  if (payload.oldPassword && payload.newPassword) {
    const isAMatch = await bcrypt.compare(
      payload.oldPassword,
      sessionUser.password
    );

    if (!isAMatch) {
      errorResponse(
        { message: "The current password you provided is not correct" },
        status.BAD_REQUEST
      );
    }
  }

  // Handle avatar if provided by user
  const parts = sessionUser.avatar?.split("/");
  const fileName = parts[parts?.length - 1].split(".")[0];
  const old_public_id = `Afrolay/${fileName}`;

  // TODO: Make this to a utility function.
  let avatar_url;
  let uploadResponse: UploadApiResponse;

  if (
    payload.avatar &&
    typeof payload.avatar !== "string" &&
    Object.keys(payload.avatar)?.length
  ) {
    const { size } = payload.avatar;
    const id = Date.now();

    const public_id = `IMG_${id}_${size}`;

    uploadResponse = await cloudinary.uploader.upload(payload.avatar.path, {
      upload_preset: "afrolay",
      public_id,
    });
    avatar_url = uploadResponse.secure_url;
  } else {
    avatar_url = sessionUser.avatar_url;
  }

  const data = {
    avatar: avatar_url,
    username: payload.username,
    email: payload.email,
    password: payload.newPassword,
  };

  if (avatar_url) sessionUser.avatar = avatar_url;
  if (payload.username) sessionUser.username = payload.username;
  if (payload.email) sessionUser.email = payload.email;
  if (payload.newPassword) sessionUser.password = payload.newPassword;

  await sessionUser.save();

  // If updating the user in the database was successful, delete the old profile image from cloudinary at once
  await cloudinary.uploader.destroy(old_public_id, {
    invalidate: true,
    resource_type: "image",
    type: "authenticated",
  });

  return {
    statusCode: status.OK,
    data: { user: sessionUser },
    message: "Profile updated successfully",
  };
};

export const deleteAccountHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const sessionUserId = req.user.userID;

  const isDeleted = await UserLib.deleteDoc({ _id: sessionUserId });

  if (!isDeleted) {
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  return { statusCode: status.OK };
};
