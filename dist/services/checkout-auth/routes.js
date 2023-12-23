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
const _ = __importStar(require("./handlers"));
/**
 * Auth route for handling payment
 * @returns Routes
 */
exports.default = (router) => {
    router
        .route("/checkout")
        .get(setup_1.authenticator, (0, setup_1.controller)(_.getAllCardsHandler))
        .delete(setup_1.authenticator, (0, setup_1.controller)(_.deleteAllCardsHandler));
    router.delete("/checkout/:trackingId", setup_1.authenticator, (0, setup_1.controller)(_.deleteSingleCardHandler));
};
//# sourceMappingURL=routes.js.map