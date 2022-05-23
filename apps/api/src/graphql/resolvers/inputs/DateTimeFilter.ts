import * as TypeGraphQL from "type-graphql";
import { NestedDateTimeFilter } from "./NestedDateTimeFilter";

@TypeGraphQL.InputType("DateTimeFilter", {
  isAbstract: true,
})
export class DateTimeFilter {
  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  equals?: Date | undefined;

  @TypeGraphQL.Field((_type) => [Date], {
    nullable: true,
  })
  in?: Date[] | undefined;

  @TypeGraphQL.Field((_type) => [Date], {
    nullable: true,
  })
  notIn?: Date[] | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  lt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  lte?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  gt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  gte?: Date | undefined;

  @TypeGraphQL.Field((_type) => NestedDateTimeFilter, {
    nullable: true,
  })
  not?: NestedDateTimeFilter | undefined;
}
