import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma-client";
import { StringFieldUpdateOperationsInput } from "./StringFieldUpdateOperationsInput";
import { EnumTreeStatusFieldUpdateOperationsInput } from "./EnumTreeStatusFieldUpdateOperationsInput";
import { TagUpdateManyWithoutDecisionTreesInput } from "./TagUpdateManyWithoutDecisionTreesInput";
@TypeGraphQL.InputType("DecisionTreeUpdateInput", {
  isAbstract: true,
})
export class DecisionTreeUpdateInput {
  @TypeGraphQL.Field((_type) => EnumTreeStatusFieldUpdateOperationsInput, {
    nullable: true,
  })
  status?: EnumTreeStatusFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => TagUpdateManyWithoutDecisionTreesInput, {
    nullable: true,
  })
  Tags?: TagUpdateManyWithoutDecisionTreesInput | undefined;

  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  language?: StringFieldUpdateOperationsInput | undefined;
}
