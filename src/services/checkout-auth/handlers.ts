import { StatusCodes as status } from "http-status-codes";

import { CardLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse, TCard } from "../../types";
import { errorResponse } from "../../sdk/utils";

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
      message: "All Cards deleted",
    };
  } else {
    errorResponse(
      { message: "Error trying to delete" },
      status.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteSingleCardsHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const id = req.params.id;

  const isDeleted = await CardLib.deleteDoc({
    id,
  });

  if (!isDeleted) {
    errorResponse({ message: "No card found" }, status.NOT_FOUND);
  }

  return { statusCode: status.OK };
};
