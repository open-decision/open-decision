import { Tree } from "../type-classes";
import { getPaths } from "./getPaths";

export const isCircular =
  (tree: Tree.TTree) =>
  ({ source, target }: { source: string; target: string }) => {
    const nodesOnPaths = getPaths(tree)(source).flatMap((path) => path);

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };
