import { Tree } from "../type-classes";

export const findEntityOfKey = (tree: Tree.TTree, id: string) => {
  return Object.entries(tree).reduce((acc, [key, value]) => {
    // Once the accumulator has a value we have our result and can skip every
    // further iteration.
    if (acc) return acc;

    // Plugin entities are different, because they are an object of entity groups.
    // This is like the tree itself. In this case we want to know not just that
    // the key is in a plugin entity, but in which one specifically.
    if (key === "pluginEntities") {
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
        acc = `${key} > ${possiblePluginEntityKey}`;
      }

      return acc;
    }

    // If the value is an object we can check if has the is as a key.
    // If true we have our entityKey.
    if (typeof value === "object" && value[id]) {
      acc = key;
    }

    return acc;
  }, undefined as string | undefined);
};
