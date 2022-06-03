import * as z from "zod";
import { TreeStatus } from "../enums";
import {
  CompleteTag,
  RelatedTagModel,
  CompleteUser,
  RelatedUserModel,
  CompletePublishedTree,
  RelatedPublishedTreeModel,
} from "./index";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const DecisionTreeModel = z.object({
  uuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(TreeStatus),
  name: z.string(),
  treeData: jsonSchema,
  yDocument: z.string().nullish(),
  ownerUuid: z.string().uuid(),
});

export interface CompleteDecisionTree
  extends z.infer<typeof DecisionTreeModel> {
  Tags: CompleteTag[];
  owner: CompleteUser;
  publishedTrees: CompletePublishedTree[];
}

/**
 * RelatedDecisionTreeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDecisionTreeModel: z.ZodSchema<CompleteDecisionTree> =
  z.lazy(() =>
    DecisionTreeModel.extend({
      /**
       * @TypeGraphQL.omit(output: true, input: true)
       */
      Tags: RelatedTagModel.array(),
      /**
       * @TypeGraphQL.omit(output: true, input: true)
       */
      owner: RelatedUserModel,
      publishedTrees: RelatedPublishedTreeModel.array(),
    })
  );
