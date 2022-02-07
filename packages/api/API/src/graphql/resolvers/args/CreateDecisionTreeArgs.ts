import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { DecisionTreeCreateInput } from "../inputs/DecisionTreeCreateInput";

@TypeGraphQL.ArgsType()
export class CreateDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeCreateInput, {
    nullable: false,
  })
  data!: DecisionTreeCreateInput;
}
