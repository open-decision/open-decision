import { MissingEdgeForThruthyConditionError } from "@open-decision/interpreter";
import { ConditionResolver } from "@open-decision/condition-plugins-helpers";
import { TDirectCondition } from "./plugin";

export const resolver: ConditionResolver<TDirectCondition> =
  (treeClient) => (condition) => (_context, event) => {
    const sourceEdges = treeClient.edges.get.byNode(event.nodeId)?.source;

    // On the edges of the provided node we expect to find an edge with this conditionId
    const edge = Object.values(sourceEdges ?? {}).find(
      (edge) => edge.conditionId === condition.id
    );

    if (edge) return { state: "success", target: edge.target };

    return { state: "error", error: new MissingEdgeForThruthyConditionError() };
  };
