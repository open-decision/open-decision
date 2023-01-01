import * as React from "react";
import { NodeSidebar } from "@open-decision/node-editor";
import { FormNodeSidebarContent } from "./FormNodeSidebarContent";
import { TNodeSidebar } from "@open-decision/plugins-node-helpers";

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
