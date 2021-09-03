import { theme } from "@open-legal-tech/design-system";
import React, { memo } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";
import { TNodeData } from "../types/Node";

const handleStyles = {
  backgroundColor: theme.colors.gray11.value,
};

export const Node = memo(({ data }: NodeProps<TNodeData>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyles} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={handleStyles} />
    </>
  );
});

Node.displayName = "Node";
