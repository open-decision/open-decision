import * as TypeGraphQL from "type-graphql";

export enum TokenScalarFieldEnum {
  id = "id",
  token = "token",
  type = "type",
  ownerUuid = "ownerUuid",
  expires = "expires",
  blacklisted = "blacklisted"
}
TypeGraphQL.registerEnumType(TokenScalarFieldEnum, {
  name: "TokenScalarFieldEnum",
  description: undefined,
});
