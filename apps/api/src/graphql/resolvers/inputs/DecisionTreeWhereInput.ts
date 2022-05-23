import * as TypeGraphQL from "type-graphql";
import { DateTimeFilter } from "./DateTimeFilter";
import { StringFilter } from "./StringFilter";
import { EnumTreeStatusFilter } from "./EnumTreeStatusFilter";
// import { TagListRelationFilter } from "./TagListRelationFilter";
@TypeGraphQL.InputType("DecisionTreeWhereInput", {
  isAbstract: true,
})
export class DecisionTreeWhereInput {
  @TypeGraphQL.Field((_type) => [DecisionTreeWhereInput], {
    nullable: true,
  })
  AND?: DecisionTreeWhereInput[] | undefined;

  @TypeGraphQL.Field((_type) => [DecisionTreeWhereInput], {
    nullable: true,
  })
  OR?: DecisionTreeWhereInput[] | undefined;

  @TypeGraphQL.Field((_type) => [DecisionTreeWhereInput], {
    nullable: true,
  })
  NOT?: DecisionTreeWhereInput[] | undefined;

  @TypeGraphQL.Field((_type) => StringFilter, {
    nullable: true,
  })
  uuid?: StringFilter | undefined;

  @TypeGraphQL.Field((_type) => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field((_type) => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field((_type) => EnumTreeStatusFilter, {
    nullable: true,
  })
  status?: EnumTreeStatusFilter | undefined;

  // @TypeGraphQL.Field((_type) => TagListRelationFilter, {
  //   nullable: true,
  // })
  // Tags?: TagListRelationFilter | undefined;

  @TypeGraphQL.Field((_type) => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field((_type) => StringFilter, {
    nullable: true,
  })
  language?: StringFilter | undefined;
}
