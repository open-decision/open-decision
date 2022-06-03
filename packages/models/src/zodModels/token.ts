import * as z from "zod";
import { TokenType } from "../enums";
import { CompleteUser, RelatedUserModel } from "./index";

export const TokenModel = z.object({
  id: z.number().int(),
  token: z.string(),
  type: z.enum(TokenType),
  ownerUuid: z.string(),
  expires: z.date(),
  blacklisted: z.boolean(),
});

export interface CompleteToken extends z.infer<typeof TokenModel> {
  owner: CompleteUser;
}

/**
 * RelatedTokenModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTokenModel: z.ZodSchema<CompleteToken> = z.lazy(() =>
  TokenModel.extend({
    owner: RelatedUserModel,
  })
);
