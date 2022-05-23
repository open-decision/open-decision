import * as TypeGraphQL from "type-graphql";
import { Role } from "@open-decision/models/type-graphql";

@TypeGraphQL.InputType("NestedEnumRoleFilter", {
  isAbstract: true,
})
export class NestedEnumRoleFilter {
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

  @TypeGraphQL.Field((_type) => NestedEnumRoleFilter, {
    nullable: true,
  })
  not?: NestedEnumRoleFilter | undefined;
}
