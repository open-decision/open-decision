import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
  MissingEdgeForThruthyConditionException,
} from "@open-decision/interpreter";
import { TTreeClient } from "@open-decision/type-classes";
import { TDirectCondition } from "./plugin";

export const resolver =
  (treeClient: TTreeClient) =>
  (condition: TDirectCondition) =>
  (_context: InterpreterContext, event: EVALUATE_NODE_CONDITIONS) => {
    const edges = treeClient.edges.get.byNode(event.nodeId);

    // On the edges of the provided node we expect to find an edge with this conditionId
    const edge = Object.values(edges ?? {}).find(
      (edge) => edge.conditionId === condition.id
    );

    if (edge) return edge.target;

    return new MissingEdgeForThruthyConditionException();
  };
