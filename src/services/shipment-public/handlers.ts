import { StatusCodes as status } from "http-status-codes";

import { errorResponse } from "../../sdk/utils";
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
      { message: "No shipment matches that tracking number" },
      status.NOT_FOUND
    );
  }

  return {
    data: { shipment },
    setCookies: true,
    cookies: {
      cookieName: "tracking_number",
      cookieValue: shipment.trackingId,
      cookieOptions: {
        maxAge: 24 * 7 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      },
    },
  };
};
