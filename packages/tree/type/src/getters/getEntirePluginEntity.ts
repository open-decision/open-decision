import { Tree } from "../type-classes";
import { IEntityBase } from "../plugin";

export const getEntirePluginEntity =
  (tree: Tree.TTree) =>
  <TType extends IEntityBase>(entityKey: string) => {
    if (!tree.pluginEntities) return undefined;
    const data = tree.pluginEntities[entityKey];

    return data as Record<string, TType>;
  };
