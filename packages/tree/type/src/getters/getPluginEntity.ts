import { TId } from "@open-decision/tree-ids";
import { IEntityBase } from "../plugin";
import { Tree } from "../type-classes";

export const getPluginEntity = (tree: Tree.TTree) =>
  function <TType extends IEntityBase>(entityKey: string, id?: TId) {
    if (!id) return undefined;
    const entity = tree.pluginEntities[entityKey][id];

    if (!entity) return undefined;

    return entity as TType;
  };
