import * as React from "react";
import ReactFlow, {
  EdgeTypes,
  NodeTypes,
  useViewport,
  NodeRemoveChange,
} from "reactflow";
import { ConnectionLine } from "./Edges/ConnectionLine";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useRFNodes } from "../state/useRFNodes";
import { useRFEdges } from "../state/useRFEdges";
import { useSelectedNodeIds } from "../state/useSelectedNodes";
import { useEditor } from "../state";
import { useUnmount } from "react-use";
import { twMerge, useNotificationTemplate } from "@open-decision/design-system";
import { NodeDeletionDialog } from "./NodeDeletionDialog";
import { isNodeId, TNodeId, ZEdgeId, ZNodeId } from "@open-decision/tree-id";

const containerClasses = "grid h-full w-full relative bg-layer-3";

type Props = {
  children?: React.ReactNode;
  className?: string;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  defaultViewport?: { x: number; y: number; zoom: number };
  onUnmount?: (viewport: { x: number; y: number; zoom: number }) => void;
  style?: React.CSSProperties;
};

export function Canvas({
  children,
  className,
  nodeTypes,
  edgeTypes,
  defaultViewport,
  onUnmount,
  style,
}: Props) {
  const [nodesToDelete, setNodesToDelete] = React.useState<TNodeId[]>([]);
  const addNotificationFromTemplate = useNotificationTemplate();

  const startNodeId = useTree((treeClient) => treeClient.get.startNodeId());
  const nodes = useRFNodes();
  const edges = useRFEdges();
  const {
    closeNodeEditingSidebar,
    addSelectedNodes,
    removeSelectedNode,
    addSelectedEdges,
    removeSelectedEdge,
    reactFlowWrapperRef,
  } = useEditor();

  const selectedNodeIds = useSelectedNodeIds();

  const [dragging, setDragging] = React.useState(false);

  const treeClient = useTreeClient();
  const viewport = useViewport();

  useUnmount(() => {
    onUnmount?.(viewport);
  });

  return (
    <div
      ref={reactFlowWrapperRef}
      className={
        className ? twMerge(containerClasses, className) : containerClasses
      }
      style={style}
    >
      <NodeDeletionDialog
        open={nodesToDelete.length > 0}
        onCancel={() => setNodesToDelete([])}
        onSuccess={() => setNodesToDelete([])}
        nodesToDelete={nodesToDelete}
      />
      <ReactFlow
        onPaneClick={closeNodeEditingSidebar}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        zoomOnDoubleClick={false}
        defaultViewport={defaultViewport}
        fitView={!defaultViewport}
        maxZoom={2}
        minZoom={0.1}
        panOnScroll
        fitViewOptions={{ maxZoom: 1, minZoom: 0.1, padding: 0.2 }}
        onNodesChange={(nodeChanges) => {
          const nodesToDelete = nodeChanges
            .filter(
              (
                change
              ): change is Omit<NodeRemoveChange, "id"> & { id: TNodeId } =>
                change.type === "remove" &&
                change.id !== startNodeId &&
                isNodeId(change.id)
            )
            .map((change) => change.id);

          if (nodesToDelete.length > 0) {
            setNodesToDelete(nodesToDelete);
          }

          nodeChanges.forEach((nodeChange) => {
            if (!("dragging" in nodeChange)) setDragging(false);

            if (nodeChange.type === "remove" && nodeChange.id === startNodeId) {
              addNotificationFromTemplate("cannotDeleteStartNode");
            }

            switch (nodeChange.type) {
              case "position": {
                if (nodeChange.dragging) {
                  setDragging(true);

                  const parsedNodeChangeId = ZNodeId.safeParse(nodeChange.id);

                  if (!parsedNodeChangeId.success) return;

                  treeClient.nodes.update.position(
                    parsedNodeChangeId.data,
                    nodeChange.position ?? { x: 0, y: 0 }
                  );
                }
                break;
              }
              case "select": {
                if (dragging && selectedNodeIds.length === 0) return;

                const parsedNodeChangeId = ZNodeId.safeParse(nodeChange.id);

                if (!parsedNodeChangeId.success) return;

                if (nodeChange.selected) {
                  addSelectedNodes([parsedNodeChangeId.data]);
                } else {
                  removeSelectedNode(nodeChange.id);
                }
                break;
              }
            }
          });
        }}
        onEdgesChange={(edgeChanges) => {
          edgeChanges.forEach((edgeChange) => {
            switch (edgeChange.type) {
              case "select":
                if (edgeChange.selected) {
                  const parsedEdgeChangeId = ZEdgeId.safeParse(edgeChange.id);

                  if (!parsedEdgeChangeId.success) return;

                  addSelectedEdges([parsedEdgeChangeId.data]);
                } else {
                  removeSelectedEdge(edgeChange.id);
                }
            }
          });
        }}
        nodesConnectable={false}
        style={{
          gridColumn: "1 / -1",
          gridRow: "1 / -1",
          isolation: "isolate",
          overflow: "hidden",
        }}
        connectionLineComponent={ConnectionLine}
        data-test="canvas"
      />
      {children}
    </div>
  );
}
