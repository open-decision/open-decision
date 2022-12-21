import { ODProgrammerError } from "@open-decision/type-classes";
import { isEmpty } from "ramda";
import { pick } from "remeda";
import { Tree } from "../type-classes";

/**
 * Returns a single node from the tree.
 * @throws {ODProgrammerError} if the node does not exist
 */
export const getNode = <TTree extends Tree.TTree>(tree: TTree) =>
  function getNode(nodeId: string) {
    const node = tree.nodes?.[nodeId];

    if (!node)
      return new ODProgrammerError({
        code: "ENTITY_NOT_FOUND",
        message: "Tried to get a node that does not exist on the tree.",
      });

    return node;
  };

export const getNodes =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeIds?: string[]): TTree["nodes"] | undefined => {
    if (!tree.nodes) return undefined;
    if (!nodeIds) return tree.nodes;

    const nodes = pick(tree.nodes, nodeIds);
    if (!nodes || isEmpty(nodes)) return undefined;

    return nodes;
  };
