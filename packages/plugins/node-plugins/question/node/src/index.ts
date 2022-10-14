import { TTreeClient } from "@open-decision/tree-type";
import { QuestionNode } from "./CanvasNode";
import { QuestionNodePlugin } from "./plugin";
import { QuestionNodeSidebar } from "./Sidebar";
import { Content, Actions } from "./Renderer";

export * from "./plugin";
export { QuestionNode } from "./CanvasNode";
export { QuestionNodeSidebar } from "./Sidebar";

export const createQuestionNodePlugin = (treeClient: TTreeClient) => {
  const plugin = new QuestionNodePlugin(treeClient);

  return {
    treeClient,
    plugin,
    Node: QuestionNode,
    Sidebar: QuestionNodeSidebar,
    Renderer: { Content, Actions },
    type: "question",
    pluginEntities: { inputs: plugin.inputType },
  };
};
