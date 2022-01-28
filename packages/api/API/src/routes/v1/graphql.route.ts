import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { auth } from "../../middlewares/auth";
import prisma from "../../init-prisma-client";
import { schema } from "../../index";

const graphqlRouter = express.Router();

graphqlRouter.post(
  "/",
  auth(),
  graphqlHTTP(async (req: any, res: any, graphQLParams: any) => ({
    schema: schema,
    graphiql: true,
    context: {
      ...req,
      prisma: prisma,
    },
  }))
);

export default graphqlRouter;
