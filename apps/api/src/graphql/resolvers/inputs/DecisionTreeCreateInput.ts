import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma-client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("DecisionTreeCreateInput", {
  isAbstract: true,
})
export class DecisionTreeCreateInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  name!: string;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
  })
  language?: string | undefined;
}
