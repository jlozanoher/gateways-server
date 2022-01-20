import mongoose, { Schema } from "mongoose";
import { customAlphabet } from "nanoid";
import { DBError } from "../errors";
import { GatewayDocument } from "./gateway.model";

const nanoid = customAlphabet("1234567890", 10);

export type PeripheralStatus = "online" | "offline";
export enum PeripheralStatusEnum {
  online = "online",
  reject = "offline",
}

export interface PeripheralDocument extends mongoose.Document {
  uid: number;
  vendor: string;
  status: PeripheralStatus; // online/offline.
  createdAt: Date;
  updatedAt: Date;
  gateway: GatewayDocument["_id"];
}

const PeripheralSchema = new mongoose.Schema(
  {
    uid: {
      type: Number,
      required: true,
      unique: true,
      default: () => nanoid(),
    },
    vendor: { type: String, required: true },
    status: { type: String, default: "offline" as PeripheralStatus },
    gateway: { type: Schema.Types.ObjectId, ref: "Gateway" },
  },
  { timestamps: true }
);

// @ts-ignore
PeripheralSchema.post("findOne", function (error, doc, next) {
  if (error) {
    next(new DBError());
  } else {
    next();
  }
});

const Peripheral = mongoose.model<PeripheralDocument>(
  "Peripheral",
  PeripheralSchema
);

export default Peripheral;
