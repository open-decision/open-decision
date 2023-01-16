import * as React from "react";
import {
  Sidebar as SystemSidebar,
  twMerge,
} from "@open-decision/design-system";
import { Canvas } from "./Canvas/Canvas";
import { sidebarWidth } from "./utils/constants";
import { ZoomInOut } from "./Canvas/ZoomInOut";
import { mapValues } from "remeda";
import { useSelectedNodeIds } from "./state";
import { useTree } from "@open-decision/tree-sync";
import { PlaceholderNodePlugin } from "./plugin/PlaceholderNode/placholderNodePlugin";
import { EdgePluginObject } from "@open-decision/plugins-edge-helpers";
import { CustomEdge } from "./Canvas/Edges/CustomEdge";
import { NodePluginObject } from "@open-decision/plugins-node-helpers";

const canvasClasses = "grid justify-center h-full overflow-hidden";

type NodeEditorProps = {
  className?: string;
  nodePlugins: Record<string, NodePluginObject>;
  edgePlugins: Record<string, EdgePluginObject>;
  defaultViewport?: { x: number; y: number; zoom: number };
  onUnmount?: (viewport: { x: number; y: number; zoom: number }) => void;
};

export const NodeEditor = ({
  className,
  nodePlugins,
  edgePlugins,
  defaultViewport,
  onUnmount,
}: NodeEditorProps) => {
  const nodeTypes = React.useMemo(
    () => mapValues(nodePlugins, (plugin) => plugin.Editor.Node),
    [nodePlugins]
  );
  const edgeTypes = React.useMemo(
    () => mapValues(edgePlugins, () => CustomEdge),
    [edgePlugins]
  );

  return (
    <Canvas
      className={className ? twMerge(canvasClasses, className) : canvasClasses}
      style={{ gridTemplateColumns: `1fr ${sidebarWidth}px` }}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultViewport={defaultViewport}
      onUnmount={onUnmount}
    >
      <ZoomInOut className="absolute bottom-[10px] left-[10px]" />
      <Sidebar nodePlugins={nodePlugins} edgePlugins={edgePlugins} />
    </Canvas>
  );
};

type SidebarProps = {
  nodePlugins: Record<string, NodePluginObject>;
  edgePlugins: Record<string, EdgePluginObject>;
};

const PlaceholderNode = new PlaceholderNodePlugin();

export function Sidebar({ nodePlugins, edgePlugins }: SidebarProps) {
  const Sidebars = mapValues(nodePlugins, (plugin) => plugin.Editor.Sidebar);

  const selectedNodeIds = useSelectedNodeIds();
  const nodeId = selectedNodeIds[0];

  const selectedNodeType = useTree((treeClient) => {
    if (!nodeId) return;

    const selectedNode = treeClient.nodes.get.single(selectedNodeIds[0]);
    if (selectedNode instanceof Error) throw selectedNode;

    return selectedNode.type;
  });

  const SidebarContent = selectedNodeType ? Sidebars[selectedNodeType] : null;

  return (
    <SystemSidebar
      open={Boolean(nodeId && SidebarContent)}
      className="bg-layer-1 col-[2] row-span-full"
    >
      {nodeId && SidebarContent ? (
        <SidebarContent
          nodeId={nodeId}
          onNodeCreate={({ name }) =>
            PlaceholderNode.create({ position: { x: 0, y: 0 }, name })
          }
          nodePlugins={nodePlugins}
          edgePlugins={edgePlugins}
        />
      ) : null}
    </SystemSidebar>
  );
}
