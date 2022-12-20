import { Tree } from "../type-classes";
import { pick } from "remeda";
import { z } from "zod";

export const getPluginEntities =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(entityKey: string, ids: string[]) => {
    if (!tree.pluginEntities) return undefined;
    if (!tree.pluginEntities[entityKey]) return undefined;

    const data = pick(tree.pluginEntities[entityKey], ids);

    return data as Record<string, z.infer<TType>>;
  };
