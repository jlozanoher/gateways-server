import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Gateway, { GatewayDocument } from "../model/gateway.model";

export function createGateway(input: DocumentDefinition<GatewayDocument>) {
  return Gateway.create(input);
}

export function findGateway(
  query: FilterQuery<GatewayDocument>,
  options: QueryOptions = { lean: true }
) {
  return Gateway.find(query, {}, options).exec();
}

export function findGatewaysWithPeripherals(
  query: FilterQuery<GatewayDocument>,
  options: QueryOptions = { lean: true }
) {
  return Gateway.aggregate([
    {
      $lookup: {
        from: "peripherals",
        localField: "_id",
        foreignField: "gateway",
        as: "peripherals",
      },
    },
  ]);
}

export function findOneGateway(
  query: FilterQuery<GatewayDocument>,
  options: QueryOptions = { lean: true }
) {
  return Gateway.findOne(query, {}, options);
}

export function findAndUpdateGateway(
  query: FilterQuery<GatewayDocument>,
  update: UpdateQuery<GatewayDocument>,
  options: QueryOptions
) {
  return Gateway.findOneAndUpdate(query, update, options);
}

export function deleteGateway(query: FilterQuery<GatewayDocument>) {
  return Gateway.deleteOne(query);
}
