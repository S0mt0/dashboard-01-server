import { DbLib, User } from "../../../classes";
import { User as UserModel, Shipment, Card } from "../models";
import { CardDoc, CardModel } from "../types/card-details";
import { ShipmentDoc, ShipmentModel } from "../types/shipment";

export const UserLib = new User(UserModel, "User");

export const ShipmentLib = new DbLib<ShipmentDoc, {}, ShipmentModel>(
  Shipment,
  "Shipment"
);

export const CardLib = new DbLib<CardDoc, {}, CardModel>(Card, "Shipment");
