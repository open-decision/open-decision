import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("StringFieldUpdateOperationsInput", {
  isAbstract: true,
})
export class StringFieldUpdateOperationsInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  set?: string | undefined;
}
