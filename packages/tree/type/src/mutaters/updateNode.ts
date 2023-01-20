import { TNodeId } from "@open-decision/tree-id";
import { keys } from "remeda";
import { getEdgesByNode } from "../getters";
import { INode } from "../plugin";
import { Tree } from "../type-classes";
import { deleteEdges } from "./deleteEdges";

export const updateNode =
  (tree: Tree.TTree) =>
  <TNode extends INode>(nodeId: TNodeId, newNode: TNode) => {
    const nodes = tree.nodes;
    const edges = getEdgesByNode(tree)(nodeId);

    if (!nodes) return;

    if (edges?.source) {
      deleteEdges(tree)(keys.strict(edges.source));
    }

    nodes[nodeId] = { ...newNode, id: nodeId };
  };
