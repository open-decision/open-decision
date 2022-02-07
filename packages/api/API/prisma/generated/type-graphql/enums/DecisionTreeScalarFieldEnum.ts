import * as TypeGraphQL from "type-graphql";

export enum DecisionTreeScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  name = "name",
  tags = "tags",
  treeData = "treeData",
  language = "language",
  ownerUuid = "ownerUuid"
}
TypeGraphQL.registerEnumType(DecisionTreeScalarFieldEnum, {
  name: "DecisionTreeScalarFieldEnum",
  description: undefined,
});
