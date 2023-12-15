import { DbLib, User } from "../../../classes";
import { User as UserModel, Shipment, Card } from "../models";
import { CardDoc, CardModel, ShipmentDoc, ShipmentModel } from "../types";

export const UserLib = new User(UserModel, "User");

export const ShipmentLib = new DbLib<ShipmentDoc, {}, ShipmentModel>(
  Shipment,
  "Shipment"
);

export const CardLib = new DbLib<CardDoc, {}, CardModel>(Card, "Card");
