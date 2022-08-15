import { styled, Text, Stack } from "@open-decision/design-system";
import React, { memo } from "react";
import { NodeProps, Position } from "react-flow-renderer";
import { nodeHeight, nodeWidth } from "../../../utilities/constants";
import { useEditor } from "../../../../../features/Builder/state/useEditor";
import { SourcePort, TargetPort } from "./Port";
import { useStartNodeId } from "../../../../../features/Builder/state/treeStore/hooks";
import { useSnapshot } from "valtio";
import { Node as NodeType } from "@open-decision/type-classes";
import { useTreeContext } from "../../../../../features/Builder/state/treeStore/TreeContext";
import { StartNodeLabel } from "../../NodeLabels/StartNodeLabels";
import { useTranslations } from "next-intl";

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
  ({ id, data, selected: isSelected }: NodeProps<NodeType.TNodeData>) => {
    const t = useTranslations("builder.canvas.questionNode");
    const { tree } = useTreeContext();
    const { isConnecting, connectingNodeId } = useEditor();
    const { validConnections } = useSnapshot(tree.nonSyncedStore);
    const startNodeId = useStartNodeId();

    const validConnectionTarget = React.useMemo(
      () => !isConnecting || (isConnecting && validConnections?.includes(id)),
      [isConnecting, validConnections, id]
    );

    const isStartNode = startNodeId === id;
    const isConnectingNode = connectingNodeId === id;
    const connectable = validConnectionTarget && !isConnectingNode;

    return (
      <NodeContainer
        aria-label={t("empty.hiddenLabel", {
          content: data.name != null,
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
          data-test={`${id}-source-port`}
        />
      </NodeContainer>
    );
  }
);

Node.displayName = "Node";
