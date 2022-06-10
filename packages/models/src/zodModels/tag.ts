import * as z from "zod";
import {
  CompleteUser,
  RelatedUserModel,
  CompleteDecisionTree,
  RelatedDecisionTreeModel,
} from ".";

export const TagModel = z.object({
  id: z.number().int(),
  text: z.string(),
  color: z.string().nullish(),
  ownerUuid: z.string().nullish(),
});

export interface CompleteTag extends z.infer<typeof TagModel> {
  owner?: CompleteUser | null;
  DecisionTrees: CompleteDecisionTree[];
}

/**
 * RelatedTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagModel: z.ZodSchema<CompleteTag> = z.lazy(() =>
  TagModel.extend({
    owner: RelatedUserModel.nullish(),
    DecisionTrees: RelatedDecisionTreeModel.array(),
  })
);
