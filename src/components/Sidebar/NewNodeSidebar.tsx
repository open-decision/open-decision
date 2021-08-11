import { TNodeConfig, TNodeTypes } from "features/Builder/types";
import React from "react";
import { StyleObject, styled } from "@open-legal-tech/design-system";
import { ToolbarNode } from "./ToolbarNode";

const NodeList = styled("aside", { display: "grid", gap: "$4" });

type NewNodeSidebarProps = { css?: StyleObject; nodeTypes: TNodeTypes };

export const NewNodeSidebar: React.FC<NewNodeSidebarProps> = ({
  css,
  nodeTypes,
}) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeConfig: TNodeConfig
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeConfig.type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <NodeList css={css}>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      {Object.values(nodeTypes).map((option) => (
        <ToolbarNode
          key={option.label}
          label={option.label}
          onDragStart={(event) => onDragStart(event, option)}
          draggable
        />
      ))}
    </NodeList>
  );
};
