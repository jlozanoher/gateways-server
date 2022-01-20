import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors";
import { HttpStatusCode } from "../errors/base.error";
import { errorHandler } from "../errors/error.handler";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
async function errorMiddleware(
  err: TypeError | BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = err;

  if (!(err instanceof BaseError)) {
    customError = new BaseError(
      "Oh no, this is embarrasing. We are having troubles my friend",
      HttpStatusCode.INTERNAL_SERVER,
      false,
      ""
    );
  }

  await errorHandler.handleError(err);

  if (!errorHandler.isTrustedError(customError)) {
    next(customError);
  }

  res.status((customError as BaseError).status).send(customError);
}

export default errorMiddleware;
