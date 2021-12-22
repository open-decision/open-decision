import {
  Box,
  styled,
  Text,
  DropdownMenu,
  Icon,
  Tooltip,
  Button,
} from "@open-legal-tech/design-system";
import React, { memo } from "react";
import { MoreHorizontal, Star, Trash } from "react-feather";
import { Handle, NodeProps, Position } from "react-flow-renderer";
import { useTree } from "../../state/useTree";
import { nodeHeight, nodeWidth } from "../../utilities/constants";
import { NodeData } from "../../types/react-flow";
import { useEditor } from "features/Builder/state/useEditor";

const Port = styled(Handle, {
  backgroundColor: "$gray1 !important",
  border: "1px solid $gray11 !important",
  height: "12px !important",
  width: "12px !important",

  "&[data-active='true']": {
    boxShadow: "0px 0px 0px 1px $colors$primary9, $2",
    border: "1px solid $primary9 !important",
  },
});

export const Node = memo(({ id, data }: NodeProps<NodeData>) => {
  const [selectedNodeId, send] = useTree((state) => state.selectedNodeId);
  const [startNode] = useTree((state) => state.startNode);
  const { isConnecting, connectingNodeId } = useEditor();

  const selected = selectedNodeId === id;
  const isStartNode = startNode === id;

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
      {isStartNode ? (
        <Icon
          size="small"
          css={{
            position: "absolute",
            top: 10,
            left: 10,
          }}
        >
          <Star style={{ fill: "orange", stroke: "orange" }} />
        </Icon>
      ) : null}
      <Port
        type="target"
        position={Position.Top}
        css={{
          top: "-6px !important",
          "&:hover": isConnecting
            ? {
                border: "1px solid $colors$primary9 !important",
                boxShadow: "0px 0px 0px 1px $colors$primary9, $2",
              }
            : {},
        }}
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              size="small"
              variant="ghost"
              css={{ position: "absolute", top: 0, right: 0 }}
            >
              <Icon label={`Öffne Menü Node: ${data.name}`}>
                <MoreHorizontal />
              </Icon>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {isStartNode ? (
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <DropdownMenu.Item
                    css={{ colorScheme: "error" }}
                    onSelect={() => send({ type: "deleteNode", ids: [id] })}
                    disabled
                  >
                    <Icon
                      label="Löschen Icon"
                      size="extra-small"
                      css={{ $$paddingInline: 0 }}
                    >
                      <Trash />
                    </Icon>
                    Node löschen
                  </DropdownMenu.Item>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Text>Die Startnode kann nicht entfernt werden.</Text>
                </Tooltip.Content>
              </Tooltip.Root>
            ) : (
              <>
                <DropdownMenu.Item
                  css={{ colorScheme: "primary" }}
                  onSelect={() =>
                    send({ type: "updateTree", tree: { startNode: id } })
                  }
                >
                  <Icon
                    label="Zur Startnode machen"
                    size="extra-small"
                    css={{ $$paddingInline: 0 }}
                  >
                    <Star />
                  </Icon>
                  Zur Startnode machen
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  css={{ colorScheme: "error" }}
                  onSelect={() => send({ type: "deleteNode", ids: [id] })}
                >
                  <Icon
                    label="Löschen Icon"
                    size="extra-small"
                    css={{ $$paddingInline: 0 }}
                  >
                    <Trash />
                  </Icon>
                  Node löschen
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
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
          {data.name}
        </Text>
      </Box>
      <Port
        type="source"
        position={Position.Bottom}
        css={{ bottom: "-6px !important" }}
        data-active={isConnecting && connectingNodeId === id}
      />
    </Box>
  );
});

Node.displayName = "Node";
