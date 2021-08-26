import { theme } from "@open-legal-tech/design-system";
import React, { memo } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";
import { TElementData } from "../types";

const handleStyles = {
  backgroundColor: theme.colors.gray12,
};

export const Node = memo(({ data }: NodeProps<TElementData>) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        style={handleStyles}
      />
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyles}
      />
    </>
  );
});

Node.displayName = "Node";
