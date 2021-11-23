import { BuilderNode } from "@open-decision/type-classes";
import { NodeData } from "features/Builder/types/react-flow";
import { Elements } from "react-flow-renderer";

export function transformToReactFlowNodes(
  nodes: BuilderNode.TNodesRecord
): Elements<NodeData> {
  return Object.values(nodes).map((node) => {
    return {
      data: {
        name: node.name,
        relations: node.relations,
        content: node.content,
      },
      id: node.id,
      position: node.position,
      type: "customNode",
    };
  });
}
