import * as TypeGraphQL from "type-graphql";
import { TreeStatus } from "../../enums";

@TypeGraphQL.InputType("EnumTreeStatusFieldUpdateOperationsInput", {
  isAbstract: true,
})
export class EnumTreeStatusFieldUpdateOperationsInput {
  @TypeGraphQL.Field((_type) => TreeStatus, {
    nullable: true,
  })
  set?: "ACTIVE" | "ARCHIVED" | undefined;
}
