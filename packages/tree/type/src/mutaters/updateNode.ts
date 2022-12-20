import { getEdgesByNode } from "../getters";
import { Node, Tree } from "../type-classes";
import { deleteEdges } from "./deleteEdges";

export const updateNode =
  (tree: Tree.TTree) =>
  <TNode extends Node.TNode>(nodeId: string, newNode: TNode) => {
    const nodes = tree.nodes;
    const edges = getEdgesByNode(tree)(nodeId);

    if (!nodes) return;

    deleteEdges(tree)(Object.keys(edges?.source ?? {}));

    nodes[nodeId] = { ...newNode, id: nodeId };
  };
