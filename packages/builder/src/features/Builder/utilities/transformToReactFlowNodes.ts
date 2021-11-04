import { BuilderNode } from "@open-decision/type-classes";
import { Elements } from "react-flow-renderer";
import { NodeData } from "../types/react-flow";

export function transformToReactFlowNodes(
  nodes: BuilderNode.TNodesRecord
): Elements<NodeData> {
  return Object.values(nodes).map((node) => ({
    data: { name: node.name, relations: node.relations, content: node.content },
    id: node.id,
    position: node.position,
    type: "customNode",
  }));
}
