import { getSingle } from "../getters/getSingle";
import { INodePlugin } from "../plugin";
import { Node, Tree } from "../type-classes";
import { createNode } from "./createNode";

export const createChildNode =
  (tree: Tree.TTree) =>
  <TNodeType extends Node.TNode>(nodeId: string, newNode: TNodeType) => {
    // Get the node we want the children for
    const node = getSingle(tree)<INodePlugin>("nodes")(nodeId);

    if (node instanceof Error) throw node;

    // Fitler the edges to only include the ones with the given node as the source
    const numberOfEdges = Object.values(tree.edges ?? {}).filter(
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
