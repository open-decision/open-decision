import { Box, styled, Text } from "@open-legal-tech/design-system";
import React, { memo } from "react";
import {
  Handle,
  NodeProps,
  Position,
  useStoreState,
} from "react-flow-renderer";
import { TNodeData } from "../types/Node";
import { nodeHeight, nodeWidth } from "../utilities/constants";

const Port = styled(Handle, {
  backgroundColor: "$gray1 !important",
  border: "1px solid $gray11 !important",
  height: "12px !important",
  width: "12px !important",
});

export const Node = memo(({ id, data, selected }: NodeProps<TNodeData>) => {
  const isConnecting = useStoreState(
    (state) => state.connectionHandleType != null
  );

  return (
    <Box
      data-nodeid={id}
      css={{
        backgroundColor: "$primary1",
        borderRadius: "$md",
        boxShadow: selected ? "0px 0px 0px 1px $colors$primary9, $2" : "$2",
        border: selected ? "1px solid $primary9" : "1px solid $gray9",
        width: nodeWidth,
        height: nodeHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        "&:hover": {
          borderColor: "$primary9",
        },
      }}
    >
      <Port
        type="target"
        position={Position.Top}
        css={{ top: "-6px !important" }}
        isConnectable={isConnecting}
      />
      <Box
        data-nodeid={id}
        css={{
          padding: "$4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          css={{
            textAlign: "center",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
          data-nodeid={id}
          size="small"
          as="span"
        >
          {data.label}
        </Text>
      </Box>
      <Port
        type="source"
        position={Position.Bottom}
        css={{ bottom: "-6px !important" }}
      />
    </Box>
  );
});

Node.displayName = "Node";
