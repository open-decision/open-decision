import * as React from "react";
import { BuilderNode } from "@open-decision/type-classes";
import { useEditor } from "features/Builder/state/useEditor";
import ReactFlow, { FlowElement } from "react-flow-renderer";
import { useTree } from "../../state/useTree";
import { transformToReactFlowEdges } from "./utils/transformToReactFlowEdges";
import { transformToReactFlowNodes } from "./utils/transformToReactFlowNodes";
import { css, styled, StyleObject } from "@open-legal-tech/design-system";
import { transitionDuration } from "features/Builder/utilities/constants";
import { Node } from "./Node";
import { NodeData } from "features/Builder/types/react-flow";

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
    reactFlowInstance,
    setReactFlowInstance,
    closeNodeEditingSidebar,
    isTransitioning,
  } = useEditor();

  const elements = [
    ...transformToReactFlowNodes(state.context?.nodes ?? {}),
    ...transformToReactFlowEdges(
      state.context?.nodes ?? {},
      state.context.selectedNodeId,
      state.context.selectedRelationId
    ),
  ];

  const sourceNodeId = React.useRef<string | undefined>(undefined);
  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const name = event.dataTransfer.getData("nodeLabel");

    if (reactFlowWrapper.current && reactFlowInstance) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      send({
        type: "addNode",
        value: BuilderNode.create({
          position,
          name,
        }),
      });
    }
  };

  return (
    <Container ref={reactFlowWrapper} css={css}>
      <ReactFlow
        className={canvasStyles().className}
        data-transition={isTransitioning}
        onPaneClick={() => closeNodeEditingSidebar()}
        nodeTypes={customNodes}
        elements={elements}
        deleteKeyCode={46}
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
              ids: elementsToRemove.map((element) => element.id),
            },
          ]);
        }}
        onConnectStart={(event) => {
          if (event.target instanceof HTMLDivElement) {
            sourceNodeId.current = event.target.dataset.nodeid;
          }
        }}
        onConnectEnd={(event) => {
          if (
            (event.target instanceof HTMLDivElement ||
              event.target instanceof HTMLSpanElement) &&
            event.target.dataset.nodeid &&
            sourceNodeId.current &&
            sourceNodeId.current !== event.target.dataset.nodeid
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
      />
      {children}
    </Container>
  );
}
