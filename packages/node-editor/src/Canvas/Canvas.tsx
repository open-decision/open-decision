import * as React from "react";
import ReactFlow, { NodeTypes } from "react-flow-renderer";
import { styled, StyleObject } from "@open-decision/design-system";
import { ConnectionLine } from "./Edges/ConnectionLine";
import { CustomEdge } from "./Edges/CustomEdge";
import { ODError } from "@open-decision/type-classes";
import { getStartNodeId } from "@open-decision/tree-type";
import { useTree, useTreeClient } from "@open-decision/tree-sync";
import { useRFNodes } from "../state/useRFNodes";
import { useRFEdges } from "../state/useRFEdges";
import { useSelectedNodeIds } from "../state/useSelectedNodes";
import { useEditor } from "../state";

const validConnectEvent = (
  target: MouseEvent["target"]
): target is HTMLDivElement | HTMLSpanElement =>
  (target instanceof HTMLDivElement || target instanceof HTMLSpanElement) &&
  target.dataset["nodeid"] != null;

const Container = styled("div", {
  display: "grid",
  height: "100%",
  width: "100%",
  position: "relative",
  layer: "3",
});

const customEdges = { default: CustomEdge };

type Props = {
  children?: React.ReactNode;
  css?: StyleObject;
  className?: string;
  nodeTypes: NodeTypes;
  onInvalidConnection?: (error: ODError) => void;
};

export function Canvas({
  children,
  css,
  className,
  nodeTypes,
  onInvalidConnection,
}: Props) {
  const nodes = useRFNodes();
  const edges = useRFEdges();
  const {
    reactFlowWrapperRef,
    editorStore: { connectionSourceNodeId },
  } = useEditor();

  const selectedNodeIds = useSelectedNodeIds();

  const [dragging, setDragging] = React.useState(false);
  const startNodeId = useTree(getStartNodeId);

  const {
    closeNodeEditingSidebar,
    abortConnecting,
    startConnecting,
    removeSelectedNodes,
    addSelectedNodes,
    removeSelectedNode,
    addSelectedEdges,
    removeSelectedEdge,
  } = useEditor();
  const treeClient = useTreeClient();

  return (
    <Container ref={reactFlowWrapperRef} css={css} className={className}>
      <ReactFlow
        onPaneClick={closeNodeEditingSidebar}
        nodeTypes={nodeTypes}
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
                  treeClient.nodes.delete([nodeChange.id]);
                  removeSelectedNodes();
                }
                break;
              case "position": {
                if (nodeChange.dragging) {
                  setDragging(true);
                  treeClient.nodes.update.position(
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
          if (
            validConnectEvent(event.target) &&
            event.target.dataset["nodeid"]
          ) {
            startConnecting(event.target.dataset["nodeid"]);
          }
        }}
        onConnectEnd={(event) => {
          // FIXME How to handle the connection with multiple input types?
          if (
            !validConnectEvent(event.target) ||
            !event.target.dataset["nodeid"]
          )
            return abortConnecting();

          const sourceNode = treeClient.nodes.get.single(
            connectionSourceNodeId
          );
          if (!sourceNode) return abortConnecting();

          const possibleEdge = treeClient.edges.create({
            source: connectionSourceNodeId,
            target: event.target.dataset["nodeid"],
          });

          if (possibleEdge instanceof ODError)
            return onInvalidConnection?.(possibleEdge);

          treeClient.edges.add(possibleEdge);
        }}
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
    </Container>
  );
}
