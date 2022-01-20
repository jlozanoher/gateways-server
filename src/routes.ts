import express, { Request, Response } from "express";
import {
  createGatewayHandler,
  deleteGatewayHandler,
  getGatewayHandler,
  getGatewaysHandler,
  updateGatewayHandler,
} from "./controller/gateway.controller";
import {
  createPeripheralHandler,
  deletePeripheralHandler,
  getPeripheralHandler,
  updatePeripheralHandler,
} from "./controller/peripheral.controller";
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import { requiresUser, validateRequest } from "./middleware";
import {
  createGatewaySchema,
  deleteGatewaySchema,
  updateGatewaySchema,
} from "./schema/gateway.schema";
import {
  createPeripheralSchema,
  deletePeripheralSchema,
  updatePeripheralSchema,
} from "./schema/peripheral.schema";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";

var routes = express.Router();

routes.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

// Register user
routes.post("/api/users", validateRequest(createUserSchema), createUserHandler);

// Login
routes.post(
  "/api/sessions",
  validateRequest(createUserSessionSchema),
  createUserSessionHandler
);

// Get the user's sessions
routes.get("/api/sessions", requiresUser, getUserSessionsHandler);

// Logout
routes.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

// Gateway ------------------------------------------------------------------------
// Create
routes.post(
  "/api/gateways",
  [validateRequest(createGatewaySchema)],
  createGatewayHandler
);

// Get
routes.get("/api/gateways/:_id", getGatewayHandler);
routes.get("/api/gateways", getGatewaysHandler);

// Update
routes.put(
  "/api/gateways/:_id",
  [validateRequest(updateGatewaySchema)],
  updateGatewayHandler
);

// Delete
routes.delete(
  "/api/gateways/:_id",
  [validateRequest(deleteGatewaySchema)],
  deleteGatewayHandler
);

// Peripheral ------------------------------------------------------------------------
// Create
routes.post(
  "/api/peripherals",
  [validateRequest(createPeripheralSchema)],
  createPeripheralHandler
);

// Get
routes.get("/api/peripherals/:_id", getPeripheralHandler);

// Update
routes.put(
  "/api/peripherals/:_id",
  [validateRequest(updatePeripheralSchema)],
  updatePeripheralHandler
);

// Delete
routes.delete(
  "/api/peripherals/:_id",
  [validateRequest(deletePeripheralSchema)],
  deletePeripheralHandler
);

export default routes;
