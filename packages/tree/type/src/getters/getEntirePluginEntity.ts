import { Tree } from "../type-classes";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";

export const getEntirePluginEntity =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(
    entityKey: string,
    type: TType
  ): Record<string, z.infer<TType>> | undefined => {
    if (!tree.pluginEntities) return undefined;
    const parsedEntity = z
      .record(type)
      .safeParse(tree.pluginEntities[entityKey]);

    if (!parsedEntity.success) {
      console.error(parsedEntity.error);
      throw new ODProgrammerError({
        code: "INVALID_REQUESTED_PLUGIN_ENTITY",
        message: "The requested plugin entity is not of the provided type.",
      });
    }

    return parsedEntity.data;
  };
