import { TNodeSidebar, NodeSidebar } from "@open-decision/node-editor";
import { DecisionNodeSidebarContent } from "./DecisionNodeSidebarContent";
import { DecisionNodeSidebarPaths } from "./DecisionNodeSidebarPaths";

export const DecisionNodeSidebar: TNodeSidebar = ({
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
      tabs={["Inhalt", "Pfade"]}
      initialTab="Inhalt"
      nodePlugins={nodePlugins}
      edgePlugins={edgePlugins}
    >
      <DecisionNodeSidebarContent nodeId={nodeId} />
      <DecisionNodeSidebarPaths
        edgePlugins={edgePlugins}
        nodeId={nodeId}
        onNodeCreate={onNodeCreate}
      />
    </NodeSidebar>
  );
};
