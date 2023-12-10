import axios from "axios";
import { StatusCodes as status } from "http-status-codes";

import { UserLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse } from "../../sdk/utils";
import { TProfileUpdateRequestPayload } from "../../types/services/user";

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
  const sessionUserId = req.user.userID;
  const requestId = req.params?.id;

  if (requestId !== sessionUserId) {
    errorResponse(null, status.FORBIDDEN);
  }

  const user = await UserLib.findOneDoc({ _id: requestId });

  const avatarFormData = new FormData();
  avatarFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
  avatarFormData.append("file", payload?.avatar);

  let avatarUrl = payload?.avatar;

  if (payload?.avatar !== user.avatar) {
    // handle fileupload to cloudinary, delete the old one from cloudinary using the file url, then upload the nw one and save the url to db

    const { data } = await axios.post(
      process.env.CLOUDINARY_URL,
      avatarFormData
    );

    avatarUrl = data?.secure_url as string;
  }

  const updatedUser = await UserLib.findAndUpdateDoc(
    { _id: requestId },
    {
      ...payload,
      avatar: avatarUrl,
    }
  );

  if (!updatedUser) {
    errorResponse({ message: "User not found" }, status.NOT_FOUND);
  }

  return { data: updatedUser };
};
export const resetUserPasswordHandler = async () => {
  return {};
};
export const resetUserPasswordRequestHandler = async () => {
  return {};
};
export const deleteAccountHandler = async () => {
  return {};
};
