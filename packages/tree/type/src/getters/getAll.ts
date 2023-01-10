import { IEntityPluginBase } from "../plugin";
import { Tree } from "../type-classes";
import { ObtainKeys } from "../types";

export const getAll =
  (tree: Tree.TTree) =>
  <IEntityBase extends IEntityPluginBase>(
    entity: ObtainKeys<Tree.TTree, Record<string, any>> = "nodes"
  ) =>
  <TType extends IEntityBase>() => {
    if (!tree[entity]) return undefined;

    return tree[entity] as Record<string, TType>;
  };
