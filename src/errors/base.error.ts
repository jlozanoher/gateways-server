export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

class BaseError extends Error {
  public readonly name: string;
  public readonly status: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    status: HttpStatusCode,
    isOperational: boolean,
    description: string
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.status = status;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export default BaseError;
