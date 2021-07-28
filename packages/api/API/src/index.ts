import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request } from "express";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { authRouter } from "./auth/authRouter";
import * as dotenv from "dotenv";
import path from "path";
import { isAuthorized } from "./auth/authMiddleware";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

app.use("/restricted", isAuthorized, async (req, res) => {
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

app.listen({ port: port }, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
