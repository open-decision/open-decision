import { TNodeId } from "@open-decision/tree-ids";
import { fromPairs, isEmpty } from "ramda";
import { INode } from "../plugin";
import { Tree } from "../type-classes";
import { getNodeSingle } from "./getNodeSingle";

export const getNodeMany =
  (tree: Tree.TTree) =>
  <TType extends INode>(ids: TNodeId[], type?: TType["type"]) => {
    const nodes = fromPairs(
      ids.map((id) => [id, getNodeSingle(tree)(id, type)])
    );

    if (!isEmpty(nodes)) return undefined;

    return nodes as Record<TNodeId, TType>;
  };
