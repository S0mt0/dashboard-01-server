import { DbLib, User } from "../../../classes";
import { User as UserModel, Shipment } from "../models";
import { ShipmentDoc, ShipmentModel } from "../types/shipment";

export const UserLib = new User(UserModel, "User");

export const ShipmentLib = new DbLib<ShipmentDoc, {}, ShipmentModel>(
  Shipment,
  "Shipment"
);
