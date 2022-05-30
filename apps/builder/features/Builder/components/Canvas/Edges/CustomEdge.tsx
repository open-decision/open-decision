import { styled } from "@open-decision/design-system";
import { memo } from "react";
import { getBezierPath, EdgeProps } from "react-flow-renderer";

const StyledPath = styled("path", {
  fill: "none",
  stroke: 1,
});

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
      <g className="react-flow__connection">
        <StyledPath
          key={`${id}_${isSelected}`}
          id={id}
          d={d}
          markerEnd={"url(#color=#c1c8cd&type=arrowclosed)"}
          css={{
            stroke: "$colors$gray8",
            strokeWidth: 1,
            ...style,
          }}
        />
      </g>
    );
  }
);

CustomEdge.displayName = "CustomEdge";
