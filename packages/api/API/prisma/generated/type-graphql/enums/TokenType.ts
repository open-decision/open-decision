import * as TypeGraphQL from "type-graphql";

export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL"
}
TypeGraphQL.registerEnumType(TokenType, {
  name: "TokenType",
  description: undefined,
});
