import { TEdgeId } from "@open-decision/tree-id";
import { Tree } from "../type-classes";

export const deleteEdges = (tree: Tree.TTree) => (ids: TEdgeId[]) => {
  ids.forEach((id) => {
    delete tree.edges?.[id];
  });
};
