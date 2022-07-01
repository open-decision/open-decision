import * as React from "react";
import { useEditor } from "../../../../features/Builder/state/useEditor";
import ReactFlow from "react-flow-renderer";
import { styled, StyleObject } from "@open-decision/design-system";
import { Node } from "./Nodes/Node";
import {
  useRFEdges,
  useRFNodes,
  useStartNodeId,
} from "../../../../features/Builder/state/treeStore/hooks";
import { useTreeContext } from "../../../../features/Builder/state/treeStore/TreeContext";
import { useNotificationStore } from "../../../../features/Notifications/NotificationState";
import { ConnectionLine } from "./Edges/ConnectionLine";
import { CustomEdge } from "./Edges/CustomEdge";
import { useSnapshot } from "valtio";

const validConnectEvent = (
  target: MouseEvent["target"]
): target is HTMLDivElement | HTMLSpanElement =>
  (target instanceof HTMLDivElement || target instanceof HTMLSpanElement) &&
  target.dataset.nodeid != null;

const Container = styled("div", {
  display: "grid",
  height: "100%",
  width: "100%",
  position: "relative",
  layer: "3",
});

const customNodes = { customNode: Node };
const customEdges = { default: CustomEdge };

type Props = {
  children?: React.ReactNode;
  css?: StyleObject;
  className?: string;
};

export function Canvas({ children, css, className }: Props) {
  const { reactFlowWrapperRef } = useEditor();

  return (
    <Container ref={reactFlowWrapperRef} css={css} className={className}>
      <Nodes />
      {children}
    </Container>
  );
}

function Nodes() {
  const nodes = useRFNodes();
  const edges = useRFEdges();
  const {
    abortConnecting,
    treeClient: { nodes: nodesMethods, edges: edgesMethods },
    startConnecting,
    tree,
  } = useTreeContext();

  const [dragging, setDragging] = React.useState(false);
  const {
    nonSyncedStore: { selectedNodeIds },
  } = useSnapshot(tree);

  const startNodeId = useStartNodeId();

  const { closeNodeEditingSidebar } = useEditor();
  const {
    removeSelectedNodes,
    addSelectedNodes,
    removeSelectedNode,
    addSelectedEdges,
    removeSelectedEdge,
  } = useTreeContext();
  const { addNotification } = useNotificationStore();

  return (
    <ReactFlow
      onPaneClick={closeNodeEditingSidebar}
      nodeTypes={customNodes}
      edgeTypes={customEdges}
      nodes={nodes}
      edges={edges}
      zoomOnDoubleClick={false}
      panOnScroll={true}
      panOnScrollSpeed={1.1}
      selectNodesOnDrag={selectedNodeIds.length > 0}
      fitView
      fitViewOptions={{ maxZoom: 1, minZoom: 0.5, padding: 0.2 }}
      onNodesChange={(nodeChanges) => {
        nodeChanges.forEach((nodeChange) => {
          if (!("dragging" in nodeChange)) setDragging(false);

          switch (nodeChange.type) {
            case "remove":
              if (nodeChange.id !== startNodeId) {
                nodesMethods.deleteN([nodeChange.id]);
                removeSelectedNodes();
              }
              break;
            case "position": {
              if (nodeChange.dragging) {
                setDragging(true);
                nodesMethods.updatePosition(
                  nodeChange.id,
                  nodeChange.position ?? { x: 0, y: 0 }
                );
              }
              break;
            }
            case "select": {
              if (dragging && selectedNodeIds.length === 0) return;

              if (nodeChange.selected) {
                addSelectedNodes([nodeChange.id]);
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
                addSelectedEdges([edgeChange.id]);
              } else {
                removeSelectedEdge(edgeChange.id);
              }
          }
        });
      }}
      onConnectStart={(event) => {
        if (validConnectEvent(event.target) && event.target.dataset.nodeid) {
          startConnecting(event.target.dataset.nodeid);
        }
      }}
      onConnectEnd={(event) => {
        if (!validConnectEvent(event.target) || !event.target.dataset.nodeid)
          return abortConnecting();

        const sourceNode = nodesMethods.get.byId(
          tree.nonSyncedStore.connectionSourceNodeId
        );
        if (!sourceNode) return abortConnecting();

        const possibleEdge = edgesMethods.create({
          source: tree.nonSyncedStore.connectionSourceNodeId,
          target: event.target.dataset.nodeid,
        });

        if (possibleEdge instanceof Error)
          return addNotification({
            title: "Verbindung fehlgeschlagen",
            content: possibleEdge.message,
            variant: "danger",
          });

        edgesMethods.add(possibleEdge);
      }}
      style={{
        gridColumn: "1 / -1",
        gridRow: "1 / -1",
        isolation: "isolate",
      }}
      connectionLineComponent={ConnectionLine}
    />
  );
}
