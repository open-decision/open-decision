import { Field, ObjectType, ID } from "type-graphql";
// import { TreeResolver } from "./resolvers";
import { buildSchema } from "type-graphql";

@ObjectType()
export class DecisionTree {
  @Field((type) => ID)
  id!: string;
  @Field()
  name!: string;
  @Field({ nullable: true })
  tags?: string;
  @Field({ nullable: true })
  treeData?: string;
  @Field({ nullable: true })
  language?: string;
}
