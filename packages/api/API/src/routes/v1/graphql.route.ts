import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { auth } from "../../middlewares/auth";
import prisma from "../../init-prisma-client";
import { buildSchemaSync } from "type-graphql";
import { DecisionTreeCrudResolver } from "../../graphql/resolvers/TreeResolvers";
const graphqlRouter = express.Router();

const schema = buildSchemaSync({
  resolvers: [DecisionTreeCrudResolver],
  emitSchemaFile: true,
});

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
