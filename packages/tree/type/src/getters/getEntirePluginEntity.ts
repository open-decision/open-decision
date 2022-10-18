import { Tree } from "../type-classes";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";

export const getEntirePluginEntity =
  (tree: Tree.TTree) =>
  <TType extends z.ZodTypeAny>(entityKey: string, type: TType) => {
    if (!tree.pluginEntities) return undefined;
    const data = tree.pluginEntities[entityKey];
    const parsedEntity = z.record(type).safeParse(data);

    if (!parsedEntity.success) {
      console.error(parsedEntity.error);
      throw new ODProgrammerError({
        code: "INVALID_REQUESTED_PLUGIN_ENTITY",
        message: "The requested plugin entity is not of the provided type.",
      });
    }

    // We need to keep the reference to the original object.
    // The parse above is a safeguard to make sure the requested data is of the expected format.
    // We cannot return the data from the parse because it is a new object.
    return data as Record<string, z.infer<TType>>;
  };
