import { Tree } from "../type-classes";
import { z } from "zod";

export const getEntirePluginEntity =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(entityKey: string) => {
    if (!tree.pluginEntities) return undefined;
    const data = tree.pluginEntities[entityKey];

    return data as Record<string, z.infer<TType>>;
  };
