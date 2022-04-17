import * as TypeGraphQL from "type-graphql";
import { TreeStatus } from "../../enums";

@TypeGraphQL.InputType("NestedEnumTreeStatusFilter", {
  isAbstract: true,
})
export class NestedEnumTreeStatusFilter {
  @TypeGraphQL.Field((_type) => TreeStatus, {
    nullable: true,
  })
  equals?: "ACTIVE" | "ARCHIVED" | undefined;

  @TypeGraphQL.Field((_type) => [TreeStatus], {
    nullable: true,
  })
  in?: Array<"ACTIVE" | "ARCHIVED"> | undefined;

  @TypeGraphQL.Field((_type) => [TreeStatus], {
    nullable: true,
  })
  notIn?: Array<"ACTIVE" | "ARCHIVED"> | undefined;

  @TypeGraphQL.Field((_type) => NestedEnumTreeStatusFilter, {
    nullable: true,
  })
  not?: NestedEnumTreeStatusFilter | undefined;
}
