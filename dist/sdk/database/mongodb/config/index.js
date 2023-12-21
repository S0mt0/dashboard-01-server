"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLib = exports.ShipmentLib = exports.UserLib = void 0;
const classes_1 = require("../../../classes");
const models_1 = require("../models");
exports.UserLib = new classes_1.User(models_1.User, "User");
exports.ShipmentLib = new classes_1.DbLib(models_1.Shipment, "Shipment");
exports.CardLib = new classes_1.DbLib(models_1.Card, "Card");
//# sourceMappingURL=index.js.map