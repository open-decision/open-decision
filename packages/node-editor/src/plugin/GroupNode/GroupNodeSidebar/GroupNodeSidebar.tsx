import { TNodeSidebar } from "../../../types/EditorPluginObject";
import { NodeSidebar } from "../../components";
import { GroupNodeSidebarContent } from "./GroupNodeSidebarContent";

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
      tabs={["Inhalt"]}
      initialTab="Inhalt"
      hasPreview
    >
      <GroupNodeSidebarContent nodeId={nodeId} onNodeCreate={onNodeCreate} />
    </NodeSidebar>
  );
};
