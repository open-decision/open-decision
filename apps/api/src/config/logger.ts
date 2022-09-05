import winston from "winston";
import config from "./config";
import SentryTransport from "winston-transport-sentry-node";

const { timestamp, prettyPrint, colorize, errors } = winston.format;

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
  ],
});

if (config.SENTRY_DSN) {
  logger.add(
    new SentryTransport({
      sentry: {
        dsn: config.SENTRY_DSN,
        serverName: config.INSTANCE_NAME,
      },
      format: winston.format.combine(
        errors({ stack: true }),
        colorize(),
        timestamp(),
        prettyPrint()
      ),
    })
  );
}

// class PosthogTransport extends Transport {
//   private client: PostHog;
//   constructor(opts: PosthogTransportOptions) {
//     super(opts);
//     this.client = new PostHog(
//       opts.posthog.apiKey,
//       Object.values(opts.posthog).length > 1 ? { ...opts.posthog } : {}
//     );
//   }

//   override log(info: any, callback) {
//     this.client.capture({
//       distinctId: "distinct id",
//       event: "movie played",
//       properties: {
//         movieId: "123",
//         category: "romcom",
//       },
//     });
//     callback();
//   }
// }

// interface PosthogTransportOptions extends TransportStreamOptions {
//   posthog: {
//     apiKey: string;
//     host?: string;
//     flushAt?: number;
//     flushInterval?: number;
//     personalApiKey?: string;
//   };
// }

// interface PosthogLogInfo {}
