import * as TypeGraphQL from "type-graphql";
import { NestedEnumRoleFilter } from "./NestedEnumRoleFilter";
import { NestedIntFilter } from "./NestedIntFilter";
import { Role } from "@open-decision/models/type-graphql";

@TypeGraphQL.InputType("NestedEnumRoleWithAggregatesFilter", {
  isAbstract: true,
})
export class NestedEnumRoleWithAggregatesFilter {
  @TypeGraphQL.Field((_type) => Role, {
    nullable: true,
  })
  equals?: "USER" | "STAFF" | "ADMIN" | undefined;

  @TypeGraphQL.Field((_type) => [Role], {
    nullable: true,
  })
  in?: Array<"USER" | "STAFF" | "ADMIN"> | undefined;

  @TypeGraphQL.Field((_type) => [Role], {
    nullable: true,
  })
  notIn?: Array<"USER" | "STAFF" | "ADMIN"> | undefined;

  @TypeGraphQL.Field((_type) => NestedEnumRoleWithAggregatesFilter, {
    nullable: true,
  })
  not?: NestedEnumRoleWithAggregatesFilter | undefined;

  @TypeGraphQL.Field((_type) => NestedIntFilter, {
    nullable: true,
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field((_type) => NestedEnumRoleFilter, {
    nullable: true,
  })
  _min?: NestedEnumRoleFilter | undefined;

  @TypeGraphQL.Field((_type) => NestedEnumRoleFilter, {
    nullable: true,
  })
  _max?: NestedEnumRoleFilter | undefined;
}
