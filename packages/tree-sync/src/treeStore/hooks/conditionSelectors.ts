import { useSnapshot } from "valtio";
import { useTreeContext } from "../TreeContext";
import { pick } from "remeda";
import { Condition } from "@open-decision/type-classes";

export function useCondition(id: string) {
  const { tree } = useTreeContext();

  const {
    tree: { conditions },
  } = useSnapshot(tree);

  return conditions?.[id];
}

export function useConditions(ids?: string[]) {
  const { tree } = useTreeContext();

  const {
    tree: { conditions },
  } = useSnapshot(tree);

  if (!conditions) return {};
  if (ids) return pick(conditions, ids);

  return conditions;
}

export function useConditionsOfNode(
  nodeId: string
): Condition.TRecord | undefined {
  const { tree } = useTreeContext();
  const {
    tree: { conditions, nodes },
  } = useSnapshot(tree);
  const node = nodes?.[nodeId];

  if (conditions && node) {
    return pick(conditions, node.data.conditions);
  }

  return undefined;
}
