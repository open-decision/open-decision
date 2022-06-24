import { TTreeClient } from "@open-decision/type-classes";
import { create } from "./create";
import { getCompareConditionByAnswer } from "./getCompareConditionByAnswer";
import { getCompareConditionByNode } from "./getCompareConditionByNode";

export function comparePlugin(treeClient: TTreeClient) {
  return {
    create: create(treeClient),
    getBy: {
      node: getCompareConditionByNode(treeClient),
      answer: getCompareConditionByAnswer(treeClient),
    },
  };
}
