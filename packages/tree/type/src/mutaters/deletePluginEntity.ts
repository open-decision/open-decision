import { TId } from "../plugin";
import { Tree } from "../type-classes";

export const deletePluginEntity =
  (tree: Tree.TTree) => (entityKey: string, id: TId) => {
    if (!tree.pluginEntities) return;
    if (!tree.pluginEntities[entityKey]) return;

    delete tree.pluginEntities[entityKey][id];
  };
