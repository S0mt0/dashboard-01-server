import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse } from "../../sdk/utils";
import { TProfileUpdateRequestPayload } from "../../types/services/user";
import { cloudinary } from "../../api/config/cloudinary";

/**
 * Function used to retrieve a single user data, using the provided user Id.
 *
 * However, it ensures that the user in session can only request for data about themselves by comparing the session user Id with the request Id parameter
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
  const requestId = req.params?.id;

  if (requestId !== sessionUserId) {
    errorResponse(null, status.FORBIDDEN);
  }

  const user = await UserLib.findOneDoc({ _id: requestId });

  if (!user) {
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  return { data: user };
};

/**
 * Function used to update user profile.
 *
 * However, it ensures that the user in session can only update their own profile by comparing the session user Id with the request Id parameter
 * @function
 * @param payload
 * @param req
 * @returns Updated user profile
 */
export const updateUserHandler = async (
  payload: TProfileUpdateRequestPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  // const sessionUserId = req.user.userID;
  const requestId = req.params?.id;
  // console.log("[PAYLOAD FILE]: ", req.files);

  // if (requestId !== sessionUserId) {
  //   errorResponse(null, status.FORBIDDEN);
  // }

  const user = await UserLib.findOneDoc({ _id: requestId });

  const old_avatar_url = user?.avatar;
  const old_avatar_public_id = `${old_avatar_url[old_avatar_url.length - 2]}/${
    old_avatar_url[old_avatar_url.length - 1].split(".")[0]
  }`;

  console.log("[OLD_URL]: ", old_avatar_url);
  console.log("[OLD_ID]: ", old_avatar_public_id);

  let new_avatar_url = old_avatar_url;
  let new_avatar_public_id;

  if (payload.avatar && Object.keys(payload.avatar).length) {
    const uploadResponse = await cloudinary.uploader.upload(
      payload.avatar.path,
      {
        upload_preset: "afrolay",
      }
    );

    new_avatar_url = uploadResponse?.secure_url;
    new_avatar_public_id = `${new_avatar_url[new_avatar_url.length - 2]}/${
      new_avatar_url[new_avatar_url.length - 1].split(".")[0]
    }`;
  }

  console.log("[NEW_URL]: ", new_avatar_url);
  console.log("[NEW_ID]: ", new_avatar_public_id);

  const updatedUser = await UserLib.findAndUpdateDoc(
    { _id: requestId },
    {
      ...payload,
      avatar: new_avatar_url,
    }
  );

  if (!updatedUser) {
    await cloudinary.uploader.destroy(new_avatar_public_id, {
      invalidate: true,
      resource_type: "image",
      type: "authenticated",
    });
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  if (old_avatar_public_id)
    await cloudinary.uploader.destroy(old_avatar_public_id, {
      invalidate: true,
      resource_type: "image",
      type: "authenticated",
    });

  return { statusCode: status.OK, data: updatedUser };
};

export const resetUserPasswordHandler = async () => {
  return {};
};
export const resetUserPasswordRequestHandler = async () => {
  return {};
};

export const deleteAccountHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const sessionUserId = req.user.userID;
  const requestId = req.params?.id;

  if (requestId !== sessionUserId) {
    errorResponse(null, status.FORBIDDEN);
  }

  const isDeleted = await UserLib.deleteDoc({ _id: requestId });

  if (!isDeleted) {
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  return { statusCode: status.OK };
};
