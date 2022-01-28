import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { DecisionTreeUpdateManyMutationInput } from "../inputs/DecisionTreeUpdateManyMutationInput";
import { DecisionTreeWhereInput } from "../inputs/DecisionTreeWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeUpdateManyMutationInput, {
    nullable: false,
  })
  data!: DecisionTreeUpdateManyMutationInput;

  @TypeGraphQL.Field((_type) => DecisionTreeWhereInput, {
    nullable: true,
  })
  where?: DecisionTreeWhereInput | undefined;
}
