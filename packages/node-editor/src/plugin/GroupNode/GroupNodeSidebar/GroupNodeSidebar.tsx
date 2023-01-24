import { TNodeSidebar } from "@open-decision/plugins-node-helpers";
import { NodeSidebar } from "../../components";
import { GroupNodePlugin } from "../GroupNodePlugin";
import { GroupNodeSidebarContent } from "./GroupNodeSidebarContent";
import { GroupNodeSidebarPaths } from "./GroupNodeSidebarPaths";

const GroupNode = new GroupNodePlugin();

export const GroupNodeSidebar: TNodeSidebar = ({
  nodeId,
  className,
  edgePlugins,
  onNodeCreate,
  nodePlugins,
  treeUuid,
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
      treeUuid={treeUuid}
    >
      <GroupNodeSidebarContent nodeId={nodeId} GroupNode={GroupNode} />
      <GroupNodeSidebarPaths
        nodeId={nodeId}
        onNodeCreate={onNodeCreate}
        GroupNode={GroupNode}
      />
    </NodeSidebar>
  );
};
