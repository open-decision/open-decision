import {
  InterpreterContext,
  EVALUATE_NODE_CONDITIONS,
  MissingEdgeForThruthyConditionError,
  NoTruthyConditionError,
} from "@open-decision/interpreter";
import { TTreeClient } from "@open-decision/tree-sync";
import { TCompareCondition } from "./plugin";

export const resolver =
  (treeClient: TTreeClient) =>
  (condition: TCompareCondition) =>
  (context: InterpreterContext, event: EVALUATE_NODE_CONDITIONS) => {
    const edges = treeClient.edges.get.byNode(event.nodeId);

    // Get a possibly existing answer from the interpreter context
    const existingAnswerId = context.answers[condition.inputId];

    // We expect there to be an answer on the interpreter context.
    if (condition.answerId === existingAnswerId) {
      // On the edges of the provided node we expect to find an edge with this conditionId
      const edge = Object.values(edges ?? {}).find(
        (edge) => edge.conditionId === condition.id
      );

      if (edge) return edge.target;

      return new MissingEdgeForThruthyConditionError();
    }

    return new NoTruthyConditionError();
  };
