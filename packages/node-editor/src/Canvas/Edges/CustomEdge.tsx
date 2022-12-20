import { memo } from "react";
import { getBezierPath, EdgeProps } from "reactflow";

export const CustomEdge = memo(
  ({
    id,
    style,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    selected: isSelected,
    source,
    target,
    markerEnd,
  }: EdgeProps) => {
    const d = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY: targetY + 7,
      targetPosition,
    });

    return (
      <g
        className="react-flow__connection"
        data-test={`${source}_${target}_edge`}
      >
        <path
          key={`${id}_${isSelected}`}
          id={id}
          d={d[0]}
          className="stroke-gray8 fill-none stroke-1"
          style={style}
          markerEnd={markerEnd}
        />
      </g>
    );
  }
);

CustomEdge.displayName = "CustomEdge";
