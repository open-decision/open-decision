import "reflect-metadata";

import prisma from "./init-prisma-client";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { authRouter } from "./auth/auth-router";

import { isAuthorized } from "./auth/authentication-middleware";
import {
  logError,
  returnError,
} from "./error-handling/error-handling-middleware";
import { TreeResolver } from "./graphql/resolvers";
import { BaseError } from "./error-handling/base-error";
import { cleanBlocklist } from "./auth/utils/access-token-blocklist";
dotenv.config();
export const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

let schema: any;

async function asyncPreparation() {
  schema = await buildSchema({
    resolvers: [TreeResolver],
    emitSchemaFile: true,
  });

  try {
    await prisma.$connect();
  } catch (e) {
    const err = new BaseError({
      name: "DatabaseConnectionFailed",
      message: "Could not connect to the database.",
    });
    logError(err);
  }
  cleanBlocklist();
}

app.use("/auth", authRouter);

app.use("/restricted", isAuthorized, async (req: Request, res: Response) => {
  res.send("Awesome");
});

app.use(
  "/graphql",
  isAuthorized,
  graphqlHTTP(async (req: any, res: any, graphQLParams: any) => ({
    schema: schema,
    graphiql: true,
    context: (req: any, res: any) => {
      return {
        ...req,
        prisma,
        userUuid: res.context.userUuid,
      };
    },
  }))
);

// app.use(logError);
app.use(returnError);

export const server = app.listen({ port: port }, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

asyncPreparation();
