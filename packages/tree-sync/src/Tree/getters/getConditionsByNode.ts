import { pick } from "remeda";
import { Condition, Tree } from "../type-classes";

export const getConditionsByNode =
  (tree: Tree.TTree) =>
  (nodeId: string): Condition.TRecord | undefined => {
    const node = tree.nodes?.[nodeId];

    if (tree.conditions && node) {
      return pick(tree.conditions, node.data.conditions);
    }

    return;
  };
