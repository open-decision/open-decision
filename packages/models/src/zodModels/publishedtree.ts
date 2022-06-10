import * as z from "zod";
import {
  CompleteUser,
  RelatedUserModel,
  CompleteDecisionTree,
  RelatedDecisionTreeModel,
} from ".";

export const PublishedTreeModel = z.object({
  uuid: z.string(),
  createdAt: z.date(),
  name: z.string(),
  treeData: z.any(),
  ownerUuid: z.string(),
  originTreeUuid: z.string(),
});

export interface CompletePublishedTree
  extends z.infer<typeof PublishedTreeModel> {
  owner: CompleteUser;
  originTree: CompleteDecisionTree;
}

/**
 * RelatedPublishedTreeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPublishedTreeModel: z.ZodSchema<CompletePublishedTree> =
  z.lazy(() =>
    PublishedTreeModel.extend({
      owner: RelatedUserModel,
      originTree: RelatedDecisionTreeModel,
    })
  );
