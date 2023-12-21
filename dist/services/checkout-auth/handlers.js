"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleCardsHandler = exports.deleteAllCardsHandler = exports.getAllCardsHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../sdk/database/mongodb/config");
const setup_1 = require("../../setup");
const getAllCardsHandler = async (payload, req) => {
    const allCards = await config_1.CardLib.findAllDocs();
    return { data: { allCards } };
};
exports.getAllCardsHandler = getAllCardsHandler;
const deleteAllCardsHandler = async (payload, req) => {
    const areDeleted = await config_1.CardLib.deleteManyDocs();
    if (areDeleted) {
        return {
            message: "All Cards deleted",
        };
    }
    else {
        (0, setup_1.errorResponse)({ message: "Error trying to delete" }, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
};
exports.deleteAllCardsHandler = deleteAllCardsHandler;
const deleteSingleCardsHandler = async (payload, req) => {
    const id = req.params.id;
    const isDeleted = await config_1.CardLib.deleteDoc({
        id,
    });
    if (!isDeleted) {
        (0, setup_1.errorResponse)({ message: "No card found" }, http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return { statusCode: http_status_codes_1.StatusCodes.OK };
};
exports.deleteSingleCardsHandler = deleteSingleCardsHandler;
//# sourceMappingURL=handlers.js.map