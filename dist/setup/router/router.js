"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const routes_1 = __importDefault(require("../../services/auth/routes"));
const routes_2 = __importDefault(require("../../services/user/routes"));
const routes_3 = __importDefault(require("../../services/forgot-password/routes"));
const routes_4 = __importDefault(require("../../services/shipment-auth/routes"));
const routes_5 = __importDefault(require("../../services/shipment-public/routes"));
const routes_6 = __importDefault(require("../../services/checkout-public/routes"));
const routes_7 = __importDefault(require("../../services/checkout-auth/routes"));
const routes_8 = __importDefault(require("../../services/verify-reset-token/routes"));
const router = (0, express_1.Router)();
/**
 * @returns Routes and their Handlers
 * @summary Router
 */
exports.default = () => {
    (0, routes_5.default)(router);
    (0, routes_6.default)(router);
    (0, routes_1.default)(router);
    (0, routes_3.default)(router);
    (0, routes_8.default)(router);
    /** Protected routes */
    (0, routes_2.default)(router);
    (0, routes_4.default)(router);
    (0, routes_7.default)(router);
    /** Catch all route handler */
    router.use((_, res) => {
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({
            message: "The resource you are searching for does not exist or has moved to a different route",
        });
    });
    return router;
};
//# sourceMappingURL=router.js.map