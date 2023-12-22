import { StatusCodes as status } from "http-status-codes";
import { Types } from "mongoose";

import { errorResponse } from "../../setup";
import { CustomRequest, ServiceResponse, TShipmentPayload } from "../../types";
import { ShipmentLib } from "../../sdk/database/mongodb/config";
import { ShipmentDoc } from "../../sdk/database/mongodb/types/shipment";

export const createShipmentHandler = async (
  payload: TShipmentPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const { userID } = req.user;

  const tempShipment = payload as ShipmentDoc;

  // Attach Shipment to unique user in session
  tempShipment.createdBy = userID as unknown as Types.ObjectId;

  if (payload.status.status) {
    tempShipment.status.status = payload.status.status;
  }

  await ShipmentLib.addDoc(
    tempShipment,
    {
      trackingId: payload.trackingId,
    },
    "There is a shipment with that tracking number, please try a different one"
  );

  return {
    message: "Shipment created successfully",
    statusCode: status.CREATED,
  };
};

export const getSingleShipmentHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const trackingId = req.params.trackingId;
  const { userID } = req.user;

  if (!trackingId) {
    errorResponse(
      { message: "Missing trackingId in the request params" },
      status.BAD_REQUEST
    );
  }

  const shipment = await ShipmentLib.findOneDoc({
    trackingId,
    createdBy: userID,
  });

  if (!shipment) errorResponse(null, status.NOT_FOUND);

  return { data: { shipment } };
};

export const getAllShipmentHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const { userID } = req.user;

  const allShipment = await ShipmentLib.findAllDocs({
    createdBy: userID,
  });

  return { data: { allShipment } };
};

export const updateSingleShipmentHandler = async (
  payload: TShipmentPayload,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const trackingId = req.params.trackingId;
  const { userID } = req.user;

  if (!trackingId) {
    errorResponse(
      { message: "Missing trackingId in the request params" },
      status.BAD_REQUEST
    );
  }

  const updatedShipment = await ShipmentLib.findAndUpdateDoc(
    { trackingId, createdBy: userID },
    { ...payload }
  );

  if (!updatedShipment) {
    errorResponse({ message: "No shipment found" }, status.NOT_FOUND);
  }

  return {
    data: updatedShipment,
    message: "Shipment updated successfully",
  };
};

export const deleteSingleShipmentHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const trackingId = req.params.trackingId;
  const { userID } = req.user;

  const isDeleted = await ShipmentLib.deleteDoc({
    createdBy: userID,
    trackingId,
  });

  if (!isDeleted) {
    errorResponse({ message: "No shipment found" }, status.NOT_FOUND);
  }

  return { statusCode: status.OK };
};

export const deleteAllShipmentHandler = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const { userID } = req.user;

  const areDeleted = await ShipmentLib.deleteManyDocs({ createdBy: userID });

  if (areDeleted) {
    return {
      message: "All shipment deleted",
    };
  } else {
    errorResponse(
      { message: "Error trying to delete" },
      status.INTERNAL_SERVER_ERROR
    );
  }
};
