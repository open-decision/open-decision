import * as T from "io-ts";
import * as E from "fp-ts/lib/Either";
import { withMessage } from "io-ts-types/lib/withMessage";
import { badgeColors } from "internalTypes/index";
import { withFallback } from "io-ts-types";
import { InlinedKey } from "./utils";

export const Tag = T.type({
  name: T.string,
  color: T.keyof(badgeColors),
});
export const Tags = T.array(Tag);
export type Tag = T.TypeOf<typeof Tag>;

export const TreeNode = withMessage(
  T.type({
    name: T.string,
    createdAt: T.string,
    tags: withFallback(Tags, []),
  }),
  () => "Could not verify tree data"
);

export type ValidTreeNode = T.TypeOf<typeof TreeNode>;

export type TreeNode = E.Either<T.Errors, ValidTreeNode>;

export type InlinedValidTreeNode = InlinedKey<ValidTreeNode>;

export type TreeState = Record<string, ValidTreeNode>;
