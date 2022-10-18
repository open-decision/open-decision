import { Tree } from "../type-classes";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";

export const getPluginEntity =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(entityKey: string, id: string, type: TType) => {
    if (!tree.pluginEntities) return undefined;
    if (!tree.pluginEntities[entityKey]) return undefined;

    const data = tree.pluginEntities[entityKey][id];

    const parsedEntity = type.safeParse(data);

    if (!parsedEntity.success) {
      console.error(parsedEntity.error);
      throw new ODProgrammerError({
        code: "INVALID_REQUESTED_PLUGIN_ENTITY",
        message: "The requested plugin entity is not of the provided type.",
      });
    }

    return data as z.infer<TType>;
  };
