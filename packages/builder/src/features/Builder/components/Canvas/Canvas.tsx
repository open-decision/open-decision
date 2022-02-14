import * as React from "react";
import { BuilderNode } from "@open-decision/type-classes";
import { useEditor } from "features/Builder/state/useEditor";
import ReactFlow, { FlowElement } from "react-flow-renderer";
import { useTree } from "../../state/treeMachine/useTree";
import { transformToReactFlowEdges } from "./utils/transformToReactFlowEdges";
import { transformToReactFlowNodes } from "./utils/transformToReactFlowNodes";
import { css, styled, StyleObject } from "@open-legal-tech/design-system";
import { transitionDuration } from "features/Builder/utilities/constants";
import { Node } from "./Nodes/Node";
import { NodeData } from "features/Builder/types/react-flow";

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
  backgroundColor: "$gray1",
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
  const [state, send] = useTree();

  const {
    reactFlowWrapperRef,
    setReactFlowInstance,
    closeNodeEditingSidebar,
    isTransitioning,
    projectCoordinates,
  } = useEditor();

  const elements = [
    ...transformToReactFlowNodes(
      state.context?.tree.treeData ?? {},
      state.context.connectionSourceNode && state.context.validConnections
        ? [
            state.context.connectionSourceNode,
            ...state.context.validConnections,
          ]
        : []
    ),
    ...transformToReactFlowEdges(
      state.context?.tree.treeData ?? {},
      state.context.tree.selectedNodeId,
      state.context.tree.selectedRelationId
    ),
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
      send({
        type: "addNode",
        node: BuilderNode.create({
          position: coordinates,
          name,
        }),
      });
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
          send([
            {
              type: "deleteNode",
              ids: elementsToRemove
                .map((element) => element.id)
                .filter((element) => element !== state.context.tree.startNode),
            },
          ]);
        }}
        onConnectStart={(event) => {
          if (validConnectEvent(event.target) && event.target.dataset.nodeid) {
            send({
              type: "startConnecting",
              sourceNodeId: event.target.dataset.nodeid,
            });
          }
        }}
        onConnectEnd={(event) => {
          if (!validConnectEvent(event.target) || !event.target.dataset.nodeid)
            return send("abortConnect");

          send({ type: "connect", target: event.target.dataset.nodeid });
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
            send({
              type: "selectNode",
              nodeId: element.id,
            });
        }}
        onNodeDragStop={(_event, node) =>
          send({
            type: "updateNodePosition",
            nodeId: node.id,
            position: node.position,
          })
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
