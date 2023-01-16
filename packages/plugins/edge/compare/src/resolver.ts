import {
  getCurrentNode,
  MissingAnswerOnInterpreterContextError,
  MissingEdgeForThruthyConditionError,
} from "@open-decision/interpreter";
import { EdgeResolver } from "@open-decision/plugins-edge-helpers";
import { SelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { ODProgrammerError } from "@open-decision/type-classes";
import { ICompareEdge } from "./plugin";

const SelectVariable = new SelectVariablePlugin();

export const compareEdgeResolver: EdgeResolver<ICompareEdge> =
  (treeClient) => (edge) => (context) => {
    const currentNode = getCurrentNode(treeClient, context);

    if (currentNode instanceof ODProgrammerError)
      return { state: "error", error: currentNode };

    const condition = edge.condition;

    if (!condition || !edge.target) return { state: "failure" };

    // Get a possibly existing answer from the interpreter context
    const existingAnswer = SelectVariable.get(currentNode.id, context.answers);

    // We expect there to be an answer on the interpreter context.
    // Not finding an answer on the interpreter context is a programmer error.
    if (!existingAnswer) throw new MissingAnswerOnInterpreterContextError();

    if (
      !existingAnswer.value ||
      !condition.valueIds.includes(existingAnswer.value)
    )
      return { state: "failure" };

    if (edge) return { state: "success", target: edge.target };

    // If we could not find an edge for this condition, we return an error, because the
    // condition is thruthy but cannot be resolved without a valid edge.
    return { state: "error", error: new MissingEdgeForThruthyConditionError() };
  };
