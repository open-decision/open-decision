import { Tree } from "@open-decision/type-classes";
import { pick } from "remeda";
import { InterpreterContext } from "./interpreter";

export function createInterpreterMethods(
  interpreterContext: InterpreterContext,
  tree: Tree.TTree
) {
  const treeMethods = Tree.createTreeMethods(tree);

  return {
    getCurrentNode: () =>
      treeMethods.getNode(
        interpreterContext.history.nodes[interpreterContext.history.position]
      ),
    getAnswer: (inputId: string) => {
      const maybeAnswer = interpreterContext.answers[inputId];
      if (!maybeAnswer) return undefined;
      return maybeAnswer;
    },
    hasHistory: () => interpreterContext.history.nodes.length > 1,
    ...pick(treeMethods, [
      "getChildren",
      "getCondition",
      "getConditions",
      "getEdge",
      "getInput",
      "getInputs",
      "getNode",
    ]),
  };
}
