import * as React from "react";
import { useEditor } from "features/Builder/state/useEditor";
import ReactFlow from "react-flow-renderer";
import { styled, StyleObject } from "@open-decision/design-system";
import { Node } from "./Nodes/Node";
import {
  useEdges,
  useNodes,
  useSelectedNodeIds,
  useSelectedNodes,
  useStartNode,
} from "features/Builder/state/treeStore/hooks";
import { useSnapshot } from "valtio";
import { useTreeContext } from "features/Builder/state/treeStore/TreeContext";

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
    abortConnecting,
    addEdge,
    addSelectedNodes,
    deleteNodes,
    nonSyncedStore,
    removeSelectedNodes,
    startConnecting,
    updateNodePosition,
  } = useTreeContext();

  const [selectedStatus, selectedNodeIds] = useSelectedNodeIds();

  const nodes = React.useMemo(
    () =>
      syncedNodes.map((node) => ({
        ...node,
        selected:
          selectedStatus !== "none" && selectedNodeIds.includes(node.id),
      })),
    [selectedNodeIds, syncedNodes, selectedStatus]
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
      selectionKeyCode={null}
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

                if (selectedNodeIds.length === 0) {
                  const node = nodes.find((node) => node.id === nodeChange.id);
                  node && zoomToNode(node);
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
