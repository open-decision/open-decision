import { BuilderNode } from "@open-decision/type-classes";
import { useStoreState } from "react-flow-renderer";
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

export const useCenter = (
  transform: BuilderNode.TCoordinates = { x: 0, y: 0 }
) => {
  const [[xTransform, yTransform, zoom], width, height] = useStoreState(
    (state) => [state.transform, state.width, state.height]
  );

  const center = {
    x: (width / 2 - xTransform) / zoom - transform.x,
    y: (height / 2 - yTransform) / zoom - transform.y,
  };

  return center;
};
