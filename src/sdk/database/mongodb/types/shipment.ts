import { Document, Model, Types } from "mongoose";

// single event
type IEvent = {
  eventId: string;
  timestamp: Date;
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
  };

  trackingId: string;

  origin: {
    address: {
      addressLocality: string;
    };
  };

  destination: {
    address: {
      addressLocality: string;
    };
  };

  status: {
    timestamp: Date;

    location: {
      address: {
        addressLocality: string;
      };
    };

    status: "pending" | "delivered" | "shipping";

    description: string;
  };

  events: IEvent[];
}

export interface ShipmentDoc extends Partial<Document>, IShipment {}

export type ShipmentModel = Model<ShipmentDoc>;
