import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import { authRouter } from "./auth/auth-router";
import { isAuthorized } from "./auth/authentication-middleware";
import {
  logError,
  returnError,
} from "./error-handling/error-handling-middleware";

const app = express();
const port = process.env.PORT || 4000;
const prisma: PrismaClient = new PrismaClient();
app.locals.prisma = prisma;
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/auth", authRouter);

app.use("/restricted", isAuthorized, async (req: Request, res: Response) => {
  res.send("Awesome");
});

// app.use(
//   "/graphql",
//   graphqlHTTP(async (request, response, graphQLParams) => ({
//     schema: schema,
//     graphiql: true,
//     context: (request: Request) => {
//       return {
//         ...request,
//         prisma,
//         userId:
//           request && request.headers.authorization ? getUserId(request) : null,
//       };
//     },
//   }))
// );

app.use(logError);
app.use(returnError);

app.listen({ port: port }, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
