import * as TypeGraphQL from "type-graphql";
import { DecisionTreeWhereUniqueInput } from "../../../inputs/DecisionTreeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeWhereUniqueInput, {
    nullable: false,
  })
  where!: DecisionTreeWhereUniqueInput;
}
