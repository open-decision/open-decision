import { Box, styled, Text, Icon, Stack } from "@open-decision/design-system";
import React, { memo } from "react";
import { Star } from "react-feather";
import { NodeProps, Position } from "react-flow-renderer";
import { nodeHeight, nodeWidth } from "../../../utilities/constants";
import { useEditor } from "features/Builder/state/useEditor";
import { NodeMenu } from "./NodeMenu";
import { SourcePort, TargetPort } from "./Port";
import { NodeLabel } from "./NodeLabel";
import {
  useIsSelected,
  useStartNode,
} from "features/Builder/state/treeStore/hooks";
import { nonSyncedStore } from "features/Builder/state/treeStore/treeStore";
import { useSnapshot } from "valtio";
import { BuilderNode } from "@open-decision/type-classes";

const NodeContainer = styled(Stack, {
  layer: "1",
  borderRadius: "$md",
  width: nodeWidth,
  minHeight: nodeHeight,
  transition: "opacity 200ms ease-in-out",

  "&[data-connecting='false']:hover": {
    borderColor: "$primary9",
  },

  "&[data-connecting='true'][data-connectable='true']": {
    cursor: "crosshair",
  },

  "&[data-connecting='true'][data-connectable='false']": {
    cursor: "not-allowed",
  },
});

export const Node = memo(
  ({ id, selected, data }: NodeProps<BuilderNode.TNodeData>) => {
    const { isConnecting, connectingNodeId } = useEditor();
    const { validConnections } = useSnapshot(nonSyncedStore);
    const startNode = useStartNode();

    const validConnectionTarget = React.useMemo(
      () => !isConnecting || (isConnecting && validConnections?.includes(id)),
      [isConnecting, validConnections, id]
    );

    const isStartNode = startNode === id;
    const isConnectingNode = connectingNodeId === id;
    const connectable = validConnectionTarget && !isConnectingNode;

    return (
      <NodeContainer
        data-nodeid={id}
        data-connecting={isConnecting}
        data-connectable={connectable}
        css={{
          boxShadow: selected ? "$4" : "$3",
          border:
            selected && !isConnecting
              ? "2px solid $primary9"
              : "1px solid $gray8",
          padding: selected ? "calc($5 - 1px)" : "$5",
          opacity: validConnectionTarget ? 1 : 0.2,
        }}
        center
      >
        {isStartNode ? (
          <NodeLabel css={{ colorScheme: "success" }}>
            <Icon>
              <Star />
            </Icon>
            Start
          </NodeLabel>
        ) : null}
        <TargetPort
          type="target"
          data-connecting={isConnecting}
          data-connectingnode={isConnectingNode}
          data-connectable={connectable}
          position={Position.Top}
          id={id}
          isConnectable={isConnecting}
        />
        {selected && !isConnecting ? (
          <Box
            data-connecting={isConnecting}
            data-nodeid={id}
            css={{
              position: "absolute",
              top: "$1",
              right: "$1",
              transition: "opacity 100ms ease-in",
            }}
          >
            <NodeMenu
              data-connecting={isConnecting}
              name={data.name}
              nodeId={id}
              isStartNode={isStartNode}
            />
          </Box>
        ) : null}
        <Text
          data-connecting={isConnecting}
          data-nodeid={id}
          as="span"
          css={{ textAlign: "center", wordBreak: "break-word" }}
        >
          {data.name}
        </Text>
        <SourcePort
          type="source"
          data-connecting={isConnecting}
          data-connectingnode={isConnectingNode}
          data-connectable={connectable}
          position={Position.Bottom}
          data-active={isConnecting && connectingNodeId === id}
        />
      </NodeContainer>
    );
  }
);

Node.displayName = "Node";
