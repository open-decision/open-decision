import * as TypeGraphQL from "type-graphql";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { JsonNullableFilter } from "../inputs/JsonNullableFilter";
import { StringFilter } from "../inputs/StringFilter";

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

  @TypeGraphQL.Field((_type) => IntFilter, {
    nullable: true,
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field((_type) => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field((_type) => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field((_type) => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field((_type) => JsonNullableFilter, {
    nullable: true,
  })
  tags?: JsonNullableFilter | undefined;

  @TypeGraphQL.Field((_type) => JsonNullableFilter, {
    nullable: true,
  })
  treeData?: JsonNullableFilter | undefined;

  @TypeGraphQL.Field((_type) => StringFilter, {
    nullable: true,
  })
  language?: StringFilter | undefined;
}
