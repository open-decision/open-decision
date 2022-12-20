import { Tree } from "../type-classes";
import { z } from "zod";
import { ODProgrammerError } from "@open-decision/type-classes";
import { findEntityOfKey } from "./findEntityOfKey";

export const getPluginEntity = (tree: Tree.TTree) =>
  function <TType extends z.ZodTypeAny>(entityKey: string, id: string) {
    if (!tree.pluginEntities)
      throw new ODProgrammerError({
        code: "NO_PLUGIN_ENTITIES_AVAILABLE",
        message: "The tree does not have any plugin entities available.",
      });
    if (!tree.pluginEntities[entityKey])
      throw new ODProgrammerError({
        code: "REQUESTED_PLUGIN_ENTITY_GROUP_NOT_FOUND",
        message: "The requested plugin entity group does not exist.",
      });

    const data = tree.pluginEntities[entityKey][id];

    if (!data) {
      const keyEntity = findEntityOfKey(tree, id);

      if (!keyEntity)
        throw new ODProgrammerError({
          code: "ENTITY_NOT_FOUND",
          message: `The requested entity of id ${id} on entityKey ${entityKey} does not exist anywhere in the tree.`,
        });

      throw new ODProgrammerError({
        code: "ENTITY_FOUND_ON_DIFFERENT_ENTITY_KEY",
        message: `The tree has an entity for the id ${id}, but it is not in ${entityKey}, but in ${keyEntity}.`,
      });
    }

    return data as z.infer<TType>;
  };
