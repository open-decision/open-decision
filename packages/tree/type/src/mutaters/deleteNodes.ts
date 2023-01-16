import { getEdgesByNode } from "../getters";
import { TEdgeId, TNodeId } from "../plugin";
import { Tree } from "../type-classes";
import { deleteEdges } from "./deleteEdges";

export const deleteNodes = (tree: Tree.TTree) => (ids: TNodeId[]) => {
  ids.forEach((id) => {
    const edges = getEdgesByNode(tree)(id);

    const edgesToDelete = [] as TEdgeId[];

    if (edges?.source) {
      Object.values(edges.source).forEach((edge) =>
        edgesToDelete.push(edge.id)
      );
    }

    if (edges?.target) {
      Object.values(edges.target).forEach((edge) =>
        edgesToDelete.push(edge.id)
      );
    }

    deleteEdges(tree)(edgesToDelete);

    delete tree.nodes?.[id];
  });
};
