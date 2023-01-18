import {
  getCurrentNode,
  getVariable,
  MissingAnswerOnInterpreterContextError,
  MissingEdgeForThruthyConditionError,
} from "@open-decision/interpreter";
import { EdgeResolver } from "@open-decision/plugins-edge-helpers";
import { ODProgrammerError } from "@open-decision/type-classes";
import { ICompareEdge } from "./plugin";

export const compareEdgeResolver: EdgeResolver<ICompareEdge> =
  (treeClient) => (edge) => (context) => {
    const currentNode = getCurrentNode(treeClient, context);

    if (currentNode instanceof ODProgrammerError)
      return { state: "error", error: currentNode };

    const condition = edge.condition;

    if (!condition || !edge.target) return { state: "failure" };

    // Get a possibly existing answer from the interpreter context
    const variable = getVariable(context, currentNode.id, treeClient);

    // We expect there to be an answer on the interpreter context.
    // Not finding an answer on the interpreter context is a programmer error.
    if (!variable) throw new MissingAnswerOnInterpreterContextError();

    if (!variable.value || !condition.valueIds.includes(variable.value))
      return { state: "failure" };

    if (edge) return { state: "success", target: edge.target };

    // If we could not find an edge for this condition, we return an error, because the
    // condition is thruthy but cannot be resolved without a valid edge.
    return { state: "error", error: new MissingEdgeForThruthyConditionError() };
  };
