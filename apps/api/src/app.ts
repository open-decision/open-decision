import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import { morganErrorHandler, morganHandler } from "./config/morgan";
import config from "./config/config";
import { errorConverter, errorHandler } from "./middlewares/error";
import { authLimiter } from "./middlewares/rateLimiter";
import router from "./routes/v1";
import { APIError } from "@open-decision/type-classes";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import * as Tracing from "@sentry/tracing";

export const app = express();

Sentry.init({
  dsn: config.SENTRY_DSN,
  environment: config.NODE_ENV,
  // for finer control
  tracesSampleRate: 1.0,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

if (config.NODE_ENV !== "test") {
  app.use(morganHandler);
  app.use(morganErrorHandler);
}

// parse request cookies
app.use(cookieParser());

// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

// limit repeated failed requests to auth endpoints
if (config.NODE_ENV === "production") {
  app.use("/auth", authLimiter);
  app.use("/users", authLimiter);
}

// v1 api routes
app.use("/v1", router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(
    new APIError({
      code: "NOT_FOUND",
      message: "Route does not exist.",
    })
  );
});

// Log error in sentry before processing it
app.use(Sentry.Handlers.errorHandler());
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
