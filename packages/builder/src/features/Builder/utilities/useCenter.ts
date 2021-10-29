import { useStoreState } from "react-flow-renderer";
import { TCoordinates } from "../types/Node";
import { nodeHeight, nodeWidth } from "./constants";

export function calculateCenterOfNode(
  position: TCoordinates,
  transform: TCoordinates = { x: 0, y: 0 }
) {
  return {
    x: position.x + nodeWidth / 2 + transform.x,
    y: position.y + nodeHeight / 2 + transform.y,
  };
}

export const useCenter = (transform: TCoordinates = { x: 0, y: 0 }) => {
  const [[xTransform, yTransform, zoom], width, height] = useStoreState(
    (state) => [state.transform, state.width, state.height]
  );

  const center = {
    x: (width / 2 - xTransform) / zoom - transform.x,
    y: (height / 2 - yTransform) / zoom - transform.y,
  };

  return center;
};
