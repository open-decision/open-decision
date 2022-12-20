import * as React from "react";
import { TNodeSidebar, NodeSidebar } from "@open-decision/node-editor";
import { FormNodeSidebarContent } from "./FormNodeSidebarContent";

export const FormNodeSidebar: TNodeSidebar = ({
  nodeId,
  className,
  nodePlugins,
  edgePlugins,
}) => {
  return (
    <NodeSidebar
      className={className}
      nodeId={nodeId}
      edgePlugins={edgePlugins}
      nodePlugins={nodePlugins}
      tabs={["Inhalt"]}
      initialTab="Inhalt"
      hasPreview
    >
      <FormNodeSidebarContent nodeId={nodeId} />
    </NodeSidebar>
  );
};
