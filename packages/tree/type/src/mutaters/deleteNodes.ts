import { Tree } from "../type-classes";
import { getNode } from "../getters";
import { deleteEdges } from "./deleteEdges";
import { deleteInputs } from "./deleteInputs";

export const deleteNodes = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    const node = getNode(tree)(id);

    delete tree.nodes?.[id];

    //FIXME https://linear.app/open-decision/issue/DEV-81/how-to-handle-relationships-on-type-change-or-deletion-of-associated
    // When a Node is deleted there cannot be any Edges using this
    // Node as a source or target anymore.
    deleteEdges(tree)(
      Object.values(tree.edges ?? {})
        .filter((edge) => edge.source === id || edge.target === id)
        .map((edge) => edge.id)
    );

    // When a Node is deleted all its Inputs should also be deleted.
    if (node.inputs) {
      deleteInputs(tree)(node.inputs);
    }
  });
};
