import { Node } from "@open-decision/type-classes";
import { nodeHeight, nodeWidth } from "./constants";

export function calculateCenterOfNode(
  position: Node.TCoordinates,
  transform: Node.TCoordinates = { x: 0, y: 0 }
) {
  return {
    x: position.x + nodeWidth / 2 + transform.x,
    y: position.y + nodeHeight / 2 + transform.y,
  };
}
