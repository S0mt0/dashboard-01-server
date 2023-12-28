"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleCardHandler = exports.deleteAllCardsHandler = exports.getAllCardsHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../sdk/database/mongodb/config");
const setup_1 = require("../../setup");
const getAllCardsHandler = async (payload, req) => {
    const userID = req.user.userID;
    const allShipments = await config_1.ShipmentLib.findAllDocs({ createdBy: userID });
    const allCards = [];
    allShipments.forEach(async (shipment) => {
        const card = await config_1.CardLib.findOneDoc({ trackingId: shipment.trackingId });
        allCards.push(card);
    });
    return { data: { allCards: allCards.reverse() } };
};
exports.getAllCardsHandler = getAllCardsHandler;
const deleteAllCardsHandler = async (payload, req) => {
    // const userID = req.user.userID;
    // const allShipments = await ShipmentLib.findAllDocs({ createdBy: userID });
    // const allCards: CardDoc[] = [];
    // allShipments.forEach(async (shipment) => {
    //   const card = await CardLib.findOneDoc({
    //     trackingId: shipment.trackingId,
    //   });
    //   allCards.push(card);
    // });
    const areDeleted = await config_1.CardLib.deleteManyDocs();
    if (areDeleted) {
        return {
            message: "All cards deleted successfully",
        };
    }
    else {
        (0, setup_1.errorResponse)({ message: "Error trying to delete" }, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
};
exports.deleteAllCardsHandler = deleteAllCardsHandler;
const deleteSingleCardHandler = async (payload, req) => {
    const trackingId = req.params.trackingId;
    const isDeleted = await config_1.CardLib.deleteDoc({
        trackingId,
    });
    if (!isDeleted) {
        (0, setup_1.errorResponse)({ message: "No card found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return { statusCode: http_status_codes_1.StatusCodes.OK, message: "Card deleted successfully" };
};
exports.deleteSingleCardHandler = deleteSingleCardHandler;
//# sourceMappingURL=handlers.js.map