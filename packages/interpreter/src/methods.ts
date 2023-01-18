import {
  createReadableKey,
  ReadOnlyTreeClient,
  TNodeId,
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
} from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { IVariable } from "@open-decision/variables";
import { InterpreterContext } from "./interpreter";

export function getVariables(interpreterContext: InterpreterContext) {
  return interpreterContext.variables;
}

export const getVariable = <TVariableType extends IVariable = IVariable>(
  interpreterContext: InterpreterContext,
  nodeId: TNodeId,
  treeClient: TTreeClient | TReadOnlyTreeClient
) => {
  const node = treeClient.nodes.get.single(nodeId);

  if (!node || !node.name) return;

  const nodeName = createReadableKey(node.name);

  return interpreterContext.variables[nodeName] as TVariableType;
};

export const getCurrentNode = (
  treeClient: TTreeClient | TReadOnlyTreeClient,
  context: InterpreterContext
) => {
  const currentNode = treeClient.nodes.get.single(
    context.history.nodes[context.history.position]
  );

  if (!currentNode)
    return new ODProgrammerError({
      code: "INTERPRETER_WITHOUT_CURRENT_NODE",
      message:
        "The interpreters current node is invalid, because it cannot be found on the tree.",
    });

  return currentNode;
};

export const canGoBack = (interpreterContext: InterpreterContext) =>
  interpreterContext.history.nodes.length > 1 &&
  interpreterContext.history.position <
    interpreterContext.history.nodes.length - 1;

export const canGoForward = (interpreterContext: InterpreterContext) =>
  interpreterContext.history.position > 0;

export function createInterpreterMethods(
  interpreterContext: InterpreterContext,
  tree: Tree.TTree
) {
  const treeClient = new ReadOnlyTreeClient(tree);

  return {
    treeClient,
    getCurrentNode: () => getCurrentNode(treeClient, interpreterContext),
    getVariables: () => getVariables(interpreterContext),
    getVariable: (nodeId: TNodeId) =>
      getVariable(interpreterContext, nodeId, treeClient),
    canGoBack: canGoBack(interpreterContext),
    canGoForward: canGoForward(interpreterContext),
    hasHistory: () => interpreterContext.history.nodes.length > 1,
  };
}
