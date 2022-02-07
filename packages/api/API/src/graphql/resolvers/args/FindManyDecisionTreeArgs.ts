import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { DecisionTreeOrderByWithRelationInput } from "../inputs/DecisionTreeOrderByWithRelationInput";
import { DecisionTreeWhereInput } from "../inputs/DecisionTreeWhereInput";
import { DecisionTreeWhereUniqueInput } from "../inputs/DecisionTreeWhereUniqueInput";
import { DecisionTreeScalarFieldEnum } from "../../enums";

@TypeGraphQL.ArgsType()
export class FindManyDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeWhereInput, {
    nullable: true,
  })
  where?: DecisionTreeWhereInput | undefined;

  @TypeGraphQL.Field((_type) => [DecisionTreeOrderByWithRelationInput], {
    nullable: true,
  })
  orderBy?: DecisionTreeOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field((_type) => DecisionTreeWhereUniqueInput, {
    nullable: true,
  })
  cursor?: DecisionTreeWhereUniqueInput | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  take?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  skip?: number | undefined;

  @TypeGraphQL.Field((_type) => [DecisionTreeScalarFieldEnum], {
    nullable: true,
  })
  distinct?:
    | Array<
        | "id"
        | "createdAt"
        | "updatedAt"
        | "name"
        | "tags"
        | "treeData"
        | "language"
        | "ownerUuid"
      >
    | undefined;
}
