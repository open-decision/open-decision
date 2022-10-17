import { styled, Stack } from "@open-decision/design-system";
import * as React from "react";
import { Position } from "reactflow";
import { SourcePort, TargetPort } from "./Port";
import { useTranslations } from "next-intl";
import { useTree } from "@open-decision/tree-sync";
import { getStartNodeId, Node } from "@open-decision/tree-type";
import { CanvasNodeProps } from "../types/NodePluginObject";
import { useEditor } from "../state";
import { nodeHeight, nodeWidth } from "../utils/constants";
import { StartNodeLabel } from "../NodeLabels";

const StyledNodeContainer = styled(Stack, {
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

export function CanvasNodeContainer<TNode extends Node.TNode>({
  id,
  data,
  selected: isSelected,
  children,
  ...props
}: CanvasNodeProps<TNode> & {
  children: React.ReactNode;
}) {
  const t = useTranslations("builder.canvas.questionNode");
  const {
    isConnecting,
    connectingNodeId,
    editorStore: { validConnections },
  } = useEditor();
  const startNodeId = useTree(getStartNodeId);

  const validConnectionTarget = React.useMemo(
    () => !isConnecting || (isConnecting && validConnections?.includes(id)),
    [isConnecting, validConnections, id]
  );

  const isStartNode = startNodeId === id;
  const isConnectingNode = connectingNodeId === id;
  const connectable = validConnectionTarget && !isConnectingNode;

  return (
    <StyledNodeContainer
      aria-label={t("empty.hiddenLabel", {
        content: (data.name?.length ?? 0) > 0 ? true : null,
        name: data.name,
        selected: isSelected,
      })}
      data-nodeid={id}
      data-connecting={isConnecting}
      data-connectable={connectable}
      css={{
        boxShadow: isSelected ? "$4" : "$3",
        border: isSelected ? "2px solid $primary9" : "1px solid $gray8",
        padding: isSelected ? "calc($5 - 1px)" : "$5",
        opacity: validConnectionTarget ? 1 : 0.5,
      }}
      center
      {...props}
    >
      {isStartNode ? (
        <StartNodeLabel
          css={{ position: "absolute", top: "-14px", left: "-14px" }}
        />
      ) : null}
      <TargetPort
        type="target"
        data-connecting={isConnecting}
        data-connectingnode={isConnectingNode}
        data-connectable={connectable}
        position={Position.Top}
        id={id}
        isConnectable={isConnecting}
        data-test={`${id}-target-port`}
      />
      {children}
      <SourcePort
        type="source"
        data-connecting={isConnecting}
        data-connectingnode={isConnectingNode}
        data-connectable={connectable}
        position={Position.Bottom}
        data-active={isConnecting && connectingNodeId === id}
        data-test={`${id}-source-port`}
      />
    </StyledNodeContainer>
  );
}
