import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { DecisionTreeUpdateInput } from "../inputs/DecisionTreeUpdateInput";
import { DecisionTreeWhereUniqueInput } from "../inputs/DecisionTreeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdatePartialDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeUpdateInput, {
    nullable: false,
  })
  data!: DecisionTreeUpdateInput;

  @TypeGraphQL.Field((_type) => DecisionTreeWhereUniqueInput, {
    nullable: false,
  })
  where!: DecisionTreeWhereUniqueInput;
}
