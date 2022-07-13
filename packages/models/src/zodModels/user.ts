import * as z from "zod";
import { Role } from "../enums";
import {
  CompleteDecisionTree,
  RelatedDecisionTreeModel,
  CompletePublishedTree,
  RelatedPublishedTreeModel,
  CompleteToken,
  RelatedTokenModel,
  CompleteTag,
  RelatedTagModel,
  CompleteWhitelistEntry,
  RelatedWhitelistEntryModel,
} from ".";

export const UserModel = z.object({
  uuid: z.string().uuid(),
  name: z.string().nullish(),
  role: z.enum(Role),
  email: z.string(),
  password: z.string(),
  emailIsVerified: z.boolean(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  DecisionTrees: CompleteDecisionTree[];
  PublishedTrees: CompletePublishedTree[];
  Token: CompleteToken[];
  UserTags: CompleteTag[];
  WhitelistEntries: CompleteWhitelistEntry[];
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    DecisionTrees: RelatedDecisionTreeModel.array(),
    PublishedTrees: RelatedPublishedTreeModel.array(),
    Token: RelatedTokenModel.array(),
    UserTags: RelatedTagModel.array(),
    WhitelistEntries: RelatedWhitelistEntryModel.array(),
  })
);
