import * as z from "zod";
import { TreeStatus } from "../enums";
import {
  CompleteTag,
  RelatedTagModel,
  CompleteUser,
  RelatedUserModel,
  CompletePublishedTree,
  RelatedPublishedTreeModel,
} from ".";

export const DecisionTreeModel = z.object({
  uuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(TreeStatus),
  hasPreview: z.boolean(),
  name: z.string(),
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
      Tags: RelatedTagModel.array(),
      owner: RelatedUserModel,
      publishedTrees: RelatedPublishedTreeModel.array(),
    })
  );
