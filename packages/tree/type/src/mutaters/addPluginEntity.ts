import { Tree } from "../type-classes";

export const addPluginEntity =
  (tree: Tree.TTree) => (entityKey: string, entity: any) => {
    if (!tree.pluginEntities) tree.pluginEntities = {};
    if (!tree.pluginEntities[entityKey]) tree.pluginEntities[entityKey] = {};

    tree.pluginEntities[entityKey][entity.id] = entity;
  };
