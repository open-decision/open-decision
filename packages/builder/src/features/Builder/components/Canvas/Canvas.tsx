import * as React from "react";
import { BuilderNode, BuilderTree } from "@open-decision/type-classes";
import { useEditor } from "features/Builder/state/useEditor";
import ReactFlow, { FlowElement } from "react-flow-renderer";
import { useTree } from "../../state/useTree";
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

  const sourceNodeId = React.useRef<string | undefined>(undefined);

  const connectionOriginNode = sourceNodeId.current
    ? state.context.nodes[sourceNodeId.current]
    : undefined;
  const connectableNodes = connectionOriginNode
    ? BuilderTree.getConnectableNodes(connectionOriginNode)(state.context)
    : [];

  const elements = [
    ...transformToReactFlowNodes(
      state.context?.nodes ?? {},
      connectionOriginNode ? [connectionOriginNode, ...connectableNodes] : []
    ),
    ...transformToReactFlowEdges(
      state.context?.nodes ?? {},
      state.context.selectedNodeId,
      state.context.selectedRelationId
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
        value: BuilderNode.create({
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
                .filter((element) => element !== state.context.startNode),
            },
          ]);
        }}
        onConnectStart={(event) => {
          if (event.target instanceof HTMLDivElement) {
            sourceNodeId.current = event.target.dataset.nodeid;
          }
        }}
        onConnectEnd={(event) => {
          if (!validConnectEvent(event.target)) return;
          if (
            sourceNodeId.current &&
            connectableNodes.some(
              //@ts-expect-error - Typescript thinks the event can be any MouseEvent although we checked that it is valid above.
              (node) => node.id === event.target.dataset.nodeid
            )
          ) {
            send({
              type: "addRelation",
              nodeId: sourceNodeId.current,
              relation: { target: event.target.dataset.nodeid },
            });
          }
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
        onNodeDragStop={(_event, node) => {
          return send({ type: "updateNode", id: node.id, node });
        }}
        style={{
          gridColumn: "1 / -1",
          gridRow: "1",
          isolation: "isolate",
        }}
      >
        {/* <Controls style={{ display: "flex", left: "50%" }} /> */}
      </ReactFlow>
      {children}
    </Container>
  );
}
