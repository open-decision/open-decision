import { Tree } from "../type-classes";
import { deleteConditions } from "./deleteConditions";
import { removeInputFromNode } from "./removeInputFromNode";

export const deleteInputs = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.inputs?.[id];

    // When an input is deleted it needs to be removed from all Nodes using it.
    for (const nodeId in tree.nodes) {
      removeInputFromNode(tree)(nodeId, id);
    }

    // When an Input is deleted all conditions using it need to be removed.
    deleteConditions(tree)(
      Object.values(tree.conditions ?? {})
        .filter((condition) => condition.inputId === id)
        .map((condition) => condition.id)
    );
  });
};
