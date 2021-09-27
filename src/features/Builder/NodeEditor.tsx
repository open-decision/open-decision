import {
  Box,
  Input,
  styled,
  StyleObject,
} from "@open-legal-tech/design-system";
import { useActor } from "@xstate/react";
import { SidebarContent, SidebarRoot, SidebarToggle } from "components/Sidebar";
import React, { useRef } from "react";
import { NewNodeButton } from "./components/NewNodeButton";
import { Node } from "./components/Node";
import { NodeEditingSidebar } from "./components/NodeEditingSidebar";
import { NodeSearch } from "./components/NodeSearch/NodeSearch";
import { createEdges } from "./edgeCreationEngine/edgeCreationEngine";
import { Stage } from "./Stage";
import { useEditor } from "./state/useEditor";
import { useTree } from "./state/useTree";
import * as NodeType from "./types/Node";

const Container = styled("div", {
  display: "grid",
  height: "100%",
  width: "100vw",
  position: "relative",
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
  const service = useTree();
  const [state, send] = useActor(service);
  const tree = state.context;

  const {
    selectedNodeId,
    setSelectedNodeId,
    reactFlowInstance,
    setReactFlowInstance,
    isNodeEditingSidebarOpen,
    setNodeEditingSidebarOpen,
  } = useEditor();

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const sourceNodeId = useRef<string | undefined>(undefined);

  if (state.matches("pending")) {
    return <div>Loading</div>;
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
    ...Object.values(tree.nodes).map((node) => ({
      ...node,
      style: { padding: 0, stroke: "transparent" },
    })),
    ...createEdges(tree.nodes),
  ];

  return (
    <>
      <Container ref={reactFlowWrapper} css={css}>
        <Stage
          onPaneClick={() => {
            setNodeEditingSidebarOpen(false);
          }}
          nodeTypes={{ default: Node }}
          elements={elements}
          onElementsRemove={(elementsToRemove) =>
            send([
              {
                type: "deleteNode",
                ids: elementsToRemove.map((element) => element.id),
              },
            ])
          }
          onConnectStart={(event) => {
            if (event.target instanceof HTMLDivElement) {
              sourceNodeId.current = event.target.dataset.nodeid;
            }
          }}
          onConnectEnd={(event) => {
            if (
              event.target instanceof HTMLDivElement &&
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
          onLoad={setReactFlowInstance}
          onElementClick={(_event, node) => {
            setNodeEditingSidebarOpen(true);
            setSelectedNodeId(node.id);
          }}
          // onEdgeUpdate={(oldEdge, newConnection) => {
          //   return send({
          //     type: "updatePath",
          //     nodeId,
          //   });
          // }}
          // onEdgeUpdateEnd={(event, edge) => {
          //   if (
          //     event.target instanceof HTMLDivElement &&
          //     event.target.dataset.nodeid
          //   ) {
          //     send({
          //       type: "updateEdge",
          //       id: edge.id,
          //       data: {
          //         target: event.target.dataset.nodeid,
          //       },
          //     });
          //   }
          // }}
          onNodeDragStop={(_event, node) =>
            send({ type: "updateNode", id: node.id, node })
          }
          style={{
            gridColumn: "1 / -1",
            gridRow: "1",
          }}
        />
        <NewNodeButton
          css={{
            position: "absolute",
            top: "20px",
            left: "20px",
            colorScheme: "success",
            borderRadius: "$full",
            backgroundColor: "$colorScheme2",
            zIndex: "$10",
          }}
        />
      </Container>
      <SidebarRoot
        css={{
          zIndex: 5,
          display: "grid",
          gridTemplateRows: "inherit",
          gridRow: "1 / -1",
          gridColumn: "2",
        }}
        open={isNodeEditingSidebarOpen}
        onOpenChange={(newOpenState = false) =>
          setNodeEditingSidebarOpen(newOpenState)
        }
      >
        <Box
          css={{
            backgroundColor: "$gray12",
            gridRow: "1",
            gap: "$4",
            display: "flex",
            alignItems: "center",
            paddingInline: "$4",
            borderLeft: "2px solid $gray8",
          }}
        >
          <NodeSearch />
          <SidebarToggle
            position="right"
            css={{ width: "40px", height: "40px" }}
          />
        </Box>
        <SidebarContent css={{ gridRow: "2" }}>
          <NodeEditingSidebar nodeId={selectedNodeId} />
        </SidebarContent>
      </SidebarRoot>
    </>
  );
};
