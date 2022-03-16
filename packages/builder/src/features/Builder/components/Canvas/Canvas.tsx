import * as React from "react";
import { useEditor } from "features/Builder/state/useEditor";
import ReactFlow, { FlowElement } from "react-flow-renderer";
import { transformToReactFlowEdges } from "./utils/transformToReactFlowEdges";
import { transformToReactFlowNodes } from "./utils/transformToReactFlowNodes";
import { css, styled, StyleObject } from "@open-decision/design-system";
import { transitionDuration } from "features/Builder/utilities/constants";
import { Node } from "./Nodes/Node";
import { NodeData } from "features/Builder/types/react-flow";
import {
  useConnect,
  useNodes,
  useSelectedNode,
  useSelectedRelationId,
  useStartNode,
} from "features/Builder/state/treeStore/hooks";
import { useTree } from "features/Builder/state/treeStore/TreeProvider";

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

const canvasStyles = css({
  "&[data-transition='true'] .react-flow__nodes,&[data-transition='true'] .react-flow__edges *":
    {
      transition: `transform ${transitionDuration}ms ease-in-out`,
    },
});

const customNodes = { customNode: Node };

type Props = { children?: React.ReactNode; css?: StyleObject };

export function Canvas({ children, css }: Props) {
  const {
    abortConnecting,
    addNode,
    deleteNodes,
    selectNode,
    startConnecting,
    connect,
    updateNodePosition,
  } = useTree();
  const nodes = useNodes();
  const selectedNode = useSelectedNode();
  const selectedRelationId = useSelectedRelationId();
  const startNode = useStartNode();
  const { connectionSourceNodeId, validConnections } = useConnect();

  const {
    reactFlowWrapperRef,
    setReactFlowInstance,
    closeNodeEditingSidebar,
    isTransitioning,
    projectCoordinates,
  } = useEditor();

  const elements = [
    ...transformToReactFlowNodes(
      nodes,
      connectionSourceNodeId && validConnections
        ? [nodes[connectionSourceNodeId], ...validConnections]
        : []
    ),
    ...transformToReactFlowEdges(nodes, selectedNode?.id, selectedRelationId),
  ];

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
      addNode({ position: coordinates, name });
    }
  };

  return (
    <Container ref={reactFlowWrapperRef} css={css}>
      <ReactFlow
        className={canvasStyles().className}
        data-transition={isTransitioning}
        onPaneClick={() => closeNodeEditingSidebar()}
        nodeTypes={customNodes}
        elements={elements}
        paneMoveable={!isTransitioning}
        zoomOnPinch={!isTransitioning}
        zoomOnScroll={!isTransitioning}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
        panOnScroll={true}
        onElementsRemove={(elementsToRemove) => {
          deleteNodes(
            elementsToRemove
              .map((element) => element.id)
              .filter((element) => element !== startNode)
          );
        }}
        onConnectStart={(event) => {
          if (validConnectEvent(event.target) && event.target.dataset.nodeid) {
            startConnecting(event.target.dataset.nodeid);
          }
        }}
        onConnectEnd={(event) => {
          if (!validConnectEvent(event.target) || !event.target.dataset.nodeid)
            return abortConnecting();

          connect(event.target.dataset.nodeid);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onLoad={(instance) => {
          setReactFlowInstance(instance);
          instance.fitView({ maxZoom: 1, minZoom: 1 });
        }}
        onElementClick={(event, element: FlowElement<NodeData>) => {
          if (
            event.target instanceof HTMLElement &&
            event.target.dataset?.nodeid === element.id
          )
            selectNode(element.id);
        }}
        onNodeDragStop={(_event, node) =>
          updateNodePosition(node.id, node.position)
        }
        style={{
          gridColumn: "1 / -1",
          gridRow: "1",
          isolation: "isolate",
        }}
      />
      {children}
    </Container>
  );
}
