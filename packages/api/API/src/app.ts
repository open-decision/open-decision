import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import { morganSuccessHandler, morganErrorHandler } from "./config/morgan";
import config from "./config/config";
import { errorConverter, errorHandler } from "./middlewares/error";
import { ApiError } from "./utils/ApiError";
import { authLimiter } from "./middlewares/rateLimiter";
import { HTTPStatusCodes } from "./types/types";

export const app = express();

if (config.NODE_ENV !== "test") {
  app.use(morganSuccessHandler);
  app.use(morganErrorHandler);
}

// parse request cookies
app.use(cookieParser());

// set security HTTP headers
app.use(helmet());

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
}

// v1 api routes
//TODO refactor accordingly
app.use("/v1", routes);

// app.use("/auth", authRouter);

// app.use("/restricted", isAuthorized, async (req: Request, res: Response) => {
//   res.send("Awesome");
// });

// app.use(
//   "/graphql",
//   isAuthorized,
//   graphqlHTTP(async (req: any, res: any, graphQLParams: any) => ({
//     schema: schema,
//     graphiql: true,
//     context: (req: any, res: any) => {
//       return {
//         ...req,
//         prisma,
//         userUuid: res.context.userUuid,
//       };
//     },
//   }))
// );

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(
    new ApiError({
      statusCode: HTTPStatusCodes.NOT_FOUND,
      message: "Not found.",
    })
  );
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
