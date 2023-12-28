import { StatusCodes as status } from "http-status-codes";

import { CardLib, ShipmentLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse } from "../../types";
import { errorResponse } from "../../setup";
import { CardDoc } from "../../sdk/database/mongodb";

export const getAllCardsHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const userID = req.user.userID;
  const allShipments = await ShipmentLib.findAllDocs({ createdBy: userID });

  const allCards: CardDoc[] = [];
  allShipments.forEach(async (shipment) => {
    const card = await CardLib.findOneDoc({ trackingId: shipment.trackingId });
    allCards.push(card);
  });

  return { data: { allCards: allCards.reverse() } };
};

export const deleteAllCardsHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  // const userID = req.user.userID;

  // const allShipments = await ShipmentLib.findAllDocs({ createdBy: userID });

  // const allCards: CardDoc[] = [];
  // allShipments.forEach(async (shipment) => {
  //   const card = await CardLib.findOneDoc({
  //     trackingId: shipment.trackingId,
  //   });
  //   allCards.push(card);
  // });
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
