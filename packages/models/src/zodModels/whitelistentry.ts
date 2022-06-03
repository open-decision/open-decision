import * as z from "zod";
import { WhitelistingType } from "../enums";
import { CompleteUser, RelatedUserModel } from "./index";

export const WhitelistEntryModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  creatorUuid: z.string(),
  emailOrDomain: z.string(),
  sendInvite: z.boolean(),
  dateOfLastInvite: z.date().nullish(),
  type: z.enum(WhitelistingType),
});

export interface CompleteWhitelistEntry
  extends z.infer<typeof WhitelistEntryModel> {
  createdBy: CompleteUser;
}

/**
 * RelatedWhitelistEntryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWhitelistEntryModel: z.ZodSchema<CompleteWhitelistEntry> =
  z.lazy(() =>
    WhitelistEntryModel.extend({
      createdBy: RelatedUserModel,
    })
  );
