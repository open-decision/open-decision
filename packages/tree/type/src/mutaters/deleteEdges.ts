import { TEdgeId } from "@open-decision/tree-ids";
import { Tree } from "../type-classes";

export const deleteEdges = (tree: Tree.TTree) => (ids: TEdgeId[]) => {
  ids.forEach((id) => {
    delete tree.edges?.[id];
  });
};
