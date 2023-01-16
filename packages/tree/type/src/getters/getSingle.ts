import { pathOr } from "remeda";
import { IEntityPluginBase } from "../plugin";
import { Tree } from "../type-classes";
import { lookupEntityOfKey } from "./findEntityOfKey";

export const getSingle =
  (tree: Tree.TTree) =>
  <IEntityBase extends IEntityPluginBase>(entityCollection: keyof Tree.TTree) =>
  <TType extends IEntityBase>(id: string) => {
    const entity = pathOr(tree, [entityCollection, id], undefined);

    if (!entity) {
      return lookupEntityOfKey(entityCollection)(tree, id);
    }

    return entity as TType;
  };
