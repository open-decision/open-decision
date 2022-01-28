import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DecisionTree } from "../../../prisma/generated/type-graphql/models/DecisionTree";
import { GqlContext } from "../types";
import {
  CreateDecisionTreeArgs,
  FindUniqueDecisionTreeArgs,
  DeleteManyDecisionTreeArgs,
  FindManyDecisionTreeArgs,
  DeleteDecisionTreeArgs,
  UpdateDecisionTreeArgs,
  UpdateManyDecisionTreeArgs,
} from "./args";
import { AffectedRowsOutput } from "./outputs";

import {
  transformFields,
  getPrismaFromContext,
  transformCountFieldIntoSelectRelationsCount,
} from "../../../prisma/generated/type-graphql/helpers";
import ApiError from "../../utils/ApiError";

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
    const { _count } = transformFields(graphqlFields(info as any));
    return getPrismaFromContext(ctx).decisionTree.findFirst({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
        ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
      },
    });
  }

  @TypeGraphQL.Query((_returns) => [DecisionTree], {
    nullable: false,
  })
  async decisionTrees(
    @TypeGraphQL.Ctx() ctx: GqlContext,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: FindManyDecisionTreeArgs
  ): Promise<DecisionTree[]> {
    const { _count } = transformFields(graphqlFields(info as any));
    return getPrismaFromContext(ctx).decisionTree.findMany({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
      },
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
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
        ...args.data,
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
    const { _count } = transformFields(graphqlFields(info as any));
    const treeToDelete = await getPrismaFromContext(ctx).decisionTree.findFirst(
      {
        where: {
          ...args.where,
          ownerUuid: ctx.user.uuid,
          ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
        },
      }
    );

    if (!treeToDelete) {
      throw new ApiError({ message: "Not found." });
    }
    return getPrismaFromContext(ctx).decisionTree.delete({
      where: {
        id: treeToDelete.id,
        ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
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
    const { _count } = transformFields(graphqlFields(info as any));
    const treeToUpdate = await getPrismaFromContext(ctx).decisionTree.findFirst(
      {
        where: {
          ...args.where,
          ownerUuid: ctx.user.uuid,
          ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
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
        id: treeToUpdate.id,
      },
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
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
    const { _count } = transformFields(graphqlFields(info as any));
    return getPrismaFromContext(ctx).decisionTree.deleteMany({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
      },
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
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
    const { _count } = transformFields(graphqlFields(info as any));
    return getPrismaFromContext(ctx).decisionTree.updateMany({
      where: {
        ...args.where,
        ownerUuid: ctx.user.uuid,
      },
      data: {
        ...args.data,
      },
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
