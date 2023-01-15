import { Tree } from "../type-classes";
import { lookupEntityOfKey } from "./findEntityOfKey";

export const getPluginEntity = (tree: Tree.TTree) =>
  function <TType extends { id: string; type: string }>(
    entityKey: string,
    id: string
  ) {
    const data = tree.pluginEntities[entityKey][id];

    if (!data) return lookupEntityOfKey(entityKey)(tree, id);

    return data as TType;
  };
