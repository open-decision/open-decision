import { NodeSidebar } from "@open-decision/node-editor";
import { TNodeSidebar } from "@open-decision/plugins-node-helpers";
import { DocumentNodeSidebarContent } from "./DocumentNodeSidebarContent";
import { DocumentNodeSidebarPaths } from "./DocumentNodeSidebarPaths";

export const DocumentNodeSidebar: TNodeSidebar = ({
  nodeId,
  edgePlugins,
  nodePlugins,
  onNodeCreate,
}) => {
  return (
    <NodeSidebar
      nodeId={nodeId}
      edgePlugins={edgePlugins}
      nodePlugins={nodePlugins}
      tabs={["Inhalt", "Ziel"]}
      initialTab="Inhalt"
      hasPreview
    >
      <DocumentNodeSidebarContent nodeId={nodeId} />
      <DocumentNodeSidebarPaths nodeId={nodeId} onNodeCreate={onNodeCreate} />
    </NodeSidebar>
  );
};
