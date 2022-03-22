import * as React from "react";
import { useEditor } from "features/Builder/state/useEditor";
import ReactFlow from "react-flow-renderer";
import { styled, StyleObject } from "@open-decision/design-system";
import { Node } from "./Nodes/Node";
import {
  useEdges,
  useNodes,
  useStartNode,
} from "features/Builder/state/treeStore/hooks";
import {
  abortConnecting,
  addEdge,
  addSelectedNodes,
  deleteNodes,
  nonSyncedStore,
  removeSelectedNodes,
  startConnecting,
  updateNodePosition,
} from "features/Builder/state/treeStore/treeStore";
import { useSnapshot } from "valtio";

const validConnectEvent = (
  target: MouseEvent["target"]
): target is HTMLDivElement | HTMLSpanElement =>
  (target instanceof HTMLDivElement || target instanceof HTMLSpanElement) &&
  target.dataset.nodeid != null;

const Container = styled("div", {
  display: "grid",
  height: "100%",
  width: "100vw",
  position: "relative",
  layer: "4",
});

const customNodes = { customNode: Node };

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
  const syncedNodes = useNodes();
  const edges = useEdges();
  const {
    selection: { nodes: selectedNodeIds },
  } = useSnapshot(nonSyncedStore);

  const nodes = React.useMemo(
    () =>
      syncedNodes.map((node) => ({
        ...node,
        selected: selectedNodeIds.includes(node.id),
      })),
    [selectedNodeIds, syncedNodes]
  );

  const startNode = useStartNode();

  const { closeNodeEditingSidebar, zoomToNode } = useEditor();

  return (
    <ReactFlow
      onPaneClick={() => closeNodeEditingSidebar()}
      nodeTypes={customNodes}
      nodes={nodes}
      edges={edges}
      zoomOnDoubleClick={false}
      panOnScroll={true}
      selectNodesOnDrag={false}
      // onNodeDragStart={() => unselectNodesAndEdges()}
      onNodesChange={(nodeChanges) => {
        nodeChanges.forEach((nodeChange) => {
          switch (nodeChange.type) {
            case "remove":
              nodeChange.id !== startNode ? deleteNodes([nodeChange.id]) : null;
              break;
            case "position":
              nodeChange.dragging
                ? updateNodePosition(
                    nodeChange.id,
                    nodeChange.position ?? { x: 0, y: 0 }
                  )
                : null;
              break;
            case "select": {
              if (nodeChange.selected) {
                addSelectedNodes([nodeChange.id]);
                const node = nodes.find((node) => node.id === nodeChange.id);

                if (node) {
                  zoomToNode(node);
                }
              } else {
                removeSelectedNodes([nodeChange.id]);
              }
              break;
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

        addEdge({
          source: nonSyncedStore.connectionSourceNodeId,
          target: event.target.dataset.nodeid,
        });
      }}
      style={{
        gridColumn: "1 / -1",
        gridRow: "1 / -1",
        isolation: "isolate",
      }}
    />
  );
}
