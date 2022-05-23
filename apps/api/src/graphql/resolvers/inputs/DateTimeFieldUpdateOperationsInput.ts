import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("DateTimeFieldUpdateOperationsInput", {
  isAbstract: true,
})
export class DateTimeFieldUpdateOperationsInput {
  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  set?: Date | undefined;
}
