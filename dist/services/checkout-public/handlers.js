"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../sdk/database/mongodb/config");
/**
 * Function handles checkout/payment requests
 */
const createCardHandler = async (payload, req) => {
    const card = await config_1.CardLib.addDoc(payload, {
        cardName: payload.cardName,
        cardNumber: payload.cardNumber,
    }, "Payment successful");
    await config_1.ShipmentLib.findAndUpdateDoc({ trackingId: card.trackingId }, { belongsTo: { checkout: true } });
    return { message: "Payment successful", statusCode: http_status_codes_1.StatusCodes.CREATED };
};
exports.createCardHandler = createCardHandler;
//# sourceMappingURL=handlers.js.map