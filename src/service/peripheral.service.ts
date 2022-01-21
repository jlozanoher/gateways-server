import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { DBError } from "../errors";
import BaseError from "../errors/base.error";
import Peripheral, { PeripheralDocument } from "../model/peripheral.model";

export function createPeripheral(
  input: DocumentDefinition<PeripheralDocument>
) {
  return Peripheral.create(input);
}

export function findPeripheral(
  query: FilterQuery<PeripheralDocument>,
  options: QueryOptions = { lean: true }
) {
  return Peripheral.find(query, {}, options).exec();
}

export function findOnePeripheral(
  query: FilterQuery<PeripheralDocument>,
  options: QueryOptions = { lean: true }
) {
  return Peripheral.findOne(query, {}, options, (err) => {
    if (err) {
      throw new DBError();
    }
  });
}

export function findAndUpdatePeripheral(
  query: FilterQuery<PeripheralDocument>,
  update: UpdateQuery<PeripheralDocument>,
  options: QueryOptions
) {
  return Peripheral.findOneAndUpdate(query, update, options);
}

export function deletePeripheral(query: FilterQuery<PeripheralDocument>) {
  return Peripheral.deleteOne(query);
}
