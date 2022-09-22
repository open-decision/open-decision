import { Tree } from "../type-classes";
import { deleteConditions } from "./deleteConditions";
import { disconnectInputAndNode } from "./disconnectInputAndNode";

export const deleteInputs = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.inputs?.[id];

    // When an input is deleted it needs to be removed from all Nodes using it.
    for (const nodeId in tree.nodes) {
      disconnectInputAndNode(tree)(nodeId, id);
    }

    //FIXME https://linear.app/open-decision/issue/DEV-81/how-to-handle-relationships-on-type-change-or-deletion-of-associated

    deleteConditions(tree)(
      Object.values(tree.conditions ?? {})
        .filter((condition) => condition.inputId === id)
        .map((condition) => condition.id)
    );
  });
};
