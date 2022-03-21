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
  addNode,
  deleteNodes,
  nonSyncedStore,
  startConnecting,
  updateNodePosition,
  updateSelectedNode,
} from "features/Builder/state/treeStore/treeStore";

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

type Props = { children?: React.ReactNode; css?: StyleObject };

export function Canvas({ children, css }: Props) {
  const { reactFlowWrapperRef } = useEditor();

  return (
    <Container ref={reactFlowWrapperRef} css={css}>
      <Nodes />
      {children}
    </Container>
  );
}

function Nodes() {
  const nodes = useNodes();
  const edges = useEdges();
  const startNode = useStartNode();

  const {
    closeNodeEditingSidebar,
    projectCoordinates,
    zoomToNode,
    unselectNodesAndEdges,
  } = useEditor();

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const name = event.dataTransfer.getData("nodeLabel");

    const coordinates = projectCoordinates({
      x: event.clientX,
      y: event.clientY,
    });

    if (coordinates && name) {
      addNode({ position: coordinates, data: { name } });
    }
  };

  return (
    <ReactFlow
      onPaneClick={() => closeNodeEditingSidebar()}
      nodeTypes={customNodes}
      nodes={nodes}
      edges={edges}
      zoomOnDoubleClick={false}
      panOnScroll={true}
      selectNodesOnDrag={false}
      onNodeDragStart={() => unselectNodesAndEdges()}
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
              updateSelectedNode(nodeChange.id, nodeChange.selected);

              if (nodeChange.selected) {
                const node = nodes.find((node) => node.id === nodeChange.id);

                if (node) {
                  zoomToNode(node);
                }
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
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        gridColumn: "1 / -1",
        gridRow: "1",
        isolation: "isolate",
      }}
    />
  );
}
