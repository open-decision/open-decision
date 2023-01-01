import { Tree } from "../type-classes";

export const findEntityOfKey = (tree: Tree.TTree, id: string) => {
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
