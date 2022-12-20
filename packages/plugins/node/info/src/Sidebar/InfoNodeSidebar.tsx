import * as React from "react";
import { TNodeSidebar, NodeSidebar } from "@open-decision/node-editor";
import { InfoNodeSidebarContent } from "./InfoNodeSidebarContent";

export const InfoNodeSidebar: TNodeSidebar = ({
  nodeId,
  className,
  nodePlugins,
  edgePlugins,
}) => {
  return (
    <NodeSidebar
      nodeId={nodeId}
      className={className}
      edgePlugins={edgePlugins}
      nodePlugins={nodePlugins}
      tabs={["Inhalt"]}
      initialTab="Inhalt"
      hasPreview
    >
      <InfoNodeSidebarContent nodeId={nodeId} />
    </NodeSidebar>
  );
};
