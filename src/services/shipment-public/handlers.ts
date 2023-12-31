import { StatusCodes as status } from "http-status-codes";

import { errorResponse } from "../../setup";
import { CustomRequest, ServiceResponse } from "../../types";
import { ShipmentLib } from "../../sdk/database/mongodb/config";

export const getSingleShipmentHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const trackingId = req.query.trackingId;

  if (!trackingId) {
    errorResponse(
      { message: "Missing trackingId in the request query" },
      status.BAD_REQUEST
    );
  }

  const shipment = await ShipmentLib.findOneDoc(
    { trackingId },
    "-createdAt -updatedAt -__v -_id -createdBy -belongsTo"
  );

  if (!shipment) {
    errorResponse(
      {
        message: "No shipment matches that tracking number",
        data: { trackingId },
      },
      status.NOT_FOUND
    );
  }

  return {
    data: { shipment },
  };
};
