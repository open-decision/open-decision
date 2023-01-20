import { TNodeId } from "@open-decision/tree-id";
import { values } from "remeda";
import { getNodeSingle } from "../getters";
import { INode } from "../plugin";
import { Tree } from "../type-classes";
import { createNode } from "./createNode";

export const createChildNode =
  (tree: Tree.TTree) =>
  <TNodeType extends INode>(nodeId: TNodeId, newNode: TNodeType) => {
    // Get the node we want the children for
    const node = getNodeSingle(tree)(nodeId);

    if (!node) return undefined;

    // Fitler the edges to only include the ones with the given node as the source
    const numberOfEdges = values(tree.edges ?? {}).filter(
      (edge) => edge.source === nodeId
    ).length;

    // The new node position is somewhat displaced from the parent node
    const position = {
      x: node.position.x + 5 * numberOfEdges,
      y: node.position.y + 80 + 50,
    };

    return createNode(tree)({
      ...newNode,
      position,
    });
  };
