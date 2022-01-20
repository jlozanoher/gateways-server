import mongoose from "mongoose";
import { DBError } from "../errors";

export interface GatewayDocument extends mongoose.Document {
  serialNumber: string;
  name: string;
  ipv4Address: string;
  createdAt: Date;
  updatedAt: Date;
}

const GatewaySchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    ipv4Address: { type: String, required: true },
  },
  { timestamps: true }
);

const Gateway = mongoose.model<GatewayDocument>("Gateway", GatewaySchema);

export default Gateway;
