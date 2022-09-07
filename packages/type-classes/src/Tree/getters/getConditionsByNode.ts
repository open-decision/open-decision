import { pick } from "remeda";
import { Node, Condition } from "../..";

export const getConditionsByNode =
  (nodes: Node.TNodesRecord, conditions: Condition.TRecord) =>
  (nodeId: string): Condition.TRecord | undefined => {
    const node = nodes?.[nodeId];

    if (conditions && node) {
      return pick(conditions, node.data.conditions);
    }

    return;
  };
