import { isEmpty } from "ramda";
import { Edge, Tree } from "../type-classes";

export const getEdgesByNode = (tree: Tree.TTree) => (nodeId: string) => {
  const nodesEdges: Edge.TEdgesRecord = {};

  if (tree.edges) {
    for (const key in tree.edges) {
      const edge = tree.edges[key];

      if (edge.source === nodeId) nodesEdges[key] = edge;
    }
  }

  if (isEmpty(nodesEdges)) return undefined;

  return nodesEdges;
};
