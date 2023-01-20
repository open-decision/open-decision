import { TNodeId } from "@open-decision/tree-id";
import {
  createReadableKey,
  ReadOnlyTreeClient,
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
} from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { canGoForwardInArray } from "@open-decision/utils";
import { TModuleVariableValue } from "@open-decision/variables";
import { InterpreterMachine, InterpreterState } from "./interpreter";

export function getVariables(interpreterContext: TModuleVariableValue) {
  return interpreterContext.variables;
}

export const getVariable = (
  interpreterContext: TModuleVariableValue,
  nodeId: TNodeId,
  treeClient: TTreeClient | TReadOnlyTreeClient
) => {
  const node = treeClient.nodes.get.single(nodeId);

  if (!node || !node.name) return;

  const nodeName = createReadableKey(node.name);

  const variable = interpreterContext.variables[nodeName];

  return variable;
};

export const getCurrentNode = (
  treeClient: TTreeClient | TReadOnlyTreeClient,
  context: TModuleVariableValue
) => {
  const currentNode = treeClient.nodes.get.single(
    context.history.nodes[context.history.position].id
  );

  if (!currentNode)
    return new ODProgrammerError({
      code: "INTERPRETER_WITHOUT_CURRENT_NODE",
      message:
        "The interpreters current node is invalid, because it cannot be found on the tree.",
    });

  return currentNode;
};

export function createInterpreterMethods(
  machine: InterpreterMachine,
  state: InterpreterState,
  tree: Tree.TTree
) {
  const treeClient = new ReadOnlyTreeClient(tree);

  return {
    treeClient,
    getCurrentNode: () => getCurrentNode(treeClient, state.context),
    getVariables: () => getVariables(state.context),
    getVariable: (nodeId: TNodeId) =>
      getVariable(state.context, nodeId, treeClient),
    canGoBack:
      machine instanceof Error
        ? false
        : machine?.transition(state, { type: "GO_BACK" }),
    canGoForward: canGoForwardInArray(
      state.context.history.nodes,
      state.context.history.position
    ),
    hasHistory: () => state.context.history.nodes.length > 1,
    getSubHistory: () =>
      state.context.history.nodes[state.context.history.position].subHistory ??
      ([] as TModuleVariableValue["history"]["nodes"]),
  };
}
