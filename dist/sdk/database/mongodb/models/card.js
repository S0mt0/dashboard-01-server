"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CardSchema = new mongoose_1.default.Schema({
    trackingId: String,
    cardName: {
        type: String,
        required: [true, "Card name is required."],
    },
    cardNumber: {
        type: String,
        required: [true, "Card number is required."],
    },
    cvv: {
        type: String,
        required: [true, "Card cvc is required."],
    },
    expMonth: {
        type: String,
        required: [true, "Card expiration month is required."],
    },
    expYear: {
        type: String,
        required: [true, "Card expiration year is required."],
    },
    country: String,
}, { timestamps: true });
exports.Card = mongoose_1.default.model("Card", CardSchema);
exports.default = CardSchema;
//# sourceMappingURL=card.js.map