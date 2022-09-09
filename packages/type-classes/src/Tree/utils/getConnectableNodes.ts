import { pipe, filter, map } from "remeda";
import { Tree } from "../type-classes";
import { getChildren } from "./getChildren";
import { getPaths } from "./getPaths";

export const getConnectableNodes =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeId: string): string[] => {
    const nodesOnPath = getPaths(tree)(nodeId).flatMap((path) => path);
    const nodesChildren = getChildren(tree)(nodeId);

    return pipe(
      tree.nodes ?? {},
      Object.values,
      filter(
        (iteratedNode) =>
          iteratedNode.id !== nodeId &&
          !nodesOnPath.includes(iteratedNode.id) &&
          !nodesChildren.includes(iteratedNode.id)
      ),
      map((node) => node.id)
    );
  };
