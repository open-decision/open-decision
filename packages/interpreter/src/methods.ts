import {
  ReadOnlyTreeClient,
  TReadOnlyTreeClient,
  Tree,
  TTreeClient,
} from "@open-decision/tree-type";
import { ODProgrammerError } from "@open-decision/type-classes";
import { InterpreterContext } from "./interpreter";

function getAnswers(interpreterContext: InterpreterContext) {
  return interpreterContext.answers;
}

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
    getAnswers: () => getAnswers(interpreterContext),
    canGoBack: canGoBack(interpreterContext),
    canGoForward: canGoForward(interpreterContext),
    hasHistory: () => interpreterContext.history.nodes.length > 1,
  };
}
