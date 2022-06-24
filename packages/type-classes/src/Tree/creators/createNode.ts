import { Node } from "../type-classes";
import { v4 as uuid } from "uuid";

export type NewNodeData = {
  position?: Node.TNode["position"];
  data?: {
    inputs?: Node.TNodeData["inputs"];
    name?: string;
    content?: any;
    conditions?: Node.TNodeData["conditions"];
  };
};

export function createNode({
  position = { x: 0, y: 0 },
  data: { name = "", inputs = [], conditions = [] } = {},
  ...node
}: NewNodeData): Node.TNode {
  return {
    id: uuid(),
    data: {
      name,
      inputs,
      conditions,
    },
    type: "customNode",
    position,
    ...node,
  };
}
