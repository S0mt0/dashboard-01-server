import { StatusCodes as status } from "http-status-codes";

import { CardLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse } from "../../setup";

export const getAllCardsHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const allCards = await CardLib.findAllDocs();

  return { data: { allCards } };
};

export const deleteAllCardsHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const areDeleted = await CardLib.deleteManyDocs();

  if (areDeleted) {
    return {
      message: "All cards deleted successfully",
    };
  } else {
    errorResponse(
      { message: "Error trying to delete" },
      status.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteSingleCardHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const trackingId = req.params.trackingId;

  const isDeleted = await CardLib.deleteDoc({
    trackingId,
  });

  if (!isDeleted) {
    errorResponse({ message: "No card found" }, status.NOT_FOUND);
  }

  return { statusCode: status.OK, message: "Card deleted successfully" };
};
