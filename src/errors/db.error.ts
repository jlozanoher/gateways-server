import BaseError, { HttpStatusCode } from "./base.error";

class DBError extends BaseError {
  constructor(name = "DB error", description = "internal server error") {
    super(name, HttpStatusCode.INTERNAL_SERVER, true, description);
  }
}

export default DBError;
