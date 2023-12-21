"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllShipmentHandler = exports.deleteSingleShipmentHandler = exports.updateSingleShipmentHandler = exports.getAllShipmentHandler = exports.getSingleShipmentHandler = exports.createShipmentHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const setup_1 = require("../../setup");
const config_1 = require("../../sdk/database/mongodb/config");
const createShipmentHandler = async (payload, req) => {
    const { userID } = req.user;
    const tempShipment = payload;
    // Attach Shipment to unique user in session
    tempShipment.createdBy = userID;
    if (payload.status.status) {
        tempShipment.status.status = payload.status.status;
    }
    await config_1.ShipmentLib.addDoc(tempShipment, {
        trackingId: payload.trackingId,
    }, "There is a shipment with that tracking number, please try a different one");
    return {
        message: "Shipment created successfully",
        statusCode: http_status_codes_1.StatusCodes.CREATED,
    };
};
exports.createShipmentHandler = createShipmentHandler;
const getSingleShipmentHandler = async (payload, req) => {
    const trackingId = req.params.trackingId;
    const { userID } = req.user;
    if (!trackingId) {
        (0, setup_1.errorResponse)({ message: "Missing trackingId in the request params" }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const shipment = await config_1.ShipmentLib.findOneDoc({
        trackingId,
        createdBy: userID,
    });
    if (!shipment)
        (0, setup_1.errorResponse)(null, http_status_codes_1.StatusCodes.NOT_FOUND);
    return { data: shipment };
};
exports.getSingleShipmentHandler = getSingleShipmentHandler;
const getAllShipmentHandler = async (payload, req) => {
    const { userID } = req.user;
    const allShipment = await config_1.ShipmentLib.findAllDocs({
        createdBy: userID,
    });
    return { data: { allShipment } };
};
exports.getAllShipmentHandler = getAllShipmentHandler;
const updateSingleShipmentHandler = async (payload, req) => {
    const trackingId = req.params.trackingId;
    const { userID } = req.user;
    if (!trackingId) {
        (0, setup_1.errorResponse)({ message: "Missing trackingId in the request params" }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const updatedShipment = await config_1.ShipmentLib.findAndUpdateDoc({ trackingId, createdBy: userID }, Object.assign({}, payload));
    if (!updatedShipment) {
        (0, setup_1.errorResponse)({ message: "No shipment found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return {
        data: updatedShipment,
        message: "Shipment updated successfully",
    };
};
exports.updateSingleShipmentHandler = updateSingleShipmentHandler;
const deleteSingleShipmentHandler = async (payload, req) => {
    const trackingId = req.params.trackingId;
    const { userID } = req.user;
    const isDeleted = await config_1.ShipmentLib.deleteDoc({
        createdBy: userID,
        trackingId,
    });
    if (!isDeleted) {
        (0, setup_1.errorResponse)({ message: "No shipment found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return { statusCode: http_status_codes_1.StatusCodes.OK };
};
exports.deleteSingleShipmentHandler = deleteSingleShipmentHandler;
const deleteAllShipmentHandler = async (payload, req) => {
    const { userID } = req.user;
    const areDeleted = await config_1.ShipmentLib.deleteManyDocs({ createdBy: userID });
    if (areDeleted) {
        return {
            message: "All shipment deleted",
        };
    }
    else {
        (0, setup_1.errorResponse)({ message: "Error trying to delete" }, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
};
exports.deleteAllShipmentHandler = deleteAllShipmentHandler;
//# sourceMappingURL=handlers.js.map