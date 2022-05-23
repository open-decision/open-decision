import * as TypeGraphQL from "type-graphql";
import { DecisionTreeWhereInput } from "../../../inputs/DecisionTreeWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyDecisionTreeArgs {
  @TypeGraphQL.Field((_type) => DecisionTreeWhereInput, {
    nullable: true,
  })
  where?: DecisionTreeWhereInput | undefined;
}
