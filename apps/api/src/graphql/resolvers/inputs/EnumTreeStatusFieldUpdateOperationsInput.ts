import * as TypeGraphQL from "type-graphql";
import { TreeStatus } from "@open-decision/models/type-graphql";

@TypeGraphQL.InputType("EnumTreeStatusFieldUpdateOperationsInput", {
  isAbstract: true,
})
export class EnumTreeStatusFieldUpdateOperationsInput {
  @TypeGraphQL.Field((_type) => TreeStatus, {
    nullable: true,
  })
  set?: "ACTIVE" | "ARCHIVED" | undefined;
}
