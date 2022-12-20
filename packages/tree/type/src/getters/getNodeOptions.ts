import { Tree } from "../type-classes";
import { getConnectableNodes } from "../utils";
import { getNodeNames } from "./getNodeNames";

/**
 * Get the possible connectable options for a node.
 */
export const getNodeOptions = (tree: Tree.TTree) =>
  function getNodeOptions(nodeId: string, fallbackName?: string) {
    const connectableNodes = getConnectableNodes(tree)(nodeId);

    return getNodeNames(tree)(connectableNodes, fallbackName);
  };
