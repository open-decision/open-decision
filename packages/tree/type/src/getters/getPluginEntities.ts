import { Tree } from "../type-classes";
import { fromPairs } from "remeda";
import { IEntityPluginBase, TId } from "../plugin/EntityPlugin";
import { getPluginEntity } from "./getPluginEntity";

export const getPluginEntities =
  (tree: Tree.TTree) =>
  <TType extends IEntityPluginBase>(entityKey: string, ids: TId[]) => {
    if (!tree.pluginEntities) return undefined;
    if (!tree.pluginEntities[entityKey]) return undefined;

    const data = fromPairs(
      ids.map((id) => [id, getPluginEntity(tree)(entityKey, id)])
    );

    return data as Record<string, TType>;
  };
