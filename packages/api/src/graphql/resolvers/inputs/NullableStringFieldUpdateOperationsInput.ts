import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("NullableStringFieldUpdateOperationsInput", {
  isAbstract: true,
})
export class NullableStringFieldUpdateOperationsInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  set?: string | undefined;
}
