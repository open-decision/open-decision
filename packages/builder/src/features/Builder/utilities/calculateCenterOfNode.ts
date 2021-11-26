import { BuilderNode } from "@open-decision/type-classes";
import { nodeHeight, nodeWidth } from "./constants";

export function calculateCenterOfNode(
  position: BuilderNode.TCoordinates,
  transform: BuilderNode.TCoordinates = { x: 0, y: 0 }
) {
  return {
    x: position.x + nodeWidth / 2 + transform.x,
    y: position.y + nodeHeight / 2 + transform.y,
  };
}
