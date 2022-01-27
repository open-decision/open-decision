import { BuilderNode } from "@open-decision/type-classes";
import { NodeData } from "features/Builder/types/react-flow";
import { Elements } from "react-flow-renderer";

export function transformToReactFlowNodes(
  nodes: BuilderNode.TNodesRecord,
  connectableNodes?: BuilderNode.TNode[]
): Elements<NodeData> {
  return Object.values(nodes).map((node) => {
    return {
      data: {
        name: node.name,
        relations: node.relations,
        content: node.content,
        runtime: {
          isConnectable:
            connectableNodes?.some(
              (connectableNode) => connectableNode.id === node.id
            ) ?? false,
        },
      },
      id: node.id,
      position: node.position,
      type: "customNode",
    };
  });
}
