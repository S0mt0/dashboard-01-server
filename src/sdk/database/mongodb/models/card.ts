import { CardDoc, CardModel } from "../types/card-details";
import { TCard } from "../../../../types";

import mongoose from "mongoose";

const CardSchema = new mongoose.Schema<TCard, CardModel>(
  {
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
  },

  { timestamps: true }
);

export const Card = mongoose.model<CardDoc, CardModel>("Card", CardSchema);

export default CardSchema;
