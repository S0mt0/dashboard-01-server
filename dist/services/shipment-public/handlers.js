"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleShipmentHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const setup_1 = require("../../setup");
const config_1 = require("../../sdk/database/mongodb/config");
const getSingleShipmentHandler = async (payload, req) => {
    const trackingId = req.query.trackingId;
    if (!trackingId) {
        (0, setup_1.errorResponse)({ message: "Missing trackingId in the request query" }, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const shipment = await config_1.ShipmentLib.findOneDoc({ trackingId }, "-createdAt -updatedAt -__v -_id -createdBy -belongsTo");
    if (!shipment) {
        (0, setup_1.errorResponse)({
            message: "No shipment matches that tracking number",
            data: { trackingId },
        }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return {
        data: { shipment },
    };
};
exports.getSingleShipmentHandler = getSingleShipmentHandler;
//# sourceMappingURL=handlers.js.map