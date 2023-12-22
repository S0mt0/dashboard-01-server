import { Types } from "mongoose";

// single event
type TEvent = {
  _id?: Types.ObjectId;

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
export type TShipmentPayload = {
  _id?: Types.ObjectId;

  createdBy?: Types.ObjectId;

  belongsTo: {
    fullName: string;
    email: string;
    country: string;
    checkout: boolean;
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

    status: "pending" | "seized" | "delivered" | "shipping";

    description: string;

    bill?: number;
  };

  events: TEvent[];
};
