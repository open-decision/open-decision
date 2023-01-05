import morgan from "morgan";
import config from "./config";
import { logger } from "./logger";

morgan.token("message", (req, res: any) => res.locals.errorMessage || "");

const getIpFormat = () =>
  config.NODE_ENV === "production" ? ":remote-addr - " : "";
const defaultResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const morganHandler = morgan(defaultResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.http(message.trim()) },
});

export const morganErrorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default morgan;
