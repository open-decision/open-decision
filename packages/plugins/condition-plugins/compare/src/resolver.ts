import {
  getCurrentNode,
  MissingAnswerOnInterpreterContextError,
  MissingEdgeForThruthyConditionError,
} from "@open-decision/interpreter";
import { ConditionResolver } from "@open-decision/condition-plugins-helpers";
import { TCompareCondition } from "./plugin";

export const resolver: ConditionResolver<TCompareCondition> =
  (treeClient) => (condition) => (context) => {
    const currentNode = getCurrentNode(treeClient, context);
    // We only care about the edges where the node of of the event is the source node.
    const sourceEdges = treeClient.edges.get.byNode(currentNode.id)?.source;

    // Get a possibly existing answer from the interpreter context
    const existingAnswerId = context.answers[condition.data.variableId];

    console.log({ condition, existingAnswerId });

    // We expect there to be an answer on the interpreter context.
    // Not finding an answer on the interpreter context is a programmer error.
    if (!(condition.data.valueId === existingAnswerId))
      throw new MissingAnswerOnInterpreterContextError();

    // On the edges of the provided node we expect to find an edge with this conditionId
    const edge = Object.values(sourceEdges ?? {}).find(
      (edge) => edge["conditionId"] === condition.id
    );

    if (edge) return { state: "success", target: edge.target };

    // If we could not find an edge for this condition, we return an error, because the
    // condition is thruthy but cannot be resolved without a valid edge.
    return { state: "error", error: new MissingEdgeForThruthyConditionError() };
  };
