import { Document, Model } from "mongoose";

import { TCard } from "../../../../types";

export interface CardDoc extends Partial<Document>, TCard {}
export type CardModel = Model<CardDoc>;
