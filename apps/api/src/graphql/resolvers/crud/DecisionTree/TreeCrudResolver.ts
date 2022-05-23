import * as TypeGraphQL from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
import { DecisionTree } from "@open-decision/models/type-graphql";
import { GqlContext } from "../../../types";
import {
  CreateDecisionTreeArgs,
  FindUniqueDecisionTreeArgs,
  DeleteManyDecisionTreeArgs,
  FindManyDecisionTreeArgs,
  DeleteDecisionTreeArgs,
  UpdateDecisionTreeArgs,
  UpdateManyDecisionTreeArgs,
} from "./args";
import { AffectedRowsOutput } from "../../outputs";
import { getPrismaFromContext } from "../../../helpers";
import ApiError from "../../../../utils/ApiError";
import { PublishedTree } from "@open-decision/models/type-graphql";
import { publishDecisionTree } from "../../../../models/publishedTree.model";
import { getTreeWithUpdatedTreeData } from "../../../../models/decisionTree.model";
@TypeGraphQL.Resolver((_of) => DecisionTree)
export class DecisionTreeCrudResolver {
  @TypeGraphQL.Query((_returns) => DecisionTree, {
    nullable: true,
  })
  async decisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: FindUniqueDecisionTreeArgs
  ): Promise<DecisionTree | null> {
    if (!args.where.uuid) return null;
    return getTreeWithUpdatedTreeData(ctx.user.uuid, args.where.uuid);
  }

  @TypeGraphQL.Query((_returns) => [DecisionTree], {
    nullable: false,
  })
  async decisionTrees(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: FindManyDecisionTreeArgs
  ): Promise<DecisionTree[]> {
    return getPrismaFromContext(ctx).decisionTree.findMany({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
      },
    });
  }

  @TypeGraphQL.Mutation((_returns) => DecisionTree, {
    nullable: false,
  })
  async createDecisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: CreateDecisionTreeArgs
  ): Promise<DecisionTree> {
    return getPrismaFromContext(ctx).decisionTree.create({
      data: {
        name: args.data.name,
        owner: { connect: { uuid: ctx.user.uuid } },
      },
    });
  }

  @TypeGraphQL.Mutation((_returns) => DecisionTree, {
    nullable: true,
  })
  async deleteDecisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: DeleteDecisionTreeArgs
  ): Promise<DecisionTree | null> {
    const treeToDelete = await getPrismaFromContext(ctx).decisionTree.findFirst(
      {
        where: {
          ...args.where,
          ownerUuid: ctx.user.uuid,
        },
      }
    );

    if (!treeToDelete) {
      throw new ApiError({ message: "Not found." });
    }
    return getPrismaFromContext(ctx).decisionTree.delete({
      where: {
        uuid: treeToDelete.uuid,
      },
    });
  }

  @TypeGraphQL.Mutation((_returns) => DecisionTree, {
    nullable: true,
  })
  async updateDecisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: UpdateDecisionTreeArgs
  ): Promise<DecisionTree | null> {
    const treeToUpdate = await getPrismaFromContext(ctx).decisionTree.findFirst(
      {
        where: {
          ...args.where,
          ownerUuid: ctx.user.uuid,
        },
      }
    );

    if (!treeToUpdate) {
      throw new ApiError({ message: "Not found." });
    }

    return getPrismaFromContext(ctx).decisionTree.update({
      data: {
        ...args.data,
      },
      where: {
        uuid: treeToUpdate.uuid,
      },
    });
  }

  @TypeGraphQL.Mutation((_returns) => AffectedRowsOutput, {
    nullable: false,
  })
  async deleteManyDecisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: DeleteManyDecisionTreeArgs
  ): Promise<AffectedRowsOutput> {
    return getPrismaFromContext(ctx).decisionTree.deleteMany({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
      },
    });
  }

  @TypeGraphQL.Mutation((_returns) => AffectedRowsOutput, {
    nullable: false,
  })
  async updateManyDecisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: UpdateManyDecisionTreeArgs
  ): Promise<AffectedRowsOutput> {
    return getPrismaFromContext(ctx).decisionTree.updateMany({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
      },
      data: {
        ...args.data,
      },
    });
  }

  @TypeGraphQL.Mutation((_returns) => DecisionTree, {
    nullable: false,
  })
  async publishDecisionTree(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: FindUniqueDecisionTreeArgs
  ): Promise<PublishedTree | null> {
    if (!args.where.uuid) return null;
    return publishDecisionTree(ctx.user.uuid, args.where.uuid);
  }
}
