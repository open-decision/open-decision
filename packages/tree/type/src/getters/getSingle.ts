import { pathOr } from "remeda";
import { IEntityPluginBase } from "../plugin";
import { Tree } from "../type-classes";

export const getSingle =
  (tree: Tree.TTree) =>
  <IEntityBase extends IEntityPluginBase>(entity: keyof Tree.TTree) =>
  <TType extends IEntityBase>(id: string) =>
    pathOr(tree, [entity, id], undefined) as TType;
