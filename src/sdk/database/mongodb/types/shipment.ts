import { Document, Model, Types } from "mongoose";

// single event
type IEvent = {
  eventId: string;
  timestamp: string;
  location: {
    address: {
      addressLocality: string;
    };
  };

  description: string;
};

// single shipment
export interface IShipment {
  createdBy: Types.ObjectId;

  belongsTo: {
    fullName?: string;
    email?: string;
    country?: string;
    checkout?: boolean;
  };

  trackingId: string;

  origin: {
    address: {
      addressLocality: string;
      label: string;
    };
  };

  destination: {
    address: {
      addressLocality: string;
      label: string;
    };
  };

  status: {
    timestamp: string;

    location: {
      address: {
        addressLocality: string;
      };
    };

    status: "pending" | "seized" | "delivered" | "shipping";

    description: string;

    bill?: number;
  };

  events: IEvent[];
}

export interface ShipmentDoc extends Partial<Document>, IShipment {}

export type ShipmentModel = Model<ShipmentDoc>;
