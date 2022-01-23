import { NextFunction, Request, Response } from "express";
import { DBError } from "../errors";
import Gateway from "../model/gateway.model";
import Peripheral from "../model/peripheral.model";
import { gateways } from "./gateways.seed";
import { peripherals } from "./peripherals.seed";

export async function populateDatabase(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const g = await Gateway.findOne().exec();
    const p = await Peripheral.findOne().exec();
    if (!g && !p) {
      await Gateway.insertMany(gateways);
      await Peripheral.insertMany(peripherals);
    }

    return res.sendStatus(200);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function shouldPopulate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const g = await Gateway.findOne().exec();
    const p = await Peripheral.findOne().exec();
    if (!g && !p) {
      return res.status(200).send("Yes");
    }

    return res.status(200).send("No");
  } catch (err: any) {
    next(new DBError(err));
  }
}
