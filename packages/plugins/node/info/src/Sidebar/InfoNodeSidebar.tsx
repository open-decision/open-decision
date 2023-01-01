import * as React from "react";
import { NodeSidebar } from "@open-decision/node-editor";
import { InfoNodeSidebarContent } from "./InfoNodeSidebarContent";
import { InfoNodeSidebarPaths } from "./InfoNodeSidebarPaths";
import { TNodeSidebar } from "@open-decision/plugins-node-helpers";

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
      tabs={["Inhalt", "Ziel"]}
      initialTab="Inhalt"
      hasPreview
    >
      <InfoNodeSidebarContent nodeId={nodeId} />
      <InfoNodeSidebarPaths nodeId={nodeId} />
    </NodeSidebar>
  );
};
