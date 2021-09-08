import { Box, styled } from "@open-legal-tech/design-system";
import React, { memo } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";
import { TNodeData } from "../types/Node";

const Port = styled(Handle, {
  backgroundColor: "$gray1 !important",
  border: "1px solid $gray11 !important",
  height: "10px !important",
  width: "10px !important",
});

export const Node = memo(({ id, data }: NodeProps<TNodeData>) => {
  return (
    <>
      <Port type="target" position={Position.Top} css={{ top: "-6px" }} />
      <Box data-nodeid={id} css={{ padding: "$4" }}>
        {data.label}
      </Box>
      <Port type="source" position={Position.Bottom} css={{ bottom: "-6px" }} />
    </>
  );
});

Node.displayName = "Node";
