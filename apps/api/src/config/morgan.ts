import morgan from "morgan";
import config from "./config";
import { logger } from "./logger";

morgan.token("message", (req, res: any) => res.locals.errorMessage || "");

const getIpFormat = () =>
  config.NODE_ENV === "production" ? ":remote-addr - " : "";
const defaultResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

export const morganHandler = morgan(defaultResponseFormat, {
  stream: { write: (message) => logger.http(message.trim()) },
});

export default morgan;
