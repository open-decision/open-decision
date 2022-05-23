import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("DecisionTreeCreateInput", {
  isAbstract: true,
})
export class DecisionTreeCreateInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  name!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  language?: string | undefined;
}
