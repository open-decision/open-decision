import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { DecisionTreePartialUpdateInput } from "../inputs/DecisionTreePartialUpdateInput";
import { DecisionTreeWhereUniqueInput } from "../inputs/DecisionTreeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdatePartialDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreePartialUpdateInput, {
    nullable: false,
  })
  data!: DecisionTreePartialUpdateInput;

  @TypeGraphQL.Field((_type) => DecisionTreeWhereUniqueInput, {
    nullable: false,
  })
  where!: DecisionTreeWhereUniqueInput;
}
