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
/**
 * @openapi
 * tags:
 *   name: GraphQL
 *   description: Used to handle all data that is not part of the authentication or user management. Use  GraphQL introspection for schema documentation. Requires to be logged in.
 */

/**
 * @openapi
 * /graphql/:
 *   post:
 *     tags: [GraphQL]
 *     summary: Root Query
 *     description: Used to execute GraphQL queries and mutations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
