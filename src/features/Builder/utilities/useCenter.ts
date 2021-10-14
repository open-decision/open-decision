import { useStoreState } from "react-flow-renderer";
import { TCoordinates } from "../types/Node";

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
