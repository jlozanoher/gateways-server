import { number, object, string } from "yup";
import {
  PeripheralStatus,
  PeripheralStatusEnum,
} from "../model/peripheral.model";

const params = {
  params: object({
    _id: string().required(),
  }),
};

export const createPeripheralSchema = object({
  body: object({
    uid: number(),
    vendor: string().required().max(50),
    status: string().test(
      "is status type",
      `body.status: valid peripheral statuses: ${Object.values(
        PeripheralStatusEnum
      )}`,
      (v) => {
        if (!v) return true;
        // @ts-ignore
        return v ? Object.values(PeripheralStatusEnum).includes(v) : true;
      }
    ),
    gateway: string(),
  }),
});

export const updatePeripheralSchema = object({
  ...params,
  body: object({
    uid: number(),
    vendor: string().max(50),
    status: string().test(
      "is status type",
      `body.status: valid peripheral statuses: ${Object.values(
        PeripheralStatusEnum
      )}`,
      (v) => {
        if (!v) return true;
        // @ts-ignore
        return v ? Object.values(PeripheralStatusEnum).includes(v) : true;
      }
    ),
    gateway: string(),
  }),
});

export const deletePeripheralSchema = object({
  ...params,
});
