import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@open-decision/models/prisma-client";

@TypeGraphQL.InputType("NestedJsonNullableFilter", {
  isAbstract: true,
})
export class NestedJsonNullableFilter {
  @TypeGraphQL.Field((_type) => GraphQLScalars.JSONResolver, {
    nullable: true,
  })
  equals?: Prisma.InputJsonValue | undefined;

  @TypeGraphQL.Field((_type) => GraphQLScalars.JSONResolver, {
    nullable: true,
  })
  not?: Prisma.InputJsonValue | undefined;
}
