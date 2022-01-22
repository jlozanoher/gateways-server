import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import mongoose from "mongoose";
import { DBError } from "../errors";
import Peripheral from "../model/peripheral.model";
import {
  createGateway,
  deleteGateway,
  findAndUpdateGateway,
  findOneGateway,
  findGateway,
  findGatewaysWithPeripherals,
} from "../service/gateway.service";

export async function createGatewayHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;

    const gateway = await createGateway({ ...body });

    return res.send(gateway);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function updateGatewayHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = get(req, "params._id");
    const update = req.body;

    const gateway = await findOneGateway({ _id });

    if (!gateway) {
      return res.sendStatus(404);
    }

    const updatedGateway = await findAndUpdateGateway({ _id }, update, {
      new: true,
    });

    return res.send(updatedGateway);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function getGatewayHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = get(req, "params._id");

    const gateway = await findOneGateway({ _id });

    if (!gateway) {
      return res.sendStatus(404);
    }

    return res.send(gateway);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function getGatewaysHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const gateways = await findGateway({});

    return res.send(gateways);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function getGatewaysWithPeripheralsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const gateways = await findGatewaysWithPeripherals({});

    return res.send(gateways);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function deleteGatewayHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = get(req, "params._id");

    const gateway = await findOneGateway({ _id });

    if (!gateway) {
      return res.sendStatus(404);
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await deleteGateway({ _id });
      await Peripheral.updateMany({ gateway: _id }, { gateway: null });
    });
    session.endSession();

    return res.sendStatus(200);
  } catch (err: any) {
    next(new DBError(err));
  }
}
