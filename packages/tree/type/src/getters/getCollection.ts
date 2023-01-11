import { isEmpty } from "ramda";
import { pick } from "remeda";
import { TEntityPluginBase } from "../plugin";
import { Tree } from "../type-classes";
import { ObtainKeys } from "../types";

export const getCollection =
  (tree: Tree.TTree) =>
  <IEntityBase extends TEntityPluginBase>(
    entity: ObtainKeys<Tree.TTree, Record<string, any>> = "nodes"
  ) =>
  <TType extends IEntityBase>(ids: string[]) => {
    const entityObject = tree[entity];
    if (!entityObject) return undefined;

    const collection = pick(entityObject, ids) as Record<string, TType>;

    if (isEmpty(collection)) return undefined;

    return collection;
  };
