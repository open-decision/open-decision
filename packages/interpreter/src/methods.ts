import { ODProgrammerError } from "@open-decision/type-classes";
import { createTreeClient, Tree } from "@open-decision/tree-sync";
import { InterpreterContext } from "./interpreter";

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
  const treeClient = createTreeClient(tree);

  return {
    getCurrentNode: () => {
      const currentNode = treeClient.nodes.get.single(
        interpreterContext.history.nodes[interpreterContext.history.position]
      );

      if (!currentNode)
        throw new ODProgrammerError({
          code: "INTERPRETER_WITHOUT_CURRENT_NODE",
          message:
            "The interpreter ended up in an invalid state without a current node.",
        });

      return currentNode;
    },
    getAnswer: (inputId: string) => {
      const maybeAnswer = interpreterContext.answers[inputId];
      if (!maybeAnswer) return undefined;

      return maybeAnswer;
    },
    canGoBack: canGoBack(interpreterContext),
    canGoForward: canGoForward(interpreterContext),
    hasHistory: () => interpreterContext.history.nodes.length > 1,
  };
}
