import { TNodeSidebar } from "@open-decision/plugins-node-helpers";
import { NodeSidebar } from "../../components";
import { GroupNodeSidebarContent } from "./GroupNodeSidebarContent";
import { GroupNodeSidebarPaths } from "./GroupNodeSidebarPaths";

export const GroupNodeSidebar: TNodeSidebar = ({
  nodeId,
  className,
  edgePlugins,
  onNodeCreate,
  nodePlugins,
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
      <GroupNodeSidebarContent nodeId={nodeId} />
      <GroupNodeSidebarPaths nodeId={nodeId} onNodeCreate={onNodeCreate} />
    </NodeSidebar>
  );
};
