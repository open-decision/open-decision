import { Tree } from "../type-classes";
import { getNode } from "../getters";
import { deleteConditions } from "./deleteConditions";
import { deleteEdges } from "./deleteEdges";
import { deleteInputs } from "./deleteInputs";

export const deleteNodes = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    const node = getNode(tree)(id);
    if (!node) return;

    delete tree.nodes?.[id];

    // When a Node is deleted there cannot be any Edges using this
    // Node as a source or target anymore.
    deleteEdges(tree)(
      Object.values(tree.edges ?? {})
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => edge.id)
    );

    // When a Node is deleted all its Inputs should also be deleted.
    if (node?.data.inputs) {
      deleteInputs(tree)(node?.data.inputs);
    }

    // When a Node is deleted all its Condition should also be deleted.
    if (node?.data.conditions) {
      deleteConditions(tree)(node.data.conditions);
    }
  });
};
