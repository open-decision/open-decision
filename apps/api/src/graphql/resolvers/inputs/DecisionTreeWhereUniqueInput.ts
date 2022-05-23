import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("DecisionTreeWhereUniqueInput", {
  isAbstract: true,
})
export class DecisionTreeWhereUniqueInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  uuid?: string | undefined;
}
