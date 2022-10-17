import { Tree } from "../type-classes";
import { pick } from "remeda";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";

export const getPluginEntities =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(
    entityKey: string,
    ids: string[],
    type: TType
  ): z.infer<TType> | undefined => {
    if (!tree.pluginEntities) return undefined;
    if (!tree.pluginEntities[entityKey]) return undefined;

    const entities = pick(tree.pluginEntities[entityKey], ids);

    const parsedEntities = type.safeParse(entities);
    console.log(entities);

    if (!parsedEntities.success) {
      console.error(parsedEntities.error);
      throw new ODProgrammerError({
        code: "INVALID_REQUESTED_PLUGIN_ENTITY",
        message: "The requested plugin entity is not of the provided type.",
      });
    }

    return parsedEntities.data;
  };
