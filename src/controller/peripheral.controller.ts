import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { DBError } from "../errors";
import { findOneGateway } from "../service/gateway.service";
import {
  createPeripheral,
  deletePeripheral,
  findAndUpdatePeripheral,
  findOnePeripheral,
  findPeripheral,
} from "../service/peripheral.service";

async function validateGateway(req: Request, res: Response) {
  const body = req.body;

  const gatewayId = get(body, "gateway");

  if (gatewayId) {
    const gateway = await findOneGateway({ _id: gatewayId });
    if (gateway) {
      return gatewayId;
    }
  }
  return null;
}

export async function createPeripheralHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;

    let data = { ...body };

    if (get(body, "gateway")) {
      const gateway = await validateGateway(req, res);

      if (gateway) {
        data = { ...body, gateway };
      } else {
        return res.status(404).send("body.gateway: not found");
      }
    }

    const peripheral = await createPeripheral(data);

    return res.send(peripheral);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function updatePeripheralHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = get(req, "params._id");
    let update = req.body;

    const peripheral = await findOnePeripheral({ _id });

    if (!peripheral) {
      return res.sendStatus(404);
    }

    const aux = get(update, "gateway");
    if (aux === "detach") {
      update = { ...update, gateway: null };
    } else if (aux) {
      const gateway = await validateGateway(req, res);

      if (gateway) {
        update = { ...update, gateway };
      } else {
        return res.status(404).send("body.gateway: not found");
      }
    }

    const updatedPeripheral = await findAndUpdatePeripheral({ _id }, update, {
      new: true,
    });

    return res.send(updatedPeripheral);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function getPeripheralHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = get(req, "params._id");
    const peripheral = await findOnePeripheral({ _id });

    if (!peripheral) {
      return res.sendStatus(404);
    }

    return res.send(peripheral);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function getPeripheralsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const peripherals = await findPeripheral({});

    return res.send(peripherals);
  } catch (err: any) {
    next(new DBError(err));
  }
}

export async function deletePeripheralHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = get(req, "params._id");

    const peripheral = await findOnePeripheral({ _id });

    if (!peripheral) {
      return res.sendStatus(404);
    }

    await deletePeripheral({ _id });

    return res.sendStatus(200);
  } catch (err: any) {
    next(new DBError(err));
  }
}
