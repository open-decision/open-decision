import * as TypeGraphQL from "type-graphql";
import { StringFieldUpdateOperationsInput } from "./StringFieldUpdateOperationsInput";
import { EnumTreeStatusFieldUpdateOperationsInput } from "./EnumTreeStatusFieldUpdateOperationsInput";
@TypeGraphQL.InputType("DecisionTreeUpdateManyMutationInput", {
  isAbstract: true,
})
export class DecisionTreeUpdateManyMutationInput {
  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => EnumTreeStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: EnumTreeStatusFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  language?: StringFieldUpdateOperationsInput | undefined;
}
