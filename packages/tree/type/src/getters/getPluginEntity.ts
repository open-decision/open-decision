import { IEntityPluginBase, TId } from "../plugin";
import { Tree } from "../type-classes";

export const getPluginEntity = (tree: Tree.TTree) =>
  function <TType extends IEntityPluginBase>(entityKey: string, id: TId) {
    const entity = tree.pluginEntities[entityKey][id];

    if (!entity) return undefined;

    return entity as TType;
  };
