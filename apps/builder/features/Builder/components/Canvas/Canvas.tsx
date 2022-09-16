import * as React from "react";
import { useEditor } from "../../../../features/Builder/state/useEditor";
import ReactFlow from "react-flow-renderer";
import { styled, StyleObject } from "@open-decision/design-system";
import { Node } from "./Nodes/Node";

import { ConnectionLine } from "./Edges/ConnectionLine";
import { CustomEdge } from "./Edges/CustomEdge";
import { useNotificationStore } from "../../../../config/notifications";
import { useTranslations } from "next-intl";
import { ODError } from "@open-decision/type-classes";
import { useRFNodes } from "../../state/useRFNodes";
import { useRFEdges } from "../../state/useRFEdges";
import { useStartNodeId, useTreeClient } from "@open-decision/tree-sync";

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
  const t = useTranslations("common.errors");
  const nodes = useRFNodes();
  const edges = useRFEdges();
  const { selectedNodeIds, connectionSourceNodeId } = useEditor();

  const [dragging, setDragging] = React.useState(false);
  const startNodeId = useStartNodeId();

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
        if (validConnectEvent(event.target) && event.target.dataset["nodeid"]) {
          startConnecting(event.target.dataset["nodeid"]);
        }
      }}
      onConnectEnd={(event) => {
        // FIXME How to handle the connection with multiple input types?
        // if (!validConnectEvent(event.target) || !event.target.dataset["nodeid"])
        //   return abortConnecting();
        // const sourceNode = treeClient.nodes.get.single(connectionSourceNodeId);
        // if (!sourceNode) return abortConnecting();
        // const firstInputId = sourceNode?.data.inputs[0];
        // const newAnswer = treeClient.input.select.createAnswer({ text: "" });
        // treeClient.input.select.addAnswer(firstInputId, newAnswer);
        // const newCondition = treeClient.conditions.create({
        //   inputId: firstInputId,
        //   answerId: newAnswer.id,
        // });
        // const possibleEdge = treeClient.edges.create({
        //   source: connectionSourceNodeId,
        //   target: event.target.dataset["nodeid"],
        //   conditionId: newCondition.id,
        // });
        // if (possibleEdge instanceof ODError)
        //   return addNotification({
        //     title: t(`${possibleEdge.code}.short`),
        //     content: t(`${possibleEdge.code}.long`),
        //     variant: "danger",
        //   });
        // treeClient.edges.add(possibleEdge);
        // treeClient.conditions.add(newCondition);
        // treeClient.conditions.connect.toNode(
        //   connectionSourceNodeId,
        //   newCondition.id
        // );
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
  );
}
