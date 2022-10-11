import { TTreeClient } from "@open-decision/tree-type";
import { NodePluginObject } from "@open-decision/node-plugins-helpers";
import { QuestionNode } from "./CanvasNode";
import { DataType, QuestionNodePlugin, TQuestionNode } from "./plugin";
import { QuestionNodeSidebar } from "./Sidebar";

export * from "./plugin";
export { QuestionNode } from "./CanvasNode";
export { QuestionNodeSidebar } from "./Sidebar";

export const createQuestionNodePlugin = (
  treeClient: TTreeClient
): NodePluginObject<
  typeof DataType,
  QuestionNodePlugin["typeName"],
  TQuestionNode
> => {
  return {
    plugin: new QuestionNodePlugin(treeClient),
    Node: QuestionNode,
    Sidebar: QuestionNodeSidebar,
    type: "question",
  };
};
