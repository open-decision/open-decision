import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { User } from "../models/User";
import { TokenType } from "../enums/TokenType";

@TypeGraphQL.ObjectType("Token", {
  isAbstract: true
})
export class Token {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  token!: string;

  @TypeGraphQL.Field(_type => TokenType, {
    nullable: false
  })
  type!: "ACCESS" | "REFRESH" | "RESET_PASSWORD" | "VERIFY_EMAIL";

  owner?: User;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  ownerUuid!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  expires!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  loginExpiry?: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  blacklisted!: boolean;
}
