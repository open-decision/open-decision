import { getEdgesByCondition } from "../getters";
import { Tree } from "../type-classes";
import { deleteEdges } from "./deleteEdges";

export const deleteConditions = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    delete tree.conditions?.[id];

    //FIXME https://linear.app/open-decision/issue/DEV-81/how-to-handle-relationships-on-type-change-or-deletion-of-associated
    const edgesToDelete = Object.keys(getEdgesByCondition(tree)(id) ?? {});
    deleteEdges(tree)(edgesToDelete);
  });
};
