import config from "config";
import cors from "cors";
import express from "express";
import connect from "./db/connect";
import { errorHandler } from "./errors/error.handler";
import log from "./logger";
import { deserializeUser, errorMiddleware } from "./middleware";
import routes from "./routes";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();
app.use(deserializeUser);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable all CORS request
app.use(cors());

app.use("/", routes);

connect();

// @ts-ignore
app.use(errorMiddleware);

app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);
});

process.on("uncaughtException", (error: Error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  throw reason;
});

export default app;
