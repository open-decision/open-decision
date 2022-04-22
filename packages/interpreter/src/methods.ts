import { Tree } from "@open-decision/type-classes";
import { pick } from "remeda";
import { InterpreterContext } from "./interpreter";

export function createInterpreterMethods(
  interpreterContext: InterpreterContext
) {
  const treeMethods = Tree.createTreeMethods(interpreterContext.tree);

  return {
    getCurrentNode: () => treeMethods.getNode(interpreterContext.currentNodeId),
    getAnswer: (inputId: string) => {
      const maybeAnswer = interpreterContext.history.answers[inputId];
      if (!maybeAnswer) return undefined;
      return maybeAnswer;
    },
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
