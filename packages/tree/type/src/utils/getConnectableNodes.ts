import { pipe, filter, map, values } from "remeda";
import { INodePlugin, TNodeId } from "../plugin";
import { Tree } from "../type-classes";
import { getPaths } from "./getPaths";

export const getConnectableNodes =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeId: TNodeId): TNodeId[] => {
    if (!tree.nodes) return [];

    const nodesOnPath = getPaths(tree)(nodeId).flatMap((path) => path);
    const isPreviousNode = (node: INodePlugin) => nodesOnPath.includes(node.id);

    return pipe(
      tree.nodes,
      values,
      filter(
        (iteratedNode) =>
          // Filter out the node itself and all the previous nodes that it is connected to
          iteratedNode.id !== nodeId && !isPreviousNode(iteratedNode)
      ),
      map((node) => node.id)
    );
  };
