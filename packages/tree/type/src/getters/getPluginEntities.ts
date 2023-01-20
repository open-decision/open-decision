import { Tree } from "../type-classes";
import { fromPairs } from "remeda";
import { IEntityBase } from "../plugin/EntityPlugin";
import { getPluginEntity } from "./getPluginEntity";
import { TId } from "@open-decision/tree-id";

export const getPluginEntities =
  (tree: Tree.TTree) =>
  <TType extends IEntityBase>(entityKey: string, ids: TId[]) => {
    if (!tree.pluginEntities) return undefined;
    if (!tree.pluginEntities[entityKey]) return undefined;

    const data = fromPairs(
      ids.map((id) => [id, getPluginEntity(tree)(entityKey, id)])
    );

    return data as Record<string, TType>;
  };
