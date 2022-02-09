import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("DecisionTreeCreateInput", {
  isAbstract: true,
})
export class DecisionTreeCreateInput {
  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  name!: string;

  @TypeGraphQL.Field((_type) => GraphQLScalars.JSONResolver, {
    nullable: true,
  })
  tags?: Prisma.InputJsonValue | undefined;

  @TypeGraphQL.Field((_type) => GraphQLScalars.JSONResolver, {
    nullable: true,
  })
  treeData?: Prisma.InputJsonValue | undefined;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  language?: string | undefined;
}
