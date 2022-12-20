import { getEdgesByNode } from "../getters";
import { Tree } from "../type-classes";
import { deleteEdges } from "./deleteEdges";

export const deleteNodes = (tree: Tree.TTree) => (ids: string[]) => {
  ids.forEach((id) => {
    const edges = getEdgesByNode(tree)(id);

    const edgesToDelete = [] as string[];

    Object.values(edges?.source ?? {}).forEach((edge) =>
      edgesToDelete.push(edge.id)
    );
    Object.values(edges?.target ?? {}).forEach((edge) =>
      edgesToDelete.push(edge.id)
    );

    deleteEdges(tree)(edgesToDelete);

    delete tree.nodes?.[id];
  });
};
