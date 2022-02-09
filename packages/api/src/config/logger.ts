import winston from "winston";
import config from "./config";
import SentryTransport from "winston-transport-sentry-node";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  level: config.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error", "debug", "info"],
    }),
    new winston.transports.File({ filename: "test.log" }),
  ],
});

if (config.SENTRY_DSN) {
  logger.add(
    new SentryTransport({
      sentry: {
        dsn: config.SENTRY_DSN,
        serverName: config.INSTANCE_NAME,
      },
    })
  );
}
