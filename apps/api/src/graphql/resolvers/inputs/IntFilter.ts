import * as TypeGraphQL from "type-graphql";
import { NestedIntFilter } from "./NestedIntFilter";

@TypeGraphQL.InputType("IntFilter", {
  isAbstract: true,
})
export class IntFilter {
  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  equals?: number | undefined;

  @TypeGraphQL.Field((_type) => [TypeGraphQL.Int], {
    nullable: true,
  })
  in?: number[] | undefined;

  @TypeGraphQL.Field((_type) => [TypeGraphQL.Int], {
    nullable: true,
  })
  notIn?: number[] | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  lt?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  lte?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  gt?: number | undefined;

  @TypeGraphQL.Field((_type) => TypeGraphQL.Int, {
    nullable: true,
  })
  gte?: number | undefined;

  @TypeGraphQL.Field((_type) => NestedIntFilter, {
    nullable: true,
  })
  not?: NestedIntFilter | undefined;
}