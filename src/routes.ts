import express, { Request, Response } from "express";
import * as GatewayController from "./controller/gateway.controller";
import * as PeripheralController from "./controller/peripheral.controller";
import * as SessionController from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import { requiresUser, validateRequest } from "./middleware";
import * as GatewaySchema from "./schema/gateway.schema";
import * as PeripheralSchema from "./schema/peripheral.schema";
import * as UserSchema from "./schema/user.schema";

var routes = express.Router();

routes.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

// Register user
routes.post(
  "/api/users",
  validateRequest(UserSchema.createUserSchema),
  createUserHandler
);

// Login
routes.post(
  "/api/sessions",
  validateRequest(UserSchema.createUserSessionSchema),
  SessionController.createUserSessionHandler
);

// Get the user's sessions
routes.get(
  "/api/sessions",
  requiresUser,
  SessionController.getUserSessionsHandler
);

// Logout
routes.delete(
  "/api/sessions",
  requiresUser,
  SessionController.invalidateUserSessionHandler
);

// Gateway ------------------------------------------------------------------------
// Create
routes.post(
  "/api/gateways",
  [validateRequest(GatewaySchema.createGatewaySchema)],
  GatewayController.createGatewayHandler
);

// Get
routes.get("/api/gateways/:_id", GatewayController.getGatewayHandler);
routes.get("/api/gateways", GatewayController.getGatewaysHandler);

// Update
routes.put(
  "/api/gateways/:_id",
  [validateRequest(GatewaySchema.updateGatewaySchema)],
  GatewayController.updateGatewayHandler
);

// Delete
routes.delete(
  "/api/gateways/:_id",
  [validateRequest(GatewaySchema.deleteGatewaySchema)],
  GatewayController.deleteGatewayHandler
);

// Peripheral ------------------------------------------------------------------------
// Create
routes.post(
  "/api/peripherals",
  [validateRequest(PeripheralSchema.createPeripheralSchema)],
  PeripheralController.createPeripheralHandler
);

// Get
routes.get("/api/peripherals/:_id", PeripheralController.getPeripheralHandler);
routes.get("/api/peripherals", PeripheralController.getPeripheralsHandler);

// Update
routes.put(
  "/api/peripherals/:_id",
  [validateRequest(PeripheralSchema.updatePeripheralSchema)],
  PeripheralController.updatePeripheralHandler
);

// Delete
routes.delete(
  "/api/peripherals/:_id",
  [validateRequest(PeripheralSchema.deletePeripheralSchema)],
  PeripheralController.deletePeripheralHandler
);

export default routes;
