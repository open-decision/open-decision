import { PrismaClient } from "@prisma/client";
import { Arg, Ctx, Resolver, Query, Mutation } from "type-graphql";

import { TreeService } from "./tree-service";
// import { TreeNotFoundError } from "../error-handling/graphql-errors.old";
import { UUID } from "./../types/uuid-class";
import { DecisionTree } from "./schema";
import { NewTreeInput } from "./input-arguments-types";

// @Resolver(DecisionTree)
// export class TreeResolver {
//   constructor(private treeService: TreeService) {}

//   @Query((returns) => DecisionTree)
//   async DecisionTree(
//     @Arg("id") id: string,
//     @Ctx("userUuid") userUuid: UUID,
//     @Ctx("prisma") prisma: PrismaClient
//   ) {
//     const tree = await this.treeService.findById(id, userUuid, prisma);
//     if (tree === undefined) {
//       throw new TreeNotFoundError({
//         name: "TreeNotFound",
//         message: `The tree with the ID ${id} was not found.`,
//       });
//     }
//     return tree;
//   }

//   @Query((returns) => [DecisionTree])
//   allTrees(
//     @Ctx("userUuid") userUuid: UUID,
//     @Ctx("prisma") prisma: PrismaClient
//   ) {
//     return this.treeService.findAll(userUuid, prisma);
//   }

//   @Mutation((returns) => DecisionTree)
//   addTree(
//     @Arg("newTreeData") newTreeData: NewTreeInput,
//     @Ctx("userUuid") userUuid: UUID,
//     @Ctx("prisma") prisma: PrismaClient
//   ) {
//     return this.treeService.addNew(newTreeData, userUuid, prisma);
//   }
// }

// ----------
//   @Mutation((returns) => Boolean)
//   @Authorized(Roles.Admin)
//   async removeRecipe(@Arg("id") id: string) {
//     try {
//       await this.recipeService.removeById(id);
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }

// owner: User;

// type User {
//   id: ID!
//   name: String!
//   email: String!
//   DecisionTrees: [DecisionTree!]!
// }
