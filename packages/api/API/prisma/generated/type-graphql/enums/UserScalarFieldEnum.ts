import * as TypeGraphQL from "type-graphql";

export enum UserScalarFieldEnum {
  id = "id",
  uuid = "uuid",
  name = "name",
  role = "role",
  email = "email",
  password = "password",
  emailIsVerified = "emailIsVerified"
}
TypeGraphQL.registerEnumType(UserScalarFieldEnum, {
  name: "UserScalarFieldEnum",
  description: undefined,
});
