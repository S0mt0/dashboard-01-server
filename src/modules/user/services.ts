import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse, mail, templates } from "../../sdk/utils";
import { TProfileUpdateRequestPayload } from "../../types/services/user";
import { cloudinary } from "../../api/config/cloudinary";
import { UploadApiResponse } from "cloudinary";

/**
 * Function used to retrieve a single user data, using the provided user Id.
 * @function
 * @param payload
 * @param req
 * @returns User data
 */
export const getUserDataHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const sessionUserId = req.user.userID;

  const user = await UserLib.findOneDoc({ _id: sessionUserId });

  if (!user) {
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  return { data: user };
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

  const user = await UserLib.findOneDoc({ _id: sessionUserId });
  const parts = user.avatar?.split("/");
  const fileName = parts[parts.length - 1].split(".")[0];
  const old_public_id = `Afrolay/${fileName}`;

  // TODO: Check this to a utility function.
  let avatar_url;
  let uploadResponse: UploadApiResponse;
  if (payload.avatar && Object.keys(payload.avatar).length) {
    const { size } = payload.avatar;
    const id = Date.now();

    const public_id = `IMG_${id}_${size}`;

    uploadResponse = await cloudinary.uploader.upload(payload.avatar.path, {
      upload_preset: "afrolay",
      public_id,
    });
    avatar_url = uploadResponse.secure_url;
  }

  const updatedUser = await UserLib.findAndUpdateDoc(
    { _id: sessionUserId },
    {
      ...payload,
      avatar: avatar_url,
    }
  );

  // If updating the user in the database was unsuccessful, delete the newly uploaded image from cloudinary at once
  if (!updatedUser) {
    await cloudinary.uploader.destroy(uploadResponse.public_id, {
      invalidate: true,
      resource_type: "image",
      type: "authenticated",
    });
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  // If updating the user in the database was successful, delete the old profile image from cloudinary at once
  await cloudinary.uploader.destroy(old_public_id, {
    invalidate: true,
    resource_type: "image",
    type: "authenticated",
  });

  return {
    statusCode: status.OK,
    data: updatedUser,
    message: "Profile updated",
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

export const resetUserPasswordRequestHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const sessionUserId = req.user.userID;

  const user = await UserLib.findOneDoc({ _id: sessionUserId });

  const { html } = templates.resetP.resetPasswordHtmlMailContent({
    username: user.username,
    platform: "Afrolay",
    token: "12344ffv",
  });
  const text = templates.resetP.passwordReset({
    username: user.username,
    platform: "Afrolay",
    token: "12344ffv",
  }).text;

  const mailResponse = await mail.sendNodemailer({
    html,
    to: "sewkito@gmail.com",
    subject: "Password reset",
    text,
  });
  return { data: mailResponse.response };
};

export const resetUserPasswordHandler = async () => {
  return {};
};
