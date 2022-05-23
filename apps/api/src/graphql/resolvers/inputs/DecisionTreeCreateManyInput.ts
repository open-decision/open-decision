import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("DecisionTreeCreateManyInput", {
  isAbstract: true,
})
export class DecisionTreeCreateManyInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  name!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  language?: string | undefined;
}
