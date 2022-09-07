import { Tree } from "@open-decision/type-classes";
import { InterpreterContext } from "./interpreter";
import { createTreeClient } from "@open-decision/tree-client";

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
    getCurrentNode: () =>
      treeClient.nodes.get.single(
        interpreterContext.history.nodes[interpreterContext.history.position]
      ),
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
