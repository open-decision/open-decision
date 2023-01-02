import * as React from "react";
import { NodeSidebar } from "@open-decision/node-editor";
import { FormNodeSidebarContent } from "./FormNodeSidebarContent";
import { TNodeSidebar } from "@open-decision/plugins-node-helpers";
import { FormNodeSidebarPaths } from "./FormNodeSidebarPaths";

export const FormNodeSidebar: TNodeSidebar = ({
  nodeId,
  className,
  nodePlugins,
  edgePlugins,
  onNodeCreate,
}) => {
  return (
    <NodeSidebar
      className={className}
      nodeId={nodeId}
      edgePlugins={edgePlugins}
      nodePlugins={nodePlugins}
      tabs={["Inhalt", "Ziel"]}
      initialTab="Inhalt"
      hasPreview
    >
      <FormNodeSidebarContent nodeId={nodeId} />
      <FormNodeSidebarPaths nodeId={nodeId} onNodeCreate={onNodeCreate} />
    </NodeSidebar>
  );
};
