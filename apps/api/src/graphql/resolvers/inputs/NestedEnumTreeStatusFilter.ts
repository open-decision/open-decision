import { TreeStatus } from "@open-decision/models/type-graphql";
import * as TypeGraphQL from "type-graphql";

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
