import {
  Button,
  css,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import { SidebarContent, SidebarRoot } from "components/Sidebar";
import React, { useRef } from "react";
import { NodeCreator } from "./components/NodeCreator";
import { Node } from "./components/Node";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { createEdges } from "./edgeCreationEngine/edgeCreationEngine";
import { useEditor } from "./state/useEditor";
import * as NodeType from "./types/Node";
import * as Connection from "./types/Connection";
import ReactFlow from "react-flow-renderer";
import { transitionDuration } from "./utilities/constants";
import { useTree } from "./state/useTree";

const customNodes = { customNode: Node };

const Container = styled("div", {
  display: "grid",
  height: "100%",
  width: "100vw",
  position: "relative",
  backgroundColor: "$gray1",
});

const canvasStyles = css({
  "&[data-transition='true'] .react-flow__nodes,&[data-transition='true'] .react-flow__edges > g":
    {
      transition: `transform ${transitionDuration / 2}ms ease-in-out`,
    },
});

type NodeEditorProps = {
  /**
   * Zooming can be disabled. False by default.
   */
  disableZoom?: boolean;
  /**
   * Panning can be disabled. False by default.
   */
  disablePan?: boolean;
  css?: StyleObject;
};

export const NodeEditor = ({ css }: NodeEditorProps) => {
  const {
    reactFlowInstance,
    setReactFlowInstance,
    isNodeEditingSidebarOpen,
    closeNodeEditingSidebar,
    isTransitioning,
  } = useEditor();

  const [state, send] = useTree();

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const sourceNodeId = useRef<string | undefined>(undefined);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const label = event.dataTransfer.getData("nodeLabel");

    if (reactFlowWrapper.current && reactFlowInstance) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      send({
        type: "addNode",
        value: NodeType.create({
          position,
          data: { label },
        }),
      });
    }
  };

  const elements = [
    ...Object.values(state.context?.nodes ?? {}),
    ...createEdges(state.context?.nodes ?? {}, state.context.selectedNodeId),
  ];

  return (
    <>
      <Container
        ref={reactFlowWrapper}
        css={{ zIndex: isNodeEditingSidebarOpen ? undefined : 2, ...css }}
      >
        <ReactFlow
          className={canvasStyles().className}
          data-transition={isTransitioning}
          onPaneClick={() => closeNodeEditingSidebar()}
          nodeTypes={customNodes}
          elements={elements}
          deleteKeyCode={46}
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
              sourceNodeId.current
            ) {
              send({
                type: "addRelation",
                nodeId: sourceNodeId.current,
                value: { target: event.target.dataset.nodeid },
              });
            }
          }}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onLoad={(instance) => {
            setReactFlowInstance(instance);
          }}
          onElementClick={(event, node) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.dataset?.nodeid === node.id
            )
              send({
                type: "selectNode",
                nodeId: Connection.Type.is(node) ? node.source : node.id,
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
        <NodeCreator
          css={{
            position: "absolute",
            top: "20px",
            left: "20px",
          }}
        />
        <Button
          variant="tertiary"
          css={{
            colorScheme: "error",
            position: "absolute",
            bottom: "20px",
            left: "20px",
          }}
          //FIXME Needs Confirmation Dialog
          onClick={() => send({ type: "clearTree" })}
        >
          Baum löschen
        </Button>
      </Container>
      <SidebarRoot
        css={{
          position: "relative",
          display: "flex",
          gridRow: "2",
          gridColumn: "2",
          paddingInlineStart: "$1",
        }}
        onClick={(event) => event.stopPropagation()}
        open={isNodeEditingSidebarOpen}
        onOpenChange={() => closeNodeEditingSidebar()}
      >
        <SidebarContent css={{ width: "100%" }}>
          {state.context.selectedNodeId ? (
            <NodeEditingSidebar nodeId={state.context.selectedNodeId} />
          ) : (
            <p>Bitte wähle einen Knoten aus</p>
          )}
        </SidebarContent>
      </SidebarRoot>
    </>
  );
};
