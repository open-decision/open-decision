import { BuilderNode } from "@open-decision/type-classes";
import "react-flow-renderer";

export type NodeData = Pick<
  BuilderNode.TNode,
  "name" | "content" | "relations" | "isConnectable"
>;

declare module "react-flow-renderer" {
  interface Connection {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }
}
