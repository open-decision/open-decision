import {
  QuestionNode,
  QuestionNodeSidebar,
} from "@open-decision/node-plugins-question";
import { NodeTypes } from "@open-decision/node-editor";
import { ODProgrammerError } from "@open-decision/type-classes";
import { Node } from "@open-decision/tree-type";
import { createTreeClient } from "@open-decision/tree-client";

export const nodeTypes: NodeTypes = {
  question: QuestionNode,
};

export type NodeSidebarProps = {
  node: Node.TNode;
  open: boolean;
};

export const NodeSidebarPlugin = ({ node, open }: NodeSidebarProps) => {
  switch (node.type) {
    case "question":
      return <QuestionNodeSidebar open={open} node={node} />;

    default:
      throw new ODProgrammerError({ code: "UNKNOWN_NODE_TYPE" });
  }
};
