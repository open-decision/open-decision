import { ODProgrammerError } from "@open-decision/type-classes";
import { Tree } from "../type-classes";

export const findEntityOfId = (tree: Tree.TTree, id: string) => {
  for (const key in tree) {
    // Plugin entities are different, because they are an object of entity groups.
    // This is like the tree itself. In this case we want to know not just that
    // the key is in a plugin entity, but in which one specifically.
    if (key === "pluginEntities") {
      const value = tree[key];

      const possiblePluginEntityKey = Object.entries(value).reduce(
        (acc, [key, value]) => {
          if (acc) return acc;
          if (value[id]) {
            acc = key;
          }

          return acc;
        },
        undefined as string | undefined
      );

      if (possiblePluginEntityKey) {
        return `${key} > ${possiblePluginEntityKey}`;
      }
    }

    if (key === "nodes" || key === "edges") {
      const value = tree[key];

      // If the value is an object we can check if has the id as a key.
      // If true we have our entityKey.
      if (typeof value === "object" && value[id]) {
        return key;
      }
    }
  }

  return undefined;
};

export const lookupEntityOfKey =
  (entityKey: string) => (tree: Tree.TTree, id: string) => {
    const keyEntity = findEntityOfId(tree, id);

    if (!keyEntity)
      return new ODProgrammerError({
        code: "ENTITY_NOT_FOUND",
        message: `The requested entity of id ${id} on entityKey ${entityKey} does not exist anywhere in the tree.`,
      });

    return new ODProgrammerError({
      code: "ENTITY_FOUND_ON_DIFFERENT_ENTITY_KEY",
      message: `The tree has an entity for the id ${id}, but it is not in ${entityKey}, but in ${keyEntity}.`,
    });
  };
