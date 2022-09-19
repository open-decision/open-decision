import { isEmpty } from "ramda";
import { pick } from "remeda";
import { ValuesType } from "utility-types";
import { Tree } from "../type-classes";

export const getNode =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeId: string) => {
    return tree.nodes?.[nodeId] as
      | ValuesType<NonNullable<TTree["nodes"]>>
      | undefined;
  };

export const getNodes =
  <TTree extends Tree.TTree>(tree: TTree) =>
  (nodeIds?: string[]) => {
    if (!tree.nodes) return undefined;

    if (!nodeIds) return tree.nodes;

    const nodes = pick(tree.nodes, nodeIds);
    if (!nodes || isEmpty(nodes)) return undefined;

    return nodes;
  };
