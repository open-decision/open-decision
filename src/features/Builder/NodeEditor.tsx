import {
  Box,
  Button,
  darkTheme,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import { useActor } from "@xstate/react";
import { SidebarContent, SidebarRoot } from "components/Sidebar";
import React, { useRef } from "react";
import { NewNodeButton } from "./components/NewNodeButton";
import { Node } from "./components/Node";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { NodeSearch } from "./components/NodeSearch/NodeSearch";
import { createEdges } from "./edgeCreationEngine/edgeCreationEngine";
import { useEditor } from "./state/useEditor";
import { useTreeService } from "./state/useTree";
import * as NodeType from "./types/Node";
import * as Connection from "./types/Connection";
import ReactFlow from "react-flow-renderer";
import { transitionDuration } from "./utilities/constants";

const customNodes = { customNode: Node };

const Container = styled("div", {
  display: "grid",
  height: "100%",
  width: "100vw",
  position: "relative",
  backgroundColor: "$gray1",
});

const Canvas = styled(ReactFlow, {
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

export const NodeEditor: React.FC<NodeEditorProps> = ({ css }) => {
  const service = useTreeService();
  const [state, send] = useActor(service);
  const tree = state.context;

  const {
    selectedNodeId,
    setSelectedNodeId,
    reactFlowInstance,
    setReactFlowInstance,
    isNodeEditingSidebarOpen,
    closeNodeEditingSidebar,
    isTransitioning,
  } = useEditor();

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const sourceNodeId = useRef<string | undefined>(undefined);

  if (state.matches("pending")) {
    return <Box css={css}>Loading</Box>;
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");

    if (reactFlowWrapper.current && reactFlowInstance && type) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      send({
        type: "addNode",
        value: NodeType.create({
          position,
        }),
      });
    }
  };

  const elements = [
    ...Object.values(tree.nodes).map((node) => node),
    ...createEdges(tree.nodes, selectedNodeId),
  ];

  return (
    <>
      <Container
        ref={reactFlowWrapper}
        css={{ zIndex: isNodeEditingSidebarOpen ? undefined : 2, ...css }}
      >
        <Canvas
          data-transition={isTransitioning}
          onPaneClick={() => closeNodeEditingSidebar()}
          nodeTypes={customNodes}
          elements={elements}
          deleteKeyCode={46}
          onElementsRemove={(elementsToRemove) => {
            setSelectedNodeId();
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
          onElementClick={(_event, node) => {
            if (Connection.Type.is(node)) {
              return setSelectedNodeId(node.source);
            }

            return setSelectedNodeId(node.id);
          }}
          onNodeDragStop={(_event, node) => {
            setSelectedNodeId(selectedNodeId);
            return send({ type: "updateNode", id: node.id, node });
          }}
          style={{
            gridColumn: "1 / -1",
            gridRow: "1",
            isolation: "isolate",
          }}
        />
        <NewNodeButton
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
          display: "grid",
          gridTemplateRows: "inherit",
          gridRow: "1 / -1",
          gridColumn: "2",
          paddingInlineStart: "$1",
        }}
        onClick={(event) => event.stopPropagation()}
        open={isNodeEditingSidebarOpen}
        onOpenChange={() => closeNodeEditingSidebar()}
      >
        <Box
          css={{
            backgroundColor: "$gray2",
            gridRow: "1",
            gap: "$4",
            display: "grid",
            alignItems: "center",
            paddingInline: "$5",
            marginLeft: "-$1",
          }}
          className={darkTheme}
        >
          <NodeSearch />
        </Box>
        <SidebarContent css={{ gridRow: "2" }}>
          {selectedNodeId ? (
            <NodeEditingSidebar nodeId={selectedNodeId} />
          ) : (
            <p>Bitte wähle einen Knoten aus</p>
          )}
        </SidebarContent>
      </SidebarRoot>
    </>
  );
};
