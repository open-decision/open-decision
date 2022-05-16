import * as TypeGraphQL from "type-graphql";
import { NestedEnumTreeStatusFilter } from "../inputs/NestedEnumTreeStatusFilter";
import { TreeStatus } from "../../enums";

@TypeGraphQL.InputType("EnumTreeStatusFilter", {
  isAbstract: true,
})
export class EnumTreeStatusFilter {
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
