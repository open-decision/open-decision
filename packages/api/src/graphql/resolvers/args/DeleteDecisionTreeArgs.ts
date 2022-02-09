import * as TypeGraphQL from "type-graphql";
import { DecisionTreeWhereUniqueInput } from "../inputs/DecisionTreeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeWhereUniqueInput, {
    nullable: false,
  })
  where!: DecisionTreeWhereUniqueInput;
}
