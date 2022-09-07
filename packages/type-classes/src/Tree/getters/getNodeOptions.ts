import { Tree, Edge } from "../type-classes";
import { getConnectableNodes } from "../utils";
import { getNode } from "./getNode";
import { getNodeNames } from "./getNodeNames";

export const getNodeOptions =
  (tree: Tree.TTree) => (nodeId: string, edge?: Edge.TEdge) => {
    const node = getNode(tree)(nodeId);

    const nodeOptions = node
      ? edge?.target
        ? ([...getConnectableNodes(tree)(nodeId), edge.target] as string[])
        : getConnectableNodes(tree)(nodeId)
      : ([] as string[]);

    return getNodeNames(tree)(nodeOptions);
  };
