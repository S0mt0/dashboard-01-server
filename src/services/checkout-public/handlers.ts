import { StatusCodes as status } from "http-status-codes";

import { CardLib, ShipmentLib } from "../../sdk/database/mongodb/config";
import { CustomRequest, ServiceResponse, TCard } from "../../types";

/**
 * Function handles checkout/payment requests
 */
export const createCardHandler = async (
  payload: TCard,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const card = await CardLib.addDoc(
    payload,
    {
      cardName: payload.cardName,
      cardNumber: payload.cardNumber,
    },
    "Payment successful"
  );

  const shipment = await ShipmentLib.findOneDoc({
    trackingId: card.trackingId,
  });

  shipment.belongsTo.checkout = true;
  await shipment.save();

  return { message: "Payment successful", statusCode: status.CREATED };
};
