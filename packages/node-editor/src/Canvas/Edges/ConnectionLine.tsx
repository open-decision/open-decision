import { theme } from "@open-decision/design-system";
import {
  ConnectionLineComponentProps,
  getBezierPath,
} from "react-flow-renderer";

export function ConnectionLine({
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}: ConnectionLineComponentProps) {
  const path = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      <path
        fill="none"
        stroke={theme.colors.primary9.value}
        strokeWidth={1.5}
        className="animated"
        d={path}
      />
      <circle
        cx={targetX}
        cy={targetY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}
