import log from "../logger";
import BaseError from "./base.error";

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    console.log(err);
    await log.error(
      "Error message from the centralized error-handling component",
      err.stack
    );
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();
