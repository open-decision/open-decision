import * as TypeGraphQL from "type-graphql";

export enum TokenScalarFieldEnum {
  id = "id",
  token = "token",
  type = "type",
  ownerUuid = "ownerUuid",
  expires = "expires",
  loginExpiry = "loginExpiry",
  blacklisted = "blacklisted"
}
TypeGraphQL.registerEnumType(TokenScalarFieldEnum, {
  name: "TokenScalarFieldEnum",
  description: undefined,
});
