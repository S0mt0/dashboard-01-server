import { StatusCodes as status } from "http-status-codes";
import { Types } from "mongoose";

import { errorResponse } from "../../sdk/utils";
import { CustomRequest, ServiceResponse } from "../../types";
import { ShipmentLib } from "../../sdk/database/mongodb/config";
import { TShipmentPayload } from "../../types/services/shipment";
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

  await ShipmentLib.addDoc(tempShipment, {
    trackingId: payload.trackingId,
  });

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

  return { data: shipment };
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
      statusCode: status.OK,
    };
  } else {
    errorResponse(
      { message: "Error trying to delete" },
      status.INTERNAL_SERVER_ERROR
    );
  }
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

export const updateSingleShipment = async (
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
    statusCode: status.OK,
    data: updatedShipment,
    message: "Shipment updated successfully",
  };
};

export const deleteSingleShipment = async (
  payload: null,
  req: CustomRequest
): Promise<ServiceResponse> => {
  const trackingId = req.params.trackingId;
  const { userID } = req.user;

  const isDeleted = await ShipmentLib.deleteDoc({ _id: userID, trackingId });

  if (!isDeleted) {
    errorResponse({ message: "No shipment found" }, status.NOT_FOUND);
  }

  return { statusCode: status.OK };
};
