"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shipment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ShipmentSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    belongsTo: {
        fullName: {
            type: String,
            required: [true, "Full name of shipment owner is required"],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        checkout: {
            type: Boolean,
            default: false,
        },
    },
    trackingId: {
        type: String,
        required: [
            true,
            "Provide a tracking identification number for this shipment",
        ],
        unique: true,
    },
    origin: {
        address: {
            addressLocality: {
                type: String,
                required: [true, "Provide an originating address for this shipment"],
                trim: true,
            },
        },
    },
    destination: {
        address: {
            addressLocality: {
                type: String,
                required: [true, "Provide a destination address for this shipment"],
                trim: true,
            },
        },
    },
    status: {
        timestamp: {
            type: Date,
            required: [
                true,
                "Specify a timestamp for the current status of shipment",
            ],
        },
        location: {
            address: {
                addressLocality: {
                    type: String,
                    required: [true, "Provide the current address for this shipment"],
                    trim: true,
                },
            },
        },
        status: {
            type: String,
            enum: {
                values: ["pending", "shipping", "seized", "delivered"],
                message: "'{VALUE}' is not supported",
            },
            default: "pending",
        },
        description: {
            type: String,
            trim: true,
            required: [
                true,
                "Provide a description of the current status of shipment",
            ],
        },
        bill: Number,
    },
    events: [
        {
            timestamp: {
                type: Date,
                required: [
                    true,
                    "Specify a timestamp for the current status of shipment",
                ],
            },
            location: {
                address: {
                    addressLocality: {
                        type: String,
                        required: [true, "Provide the current address for this shipment"],
                    },
                },
            },
            eventId: {
                type: String,
                unique: true,
            },
            description: {
                type: String,
                trim: true,
                required: [
                    true,
                    "Provide a description of the current state of shipment",
                ],
            },
        },
    ],
}, { timestamps: true });
exports.Shipment = mongoose_1.default.model("Shipment", ShipmentSchema);
exports.default = ShipmentSchema;
//# sourceMappingURL=shipment.js.map