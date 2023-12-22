"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("../../setup");
const validation_schema_1 = require("./validation-schema");
const _ = __importStar(require("./handlers"));
/**
 * Protected routes for shipment actions
 * @protected
 * @returns Routes
 */
exports.default = (router) => {
    // auth route for shipment actions
    router
        .route("/shipment")
        .delete(setup_1.authenticator, (0, setup_1.controller)(_.deleteAllShipmentHandler))
        .get(setup_1.authenticator, (0, setup_1.controller)(_.getAllShipmentHandler))
        .post(setup_1.authenticator, (0, setup_1.validate)(validation_schema_1.shipmentPayload), (0, setup_1.controller)(_.createShipmentHandler));
    router
        .route("/shipment/:trackingId")
        .get(setup_1.authenticator, (0, setup_1.controller)(_.getSingleShipmentHandler))
        .patch(setup_1.authenticator, (0, setup_1.validate)(validation_schema_1.shipmentPayload), (0, setup_1.controller)(_.updateSingleShipmentHandler))
        .delete(setup_1.authenticator, (0, setup_1.controller)(_.deleteSingleShipmentHandler));
};
//# sourceMappingURL=routes.js.map