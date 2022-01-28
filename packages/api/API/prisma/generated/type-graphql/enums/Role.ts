import * as TypeGraphQL from "type-graphql";

export enum Role {
  USER = "USER",
  STAFF = "STAFF",
  ADMIN = "ADMIN"
}
TypeGraphQL.registerEnumType(Role, {
  name: "Role",
  description: undefined,
});
