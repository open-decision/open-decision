import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
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

const app = express();
const port = process.env.PORT || 4000;
const prisma: PrismaClient = new PrismaClient();

app.locals.prisma = prisma;
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

let schema: any;
async function bootstrap() {
  schema = await buildSchema({
    resolvers: [TreeResolver],
    emitSchemaFile: true,
  });
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
        userUuid: res.locals.user,
      };
    },
  }))
);

app.use(logError);
app.use(returnError);

app.listen({ port: port }, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

bootstrap();
