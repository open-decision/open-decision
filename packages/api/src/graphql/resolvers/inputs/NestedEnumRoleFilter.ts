import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Role } from "../../enums/Role";

@TypeGraphQL.InputType("NestedEnumRoleFilter", {
  isAbstract: true
})
export class NestedEnumRoleFilter {
  @TypeGraphQL.Field(_type => Role, {
    nullable: true
  })
  equals?: "USER" | "STAFF" | "ADMIN" | undefined;

  @TypeGraphQL.Field(_type => [Role], {
    nullable: true
  })
  in?: Array<"USER" | "STAFF" | "ADMIN"> | undefined;

  @TypeGraphQL.Field(_type => [Role], {
    nullable: true
  })
  notIn?: Array<"USER" | "STAFF" | "ADMIN"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumRoleFilter, {
    nullable: true
  })
  not?: NestedEnumRoleFilter | undefined;
}
