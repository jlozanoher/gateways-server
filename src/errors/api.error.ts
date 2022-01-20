import BaseError, { HttpStatusCode } from "./base.error";

class APIError extends BaseError {
  constructor(
    name: string = "API Error",
    status = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error"
  ) {
    super(name, status, isOperational, description);
  }
}

export default APIError;
